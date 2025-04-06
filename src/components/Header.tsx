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
    };

    return (
        <header className="shadow">
            <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center text-white logo">
                                { APP_NAME }
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
                            <div className="relative">
                                <input type="text" placeholder="Rechercher..."
                                       value={searchQuery}
                                       onChange={(e) => setSearchQuery(e.target.value)}
                                       className="w-64 pl-10 pr-4 py-2 border bg-white border-gray-300 rounded-lg focus:ring-custom focus:border-custom"/>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className={"text-gray-400"}/>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="!rounded-button cursor-pointer bg-white text-indigo-600 hover:bg-indigo-50 px-2 sm:px-4 py-2 flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
                                <FaPlus className="mr-2" /> Add Board
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <BoardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddBoard} />

        </header>
    )
}

export default Header
