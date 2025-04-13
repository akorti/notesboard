import { create } from 'zustand'
import { API_BASE_URL, getAuthHeaders } from '../config/apiConfig'
import { Note } from '../types/Note'


interface NotesState {
    notes: Note[]
    fetchNotes: (boardId: number) => Promise<void>
    addNote: (note: Omit<Note, 'id'>) => Promise<void>
    editNote: (id: number, updated: Omit<Note, 'id'>) => Promise<void>
    removeNote: (id: number) => Promise<void>
}

export const useNotesStore = create<NotesState>((set) => ({
    notes: [],

    fetchNotes: async (boardId) => {
        const headers = await getAuthHeaders()
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}/notes`, {
            headers
        })
        const data: Note[] = await response.json()
        set({ notes: data })
    },

    addNote: async (noteData) => {
        const headers = await getAuthHeaders()
        const response = await fetch(`${API_BASE_URL}/boards/${noteData.boardId}/notes`, {
            method: 'POST',
            headers,
            body: JSON.stringify(noteData),
        });
        const newNote = await response.json()
        set((state) => ({ notes: [newNote, ...state.notes] }))
    },

    editNote: async (id, updatedData) => {
        const headers = await getAuthHeaders()
        await fetch(`${API_BASE_URL}/notes/${id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updatedData),
        })
        set((state) => ({
            notes: state.notes.map((note) =>
                note.id === id ? { ...note, ...updatedData } : note
            ),
        }))
    },

    removeNote: async (id) => {
        const headers = await getAuthHeaders()
        await fetch(`${API_BASE_URL}/notes/${id}`, {
            method: 'DELETE',
            headers
        })
        set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
        }))
    },
}))
