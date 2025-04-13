import React from 'react'
import { Note } from '../types/Note'
import NoteCard from './NoteCard'

interface NotesBoardProps {
    notes: Note[]
    onEdit: (note: Note) => void
    onDelete: (id: number) => void
}

const NotesBoard: React.FC<NotesBoardProps> = ({ notes, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
                <div
                    key={note.id}
                    className={notes.length === 1 ? 'col-span-full' : ''}
                >
                    <NoteCard note={note} onEdit={onEdit} onDelete={onDelete} />
                </div>
            ))}
            {notes.length === 0 && (
                <div className="col-span-full text-center text-gray-500">
                    No note found.
                </div>
            )}
        </div>
    )
}

export default NotesBoard
