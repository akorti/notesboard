import { create } from 'zustand'
import { API_BASE_URL, getAuthHeaders } from '../config/apiConfig'
import { Board } from '../types/Board'

interface BoardsState {
    boards: Board[];
    selectedBoard: number | null;
    fetchBoards: () => Promise<void>
    addBoard: (name: string) => Promise<void>
    removeBoard: (id: number) => Promise<void>
    setSelectedBoard: (id: number) => void
}

export const useBoardsStore = create<BoardsState>((set) => ({
    boards: [],
    selectedBoard: null,

    fetchBoards: async () => {
        try {
            const headers = await getAuthHeaders()
            const response = await fetch(`${API_BASE_URL}/boards`, {
                headers
            })
            if (!response.ok) throw new Error('Failed to fetch boards')
            const data: Board[] = await response.json()
            set({
                boards: data,
                selectedBoard: data.length > 0 ? data[0].id : null,
            })
        } catch (error) {
            console.error('Error fetching boards:', error)
        }
    },

    addBoard: async (name: string) => {
        try {
            const headers = await getAuthHeaders()
            const response = await fetch(`${API_BASE_URL}/boards`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ name }),
            })
            if (!response.ok) throw new Error('Failed to add board');
            const newBoard = await response.json()
            set((state) => ({
                boards: [...state.boards, newBoard],
                selectedBoard: newBoard.id,
            }))
        } catch (error) {
            console.error('Error adding board:', error)
        }
    },

    removeBoard: async (id: number) => {
        try {
            const headers = await getAuthHeaders()
            const response = await fetch(`${API_BASE_URL}/boards/${id}`, {
                method: 'DELETE',
                headers
            })
            if (!response.ok) throw new Error('Failed to delete board')
            set((state) => ({
                boards: state.boards.filter((b) => b.id !== id),
                selectedBoard: state.selectedBoard === id ? null : state.selectedBoard,
            }))
        } catch (error) {
            console.error('Error removing board:', error)
        }
    },

    setSelectedBoard: (id: number) => {
        set({ selectedBoard: id })
    },
}))
