import React, { useEffect } from 'react'
import { Note } from '../types/Note'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { MdAccessTime, MdUpdate } from 'react-icons/md'

interface NoteCardProps {
    note: Note
    onEdit: (note: Note) => void
    onDelete: (id: number) => void
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString()
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
    useEffect(() => {
        Prism.highlightAll()
    }, [note.content])

    return (
        <div
            className={`relative rounded-lg p-4 hover:shadow-md transition ${note.color}`}
        >
            <div className="absolute top-2 right-2 flex space-x-2">
                <button
                    onClick={() => onEdit(note)}
                    className="text-blue-700 hover:text-yellow-500"
                    title="Éditer"
                >
                    <FaEdit size={18} />
                </button>
                <button
                    onClick={() => onDelete(note.id)}
                    className="text-red-500 hover:text-red-600"
                    title="Supprimer"
                >
                    <FaTrash size={18} />
                </button>
            </div>
            <h2 className="text-4xl text-black font-bold mb-2">{note.title}</h2>

            <div
                className="text-gray-700 flex-1 note-content"
                dangerouslySetInnerHTML={{ __html: note.content }}
            />
            <div className="flex items-center text-sm text-gray-500 gap-4 mb-4">
                <div className="flex items-center gap-1">
                    <MdAccessTime className="text-gray-400" />
                    <span>Created at : {formatDate(note.createdAt ?? '')}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MdUpdate className="text-gray-400" />
                    <span>Updated at : {formatDate(note.updatedAt ?? '')}</span>
                </div>
            </div>
        </div>
    )
}

export default NoteCard
