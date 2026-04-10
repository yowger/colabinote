import { useState } from "react"
import { useBoardsStore } from "../../features/boards/stores/useBoardsStore"
import { Plus } from "lucide-react"

import BoardSidebarItem from "./BoardSidebarItem"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"

export default function BoardSidebar() {
    const boards = useBoardsStore((store) => store.boards)
    const setBoardTitle = useBoardsStore((store) => store.setBoardTitle)
    const addBoard = useBoardsStore((store) => store.addBoard)

    const [editingBoardId, setEditingBoardId] = useState<string | null>(null)
    const [boardToDelete, setBoardToDelete] = useState<string | null>(null)

    const handleAddBoard = () => {
        const newBoardId = crypto.randomUUID()
        addBoard(newBoardId, "")
        setEditingBoardId(newBoardId)
    }

    const handleConfirmDelete = () => {
        if (boardToDelete) {
            // deleteBoard(boardToDelete)
            setBoardToDelete(null)
        }
    }

    const handleStartEdit = (id: string) => setEditingBoardId(id)

    const handleFinishEdit = (id: string, newTitle: string | null) => {
        if (!newTitle || newTitle.trim() === "") {
            setBoardTitle(id, "Untitled Board")
        } else {
            setBoardTitle(id, newTitle)
        }
        setEditingBoardId(null)
    }

    return (
        <>
            <aside className="w-64 shrink-0 flex flex-col bg-slate-100 border-r border-slate-200">
                <div className="flex items-center justify-between px-4 h-12">
                    <span className="ml-2 tracking-wide">Notebooks</span>

                    <button
                        onClick={handleAddBoard}
                        className="
                    p-1.5 rounded-md
                  hover:bg-slate-200
                    transition
                    "
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-0.5">
                    {boards.map((board) => (
                        <BoardSidebarItem
                            key={board.id}
                            id={board.id}
                            title={board.title}
                            isEditing={editingBoardId === board.id}
                            onStartEdit={handleStartEdit}
                            onFinishEdit={handleFinishEdit}
                            onDelete={(id) => setBoardToDelete(id)}
                        />
                    ))}

                    {boards.length === 0 && (
                        <div className="text-xs text-neutral-400 px-2 py-3">
                            No notebooks yet
                        </div>
                    )}
                </div>
            </aside>

            <Dialog
                open={!!boardToDelete}
                onClose={() => setBoardToDelete(null)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
                        <DialogTitle className="text-lg font-medium">
                            Delete notebook?
                        </DialogTitle>

                        <p className="text-sm text-slate-500 mt-2">
                            This action cannot be undone.
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setBoardToDelete(null)}
                                className="px-3 py-1.5 rounded-md hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmDelete}
                                className="px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}
