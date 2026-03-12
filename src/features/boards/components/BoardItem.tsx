import { useEffect, useState } from "react"
import { useBoardsStore } from "../stores/useBoardsStore"

type BoardItemProps = {
    id: string
    title: string
    isEditing: boolean
    onStartEdit: (id: string) => void
    onFinishEdit: (id: string, newTitle: string | null) => void
}

export default function BoardItem({
    id,
    title,
    isEditing,
    onStartEdit,
    onFinishEdit,
}: BoardItemProps) {
    const [localTitle, setLocalTitle] = useState(title)
    const activeBoardId = useBoardsStore((s) => s.activeBoardId)
    const setActiveBoard = useBoardsStore((s) => s.setActiveBoard)
    const isActive = activeBoardId === id

    useEffect(() => {
        setLocalTitle(title)
    }, [title])

    if (isEditing) {
        return (
            <div className="px-3 py-2 rounded border flex gap-2 bg-white">
                <input
                    autoFocus
                    className="border-none outline-none flex-1"
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onFinishEdit(id, localTitle)
                        if (e.key === "Escape") onFinishEdit(id, null)
                    }}
                />

                <button
                    className="px-2 py-1 text-green-600 font-bold"
                    onClick={() => onFinishEdit(id, localTitle)}
                >
                    ✓
                </button>

                <button
                    className="px-2 py-1 text-red-600 font-bold"
                    onClick={() => onFinishEdit(id, null)}
                >
                    ✕
                </button>
            </div>
        )
    }

    return (
        <div
            onClick={() => setActiveBoard(id)} 
            onDoubleClick={() => onStartEdit(id)}
            className={`w-full text-left px-3 py-2 rounded flex justify-between items-center cursor-pointer hover:bg-neutral-100 ${
                isActive ? "bg-blue-100 font-semibold" : ""
            }`}
        >
            <span>{title}</span>
        </div>
    )
}
