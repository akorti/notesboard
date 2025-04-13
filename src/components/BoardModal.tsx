import React, { useState } from 'react'
import Modal from 'react-modal'
import { FaTimes } from 'react-icons/fa'

Modal.setAppElement('#root');

interface BoardModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (boardName: string) => void
}

const BoardModal: React.FC<BoardModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [boardName, setBoardName] = useState('')

    const handleSubmit = () => {
        if (boardName.trim()) {
            onSubmit(boardName.trim())
            setBoardName('')
            onClose()
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add a Board</h2>
                <button onClick={onClose} className="text-gray-500 cursor-pointer hover:text-gray-700">
                    <FaTimes size={18} />
                </button>
            </div>
            <input
                type="text"
                placeholder="Board name"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
            />
            <div className="flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded">
                    Cancel
                </button>
                <button onClick={handleSubmit} className="px-4 cursor-pointer py-2 bg-green-600 hover:bg-green-700 text-white rounded">
                    Add
                </button>
            </div>
        </Modal>
    );
};

export default BoardModal;
