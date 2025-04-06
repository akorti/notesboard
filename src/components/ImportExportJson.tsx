import React, { useRef, useState } from 'react'
import { exportData, importData } from '../services/importExportService'
import { useBoardsStore } from '../stores/boardsStore'
import Loader from './Loader'
import { Board } from '../types/Board'
import { Note } from '../types/Note'

type Props = {
    onSuccess: (message: string) => void
    onError: (message: string) => void
};


const ImportExportJson: React.FC<Props> = ({ onSuccess, onError }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isImporting, setIsImporting] = useState(false)

    const { fetchBoards } = useBoardsStore()

    const handleExport = async () => {
        try {
            const data = await exportData()
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            })
            const now = new Date()
            const timestamp = now.toISOString().replace(/[:.]/g, '-')
            const filename = `backup-${timestamp}.json`
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            link.remove()
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Export failed:', error)
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsImporting(true)

        try {
            const text = await file.text()
            const json = JSON.parse(text)

            if (
                typeof json !== 'object' ||
                !Array.isArray(json.boards) ||
                !Array.isArray(json.notes)
            ) {
                setIsModalOpen(false)
                onError('Invalid file format: expected keys "boards" and "notes" with array values.')
            }
            if ((json.boards as Board[]).some((b: Board) => typeof b.id !== 'number' || typeof b.name !== 'string')) {
                setIsModalOpen(false)
                onError('Invalid board structure in file.')
            }
            if ((json.notes as Note[]).some((n: Note) => typeof n.id !== 'number' || typeof n.title !== 'string')) {
                setIsModalOpen(false)
                onError('Invalid note structure in file.')
            }
            await importData(json)

            await fetchBoards()
            onSuccess('Data imported successfully!')
            setIsModalOpen(false)
        } catch (error) {
            console.error('Import failed:', error)
        } finally {
            setIsImporting(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    };

    return (
        <div className="flex justify-end items-center gap-4">
            <button
                onClick={handleExport}
                className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Export JSON
            </button>

            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
                Import JSON
            </button>

            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleImport}
                style={{ display: 'none' }}
            />

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
                        <h2 className="text-lg font-semibold mb-4">Import JSON</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Select a `.json` file containing your boards and notes.
                        </p>

                        {isImporting ? (
                            <Loader />
                        ) : (
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                >
                                    Choose File
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImportExportJson
