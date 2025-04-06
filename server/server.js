import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    const appKey = req.headers['x-app-key'];
    const expectedKey = process.env.APP_SECRET_KEY;

    if (!appKey || appKey !== expectedKey) {
        return res.status(403).json({ error: 'Unauthorized app access' });
    }

    next();
});

app.use((req, res, next) => {
    const userToken = req.headers['x-user-token'];
    if (!userToken || typeof userToken !== 'string') {
        return res.status(401).json({ error: 'User token required' });
    }
    req.userToken = userToken;
    next();
});

async function initDB() {
    return open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });
}

async function setupDatabase(db) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS boards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          userToken TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS notes (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         title TEXT NOT NULL,
         content TEXT NOT NULL,
         color TEXT NOT NULL,
         category TEXT NOT NULL,
         boardId INTEGER NOT NULL,
         userToken TEXT NOT NULL,
         FOREIGN KEY (boardId) REFERENCES boards(id) ON DELETE CASCADE
            );
    `);
}

(async () => {
    try {
        const db = await initDB();
        await setupDatabase(db);

        app.get('/boards', async (req, res) => {
            const boards = await db.all(
                'SELECT * FROM boards WHERE userToken = ?',
                req.userToken
            );
            res.json(boards);
        });

        app.post('/boards', async (req, res) => {
            const { name } = req.body;
            if (!name) return res.status(400).json({ error: 'Name is required' });

            const result = await db.run(
                'INSERT INTO boards (name, userToken) VALUES (?, ?)',
                [name, req.userToken]
            );
            res.json({ id: result.lastID, name });
        });

        app.delete('/boards/:id', async (req, res) => {
            const { id } = req.params;
            const board = await db.get('SELECT * FROM boards WHERE id = ?', id);

            if (!board || board.userToken !== req.userToken) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            await db.run('DELETE FROM boards WHERE id = ?', id);
            res.json({ success: true });
        });

        app.get('/boards/:boardId/notes', async (req, res) => {
            const { boardId } = req.params;
            const notes = await db.all(
                'SELECT * FROM notes WHERE boardId = ? AND userToken = ?',
                [boardId, req.userToken]
            );
            res.json(notes);
        });

        app.post('/boards/:boardId/notes', async (req, res) => {
            const { boardId } = req.params;
            const { title, content, color, category } = req.body;

            if (!title || !content || !color || !category) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const result = await db.run(
                'INSERT INTO notes (title, content, color, category, boardId, userToken) VALUES (?, ?, ?, ?, ?, ?)',
                [title, content, color, category, boardId, req.userToken]
            );

            res.json({ id: result.lastID, title, content, color, category, boardId });
        });

        app.put('/notes/:id', async (req, res) => {
            const { id } = req.params;
            const { title, content, color, category } = req.body;

            const note = await db.get('SELECT * FROM notes WHERE id = ?', id);
            if (!note || note.userToken !== req.userToken) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            await db.run(
                'UPDATE notes SET title = ?, content = ?, color = ?, category = ? WHERE id = ?',
                [title, content, color, category, id]
            );

            res.json({ success: true });
        });

        app.delete('/notes/:id', async (req, res) => {
            const { id } = req.params;

            const note = await db.get('SELECT * FROM notes WHERE id = ?', id);
            if (!note || note.userToken !== req.userToken) {
                return res.status(403).json({ error: 'Forbidden' });
            }

            await db.run('DELETE FROM notes WHERE id = ?', id);
            res.json({ success: true });
        });

        app.get('/export', async (req, res) => {
            const boards = await db.all('SELECT * FROM boards WHERE userToken = ?', req.userToken);
            const notes = await db.all('SELECT * FROM notes WHERE userToken = ?', req.userToken);
            res.json({ boards, notes });
        });

        app.post('/import', async (req, res) => {
            const { boards = [], notes = [] } = req.body;

            await db.run('BEGIN TRANSACTION');

            try {
                for (const board of boards) {
                    await db.run(
                        'INSERT OR REPLACE INTO boards (id, name, userToken) VALUES (?, ?, ?)',
                        [board.id, board.name, req.userToken]
                    );
                }

                for (const note of notes) {
                    await db.run(
                        'INSERT OR REPLACE INTO notes (id, title, content, color, category, boardId, userToken) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [
                            note.id,
                            note.title,
                            note.content,
                            note.color,
                            note.category,
                            note.boardId,
                            req.userToken,
                        ]
                    );
                }

                await db.run('COMMIT');
                res.json({ success: true });
            } catch (error) {
                await db.run('ROLLBACK');
                console.error(error);
                res.status(500).json({ error: 'Import failed' });
            }
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la DB :', error);
    }
})();
