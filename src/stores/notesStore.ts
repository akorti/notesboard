import { create } from 'zustand'
import { API_BASE_URL, getUserToken } from '../config/apiConfig'
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
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}/notes`, {
            headers: {
                'x-user-token': getUserToken(),
                'x-app-key': import.meta.env.VITE_APP_SECRET_KEY
            },
        })
        const data: Note[] = await response.json()
        set({ notes: data })
    },

    addNote: async (noteData) => {
        const response = await fetch(`${API_BASE_URL}/boards/${noteData.boardId}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-token': getUserToken(),
                'x-app-key': import.meta.env.VITE_APP_SECRET_KEY
            },
            body: JSON.stringify(noteData),
        });
        const newNote = await response.json()
        set((state) => ({ notes: [newNote, ...state.notes] }))
    },

    editNote: async (id, updatedData) => {
        await fetch(`${API_BASE_URL}/notes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-user-token': getUserToken(),
                'x-app-key': import.meta.env.VITE_APP_SECRET_KEY
            },
            body: JSON.stringify(updatedData),
        })
        set((state) => ({
            notes: state.notes.map((note) =>
                note.id === id ? { ...note, ...updatedData } : note
            ),
        }))
    },

    removeNote: async (id) => {
        await fetch(`${API_BASE_URL}/notes/${id}`, {
            method: 'DELETE',
            headers: {
                'x-user-token': getUserToken(),
                'x-app-key': import.meta.env.VITE_APP_SECRET_KEY
            },
        })
        set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
        }))
    },
}))
