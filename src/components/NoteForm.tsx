import React, { useState, useEffect, FormEvent } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNotesStore } from '../stores/notesStore'
import { Note } from '../types/Note'

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image'],
        ['code-block']
    ],
    clipboard: { matchVisual: false },
}

const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image', 'code-block'
]

interface NoteFormProps {
    noteToEdit?: Note | null
    onClose: () => void
    boardId: number
}

const colorOptions = [
    { name: 'Orange-Rose', className: 'bg-gradient-to-r from-orange-100 to-rose-100' },
    { name: 'Bleu-Cyan', className: 'bg-gradient-to-r from-blue-100 to-cyan-100' },
    { name: 'Violet-Indigo', className: 'bg-gradient-to-r from-purple-100 to-indigo-100' },
    { name: 'Vert-Émeraude', className: 'bg-gradient-to-r from-green-100 to-emerald-100' },
    { name: 'Rouge-Rose', className: 'bg-gradient-to-r from-red-100 to-pink-100' },
    { name: 'Jaune-Lime', className: 'bg-gradient-to-r from-yellow-100 to-lime-100' },
    { name: 'Bleu-Violet', className: 'bg-gradient-to-r from-blue-200 to-violet-200' },
    { name: 'Rose-Fuchsia', className: 'bg-gradient-to-r from-rose-200 to-fuchsia-200' },
    { name: 'Gris-Zinc', className: 'bg-gradient-to-r from-gray-200 to-zinc-200' },
]

const NoteForm: React.FC<NoteFormProps> = ({ noteToEdit, onClose, boardId }) => {
    const { addNote, editNote, fetchNotes } = useNotesStore()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [category, setCategory] = useState('')
    const [selectedColor, setSelectedColor] = useState(colorOptions[0].className)

    useEffect(() => {
        if (noteToEdit) {
            setTitle(noteToEdit.title)
            setContent(noteToEdit.content)
            setCategory(noteToEdit.category || '')
            setSelectedColor(noteToEdit.color || colorOptions[0].className)
        }
    }, [noteToEdit])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) return

        if (noteToEdit) {
            editNote(noteToEdit.id, { title, content, color: selectedColor, category, boardId })
        } else {
            addNote({ title, content, color: selectedColor, category, boardId })
        }
        setTitle('')
        setContent('')
        setCategory('')
        setSelectedColor(colorOptions[0].className)
        fetchNotes(boardId)
        onClose()
    }

    return (
        <div className="w-full h-full p-4 bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col h-full gap-4 text-black bg-white rounded shadow p-6"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Note title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 bg-white px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Note category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2 border bg-white border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div>
                    <h5 className="font-medium mb-2">Background Color</h5>
                    <div className="flex flex-wrap gap-3">
                        {colorOptions.map((option) => (
                            <button
                                key={option.name}
                                type="button"
                                onClick={() => setSelectedColor(option.className)}
                                className={`w-10 h-10 rounded-lg border-2 ${option.className} ${selectedColor === option.className ? 'border-black' : 'border-transparent'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-h-[200px] mb-3">
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        placeholder="Note content (you can insert code blocks)"
                        className="h-full"
                    />
                </div>

                <div className="flex justify-end gap-4 mt-6 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 cursor-pointer text-white rounded hover:bg-gray-500 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 cursor-pointer text-white rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {noteToEdit ? 'Update note' : 'Add note'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default NoteForm
