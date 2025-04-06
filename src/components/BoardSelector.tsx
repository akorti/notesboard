import React, { useState } from 'react'
import { useBoardsStore } from '../stores/boardsStore'
import { Board } from '../types/Board'

const BoardSelector: React.FC = () => {
    const { boards, addBoard, selectedBoard, setSelectedBoard } = useBoardsStore()
    const [newBoardName, setNewBoardName] = useState('')

    const handleAddBoard = () => {
        if (newBoardName.trim()) {
            addBoard(newBoardName.trim())
            setNewBoardName('')

        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex flex-wrap gap-2 mb-4">
                {boards.map((board: Board) => (
                    <button
                        key={board.id}
                        onClick={() => setSelectedBoard(board.id)}
                        className={`px-3 py-1 rounded transition ${
                            selectedBoard === board.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-blue-500'
                        }`}
                    >
                        {board.name}
                    </button>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Nouveau board"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={handleAddBoard}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Ajouter
                </button>
            </div>
        </div>
    )
}

export default BoardSelector
