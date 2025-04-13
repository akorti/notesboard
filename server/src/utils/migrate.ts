import fs from 'fs/promises'
import path from 'path'
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'migrations')

export async function runMigrations() {
    const db = await open({
        filename: path.join(__dirname, '..', '..', 'database.sqlite'),
        driver: sqlite3.Database,
    })
    console.log(`✅ Start migrations...`)
    await db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        runAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `)

    const appliedMigrations = await db.all<{ name: string }[]>(`SELECT name FROM migrations`)
    const appliedSet = new Set(appliedMigrations.map((m) => m.name))

    const files = await fs.readdir(MIGRATIONS_DIR)
    const sqlFiles = files.filter((f) => f.endsWith('.sql')).sort()

    for (const file of sqlFiles) {
        if (appliedSet.has(file)) {
            console.log(`✅ Migration already applied: ${file}`)
            continue
        }

        const filePath = path.join(MIGRATIONS_DIR, file)
        const sql = await fs.readFile(filePath, 'utf-8')

        try {
            await db.exec('BEGIN')

            // Ajout spécial pour la migration 003_add_timestamps_to_boards_and_notes.sql
            if (file === '003_add_timestamps_to_boards_and_notes.sql') {
                const boardCols = new Set(
                    (await db.all(`PRAGMA table_info(boards)`)).map(col => col.name)
                )
                const noteCols = new Set(
                    (await db.all(`PRAGMA table_info(notes)`)).map(col => col.name)
                )

                const alreadyExists =
                    boardCols.has('createdAt') && boardCols.has('updatedAt') &&
                    noteCols.has('createdAt') && noteCols.has('updatedAt')

                if (alreadyExists) {
                    console.log(`⚠️ Skipping ${file} (columns already exist)`)
                    await db.run(`INSERT INTO migrations (name) VALUES (?)`, file)
                    await db.exec('COMMIT')
                    continue
                }
            }

            await db.exec(sql)
            await db.run(`INSERT INTO migrations (name) VALUES (?)`, file)
            await db.exec('COMMIT')
            console.log(`✅ Migration applied: ${file}`)
        } catch (err) {
            await db.exec('ROLLBACK')
            console.error(`❌ Error applying migration: ${file}`, err)
            process.exit(1)
        }
    }


    await db.close()
}
