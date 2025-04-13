import React from "react"
import { useBoardsStore } from "../stores/boardsStore"
import { FaTrash } from "react-icons/fa"
import { Board } from "../types/Board"

const BoardSidebar: React.FC = () => {
    const { boards, selectedBoard, setSelectedBoard, removeBoard } = useBoardsStore()
    const handleDeleteBoard = async(board: Board) => {
        if (window.confirm(`Voulez-vous vraiment supprimer le board "${board.name}" ?`)) {
           await removeBoard(board.id)
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 board-title">Boards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {boards.map((board) => (
                    <div
                        key={board.id}
                        onClick={() => setSelectedBoard(board.id)}
                        className={`w-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer 
                            ${selectedBoard === board.id ? "border-b-4 border-red-400" : ""}`}
                    >

                        <div className="flex justify-between items-start mb-4">
                            <p className="font-bold">{board.name}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteBoard(board);
                                }}
                                className="cursor-pointer text-red-400 hover:text-red-600"
                            >
                                <FaTrash size={14}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default BoardSidebar;
