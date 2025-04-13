import React, { useState } from 'react'
import { useBoardsStore } from '../stores/boardsStore.ts'
import BoardModal from './BoardModal'
import { FaPlus, FaSearch } from "react-icons/fa"
import { APP_NAME } from '../config/appConfig.ts'

interface HeaderProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
    const { addBoard } = useBoardsStore()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleAddBoard = async (boardName: string) => {
        await addBoard(boardName)
        setIsModalOpen(false)
    }

    return (
        <header className="shadow w-full">
            <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm w-full">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4 sm:gap-0">

                        {/* Logo */}
                        <div className="flex justify-between items-center">
                            <div className="text-white logo font-bold text-xl">{APP_NAME}</div>
                        </div>

                        {/* Search & Add */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">

                            {/* Search Input */}
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="cursor-pointer rounded-lg bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap transition"
                            >
                                <FaPlus />
                                <span>Add new Board</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <BoardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddBoard}
            />
        </header>
    )
}

export default Header
