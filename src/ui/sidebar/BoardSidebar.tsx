import { useState } from "react"
import { useBoardsStore } from "../../features/boards/stores/useBoardsStore"

import BoardSidebarItem from "./BoardSidebarItem"

export default function BoardSidebar() {
    const boards = useBoardsStore((store) => store.boards)
    const setBoardTitle = useBoardsStore((store) => store.setBoardTitle)
    const addBoard = useBoardsStore((store) => store.addBoard)
    const [editingBoardId, setEditingBoardId] = useState<string | null>(null)

    const handleAddBoard = () => {
        const newBoardId = crypto.randomUUID()
        addBoard(newBoardId, "")
        setEditingBoardId(newBoardId)
    }

    const handleStartEdit = (id: string) => setEditingBoardId(id)

    const handleFinishEdit = (id: string, newTitle: string | null) => {
        if (newTitle === null || newTitle.trim() === "") {
            setBoardTitle(id, "Untitled Board")
        } else {
            setBoardTitle(id, newTitle)
        }
        setEditingBoardId(null)
    }

    return (
        <aside className="w-64 shrink-0 py-3 pr-3 flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {boards.map((board) => (
                    <BoardSidebarItem
                        key={board.id}
                        id={board.id}
                        title={board.title}
                        isEditing={editingBoardId === board.id}
                        onStartEdit={handleStartEdit}
                        onFinishEdit={handleFinishEdit}
                    />
                ))}

                <button
                    onClick={handleAddBoard}
                    className="mt-2 text-sm px-3 py-2 rounded hover:bg-neutral-100 text-left w-full"
                >
                    Add board
                </button>
            </div>
        </aside>
    )
}
