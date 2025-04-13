import { API_BASE_URL, getAuthHeaders } from '../config/apiConfig'
import { Board } from "../types/Board"
import { Note } from "../types/Note"

export async function exportData() {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/export`, {
        headers
    });
    if (!response.ok) throw new Error('Failed to export data');
    return await response.json()
}

export async function importData(data: { boards: Board[]; notes: Note[] }) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}/import`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to import data');
}
