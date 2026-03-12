import { useState } from "react"
import { useBoardsStore } from "../stores/useBoardsStore"
import BoardItem from "./BoardItem"

export default function BoardsSidebar() {
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
        <aside className="w-64 shrink-0 border-r p-2 flex flex-col">
            <div className="flex-1 space-y-1  overflow-hidden">
                {boards.map((board) => (
                    <BoardItem
                        key={board.id}
                        id={board.id}
                        title={board.title}
                        isEditing={editingBoardId === board.id}
                        onStartEdit={handleStartEdit}
                        onFinishEdit={handleFinishEdit}
                    />
                ))}
            </div>

            <button
                onClick={handleAddBoard}
                className="mt-2 text-sm px-3 py-2 rounded hover:bg-neutral-100 text-left"
            >
                + Add Board
            </button>
        </aside>
    )
}
