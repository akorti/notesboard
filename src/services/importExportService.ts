import { API_BASE_URL, getUserToken } from '../config/apiConfig'
import { Board } from "../types/Board"
import { Note } from "../types/Note"

export async function exportData() {
    const response = await fetch(`${API_BASE_URL}/export`, {
        headers: {
            'x-user-token': getUserToken(),
            'x-app-key': import.meta.env.VITE_APP_SECRET_KEY
        },
    });
    if (!response.ok) throw new Error('Failed to export data');
    return await response.json()
}

export async function importData(data: { boards: Board[]; notes: Note[] }) {
    const response = await fetch(`${API_BASE_URL}/import`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-token': getUserToken(),
            'x-app-key': import.meta.env.VITE_APP_SECRET_KEY
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to import data');
}
