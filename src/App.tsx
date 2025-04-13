import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import NoteForm from './components/NoteForm'
import BoardList from './components/BoardList'
import NotesBoard from './components/NotesBoard'
import CategoryFilterBadges from './components/CategoryFilterBadges'
import { useNotesStore } from './stores/notesStore'
import { useBoardsStore } from './stores/boardsStore'
import Loader from './components/Loader'
import { Note } from './types/Note'
import { FaPlus } from 'react-icons/fa'
import { IoMdClose } from "react-icons/io"
import ImportExportJson from "./components/ImportExportJson.tsx"
import { setDynamicFavicon } from './utils/setDynamicFavicon'

const App: React.FC = () => {
    const { boards, selectedBoard, setSelectedBoard, fetchBoards } = useBoardsStore()
    const { notes, fetchNotes, removeNote } = useNotesStore()
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [noteToEdit, setNoteToEdit] = useState<Note | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('')
    const [isSearchLoading, setIsSearchLoading] = useState(false)


    useEffect(() => {
        if (selectedBoard) {
            const board = boards.find((b) => b.id === selectedBoard)
            if (board) {
                const initial = board.name[0]?.toUpperCase() || 'N'
                setDynamicFavicon(initial)
            }
        }
    }, [selectedBoard, boards])

    useEffect(() => {
        if (selectedBoard !== null) {
            const board = boards.find(b => b.id === selectedBoard)
            if (board) {
                const count = notes.filter(n => n.boardId === board.id).length
                document.title = `${board.name} (${count} note${count !== 1 ? 's' : ''}) - NotesBoard`
            }
        } else {
            document.title = 'NotesBoard'
        }
    }, [selectedBoard, boards, notes])

    useEffect(() => {
        fetchBoards()
    }, [])

    useEffect(() => {
        if (selectedBoard) {
            fetchNotes(selectedBoard)
        }
    }, [selectedBoard])

    useEffect(() => {
        if (!selectedBoard && boards.length > 0) {
            setSelectedBoard(boards[0].id)
        }
    }, [boards, selectedBoard])

    const handleAddNoteClick = () => {
        setNoteToEdit(null)
        setIsFormOpen(true)
    }

    const handleEditNote = (note: Note) => {
        setNoteToEdit(note)
        setIsFormOpen(true)
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setNoteToEdit(null)
    }

    const boardNotes = notes.filter((note) => note.boardId === selectedBoard)

    const uniqueCategories = Array.from(
        new Set(boardNotes.map((note) => note.category || ''))
    )

    const filteredNotes = searchQuery
        ? boardNotes.filter((note) => {
            const query = searchQuery.toLowerCase()
            return (
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query) ||
                (note.category || '').toLowerCase().includes(query)
            )
        })
        : selectedCategoryFilter
            ? boardNotes.filter((note) => (note.category || '') === selectedCategoryFilter)
            : boardNotes

    useEffect(() => {
        if (searchQuery) {
            setIsSearchLoading(true)
            const timer = setTimeout(() => {
                setIsSearchLoading(false)
            }, 400)
            return () => clearTimeout(timer)
        } else {
            setIsSearchLoading(false)
        }
    }, [searchQuery, notes])

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {successMessage && (
                    <div className="relative my-4 bg-green-100 border-l-4 max-w-1/2 border-green-500 text-green-700 p-4 rounded-lg">
                        <button
                            onClick={() => setSuccessMessage('')}
                            className="absolute cursor-pointer top-5 right-2 text-green-700 hover:text-green-900"
                            title="Close"
                        >
                            <IoMdClose />
                        </button>
                        <p>{successMessage}</p>
                    </div>
                )}
                {errorMessage && (
                    <div className="relative my-4 bg-red-200 border-l-4 max-w-1/2 border-red-500 text-red-500 p-4 rounded-lg">
                        <button
                            onClick={() => setErrorMessage('')}
                            className="absolute cursor-pointer top-5 right-2 text-red-700 hover:text-red-900"
                            title="Close"
                        >
                            <IoMdClose />
                        </button>
                        <p>{errorMessage}</p>
                    </div>
                )}
            <ImportExportJson onError={(msg) => setErrorMessage(msg)} onSuccess={(msg) => setSuccessMessage(msg)}/>
            <BoardList/>
            <div
                className="flex-1 bg-white m-2 overflow-auto rounded-lg shadow-lg p-6 border-t-4 border-indigo-500">
                    <div className="">
                        {selectedBoard !== null ? (
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={handleAddNoteClick}
                                    className="flex items-center justify-center px-4 py-2 cursor-pointer bg-indigo-500 text-white rounded hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
                                    title="Add a note"
                                >
                                    <FaPlus size={20}/>
                                </button>
                            </div>
                        ) : null}

                        <CategoryFilterBadges
                            categories={uniqueCategories}
                            selectedCategory={selectedCategoryFilter}
                            onSelectCategory={setSelectedCategoryFilter}
                            onClearCategory={() => setSelectedCategoryFilter('')}
                        />
                    </div>

                    <div className="px-4 py-2 text-gray-300 text-sm">
                        {filteredNotes.length} note{filteredNotes.length !== 1 && 's'} trouvée{filteredNotes.length !== 1 && 's'}.
                    </div>

                    {isFormOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            {selectedBoard !== null && (
                                <NoteForm
                                    noteToEdit={noteToEdit}
                                    onClose={handleFormClose}
                                    boardId={selectedBoard}
                                />
                            )}
                        </div>
                    )}

                    <main className="p-4">
                        {isSearchLoading ? (
                            <Loader/>
                        ) : selectedBoard !== null ? (
                            <NotesBoard
                                notes={filteredNotes}
                                onEdit={handleEditNote}
                                onDelete={removeNote}
                            />
                        ) : null}
                    </main>

                </div>
        </div>
</div>
)
}

export default App
