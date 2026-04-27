import { useState } from "react"
import { Plus } from "lucide-react"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"

import BoardSidebarItem from "./BoardSidebarItem"
import { useBoards } from "../../features/boards/hooks/useBoards"
import { useCreateBoard } from "../../features/boards/hooks/useCreateBoard"
import { useUpdateBoardTitle } from "../../features/boards/hooks/useUpdateBoardTitle"
import { useDeleteBoard } from "../../features/boards/hooks/useDeleteBoard"
import { useBoardsStore } from "../../features/boards/stores/useBoardsStore"
import { useRoomStore } from "../../core/hocuspocus/store/useRoomStore"
import { APP_VERSION } from "../../constants/versions"

export default function BoardSidebar() {
    const { data: boards = [], isLoading } = useBoards()
    const createBoard = useCreateBoard()
    const updateBoard = useUpdateBoardTitle()
    const deleteBoard = useDeleteBoard()
    const activeBoardId = useBoardsStore((store) => store.activeBoardId)
    const setActiveBoard = useBoardsStore((store) => store.setActiveBoard)
    const setRoomId = useRoomStore((store) => store.setRoomId)

    const [editingBoardId, setEditingBoardId] = useState<string | null>(null)
    const [boardToDelete, setBoardToDelete] = useState<string | null>(null)

    const handleAddBoard = () => {
        createBoard.mutate(undefined, {
            onSuccess: (newBoard) => {
                setEditingBoardId(newBoard.id)
            },
        })
    }

    const handleSelect = (id: string) => {
        setActiveBoard(id)
        setRoomId(id)
    }

    const handleFinishEdit = (id: string, newTitle: string | null) => {
        const title =
            newTitle && newTitle.trim() !== "" ? newTitle : "Untitled Board"

        updateBoard.mutate({
            id,
            title,
        })

        setEditingBoardId(null)
    }

    const handleStartEdit = (id: string) => {
        setEditingBoardId(id)
    }

    const handleConfirmDelete = () => {
        if (!boardToDelete) return

        deleteBoard.mutate(boardToDelete)
        setBoardToDelete(null)
    }

    return (
        <>
            <aside className="w-64 shrink-0 flex flex-col bg-bg-soft border-r border-border">
                <div className="flex items-center justify-between px-4 h-12">
                    <span className="ml-2 tracking-wide text-text">
                        Notebooks
                    </span>

                    <button
                        onClick={handleAddBoard}
                        className="p-1.5 rounded-md hover:bg-bg transition"
                    >
                        <Plus size={16} className="text-text-muted" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-0.5">
                    {isLoading && (
                        <div className="px-4 py-2 text-sm text-text-muted">
                            Loading notebooks... I'm using free plan so it might
                            be slow.
                        </div>
                    )}

                    {!isLoading &&
                        boards?.map((board) => (
                            <BoardSidebarItem
                                key={board.id}
                                id={board.id}
                                title={board.title}
                                isActive={activeBoardId === board.id}
                                isEditing={editingBoardId === board.id}
                                onSelect={handleSelect}
                                onStartEdit={handleStartEdit}
                                onFinishEdit={handleFinishEdit}
                                onDelete={(id) => setBoardToDelete(id)}
                            />
                        ))}

                    {!isLoading && boards.length === 0 && (
                        <div className="px-6">
                            <button
                                onClick={handleAddBoard}
                                className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                            >
                                Create your first notebook
                            </button>
                        </div>
                    )}
                </div>

                <div className="px-4 py-2 text-xs text-text-muted border-t border-border">
                    {APP_VERSION}
                </div>
            </aside>

            <Dialog
                open={!!boardToDelete}
                onClose={() => setBoardToDelete(null)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-bg-soft border border-border rounded-xl shadow-lg p-6 w-full max-w-sm">
                        <DialogTitle className="text-lg font-medium text-text">
                            Delete notebook?
                        </DialogTitle>

                        <p className="text-sm text-text-muted mt-2">
                            This action cannot be undone.
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setBoardToDelete(null)}
                                className="px-3 py-1.5 rounded-md hover:bg-bg text-text"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmDelete}
                                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90"
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
