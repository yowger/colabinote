import { useEffect, useState } from "react"
import { useBoardsStore } from "../../features/boards/stores/useBoardsStore"
import { Pencil, Trash2 } from "lucide-react"

type BoardItemProps = {
    id: string
    title: string
    isEditing: boolean
    onStartEdit: (id: string) => void
    onFinishEdit: (id: string, newTitle: string | null) => void
    onDelete?: (id: string) => void
}

export default function BoardSidebarItem({
    id,
    title,
    isEditing,
    onStartEdit,
    onFinishEdit,
    onDelete,
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
            <div className="px-3 py-2 rounded-md border bg-white flex gap-2 items-center shadow-sm">
                <input
                    autoFocus
                    className="flex-1 outline-none text-sm"
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onFinishEdit(id, localTitle)
                        if (e.key === "Escape") onFinishEdit(id, null)
                    }}
                />

                <button
                    className=""
                    onClick={() => onFinishEdit(id, localTitle)}
                >
                    ✓
                </button>

                <button className="" onClick={() => onFinishEdit(id, null)}>
                    ✕
                </button>
            </div>
        )
    }

    return (
        <div
            onClick={() => setActiveBoard(id)}
            className={`
                group flex items-center justify-between px-4 py-4 rounded-tr-md rounded-br-md cursor-pointer
                transition-all duration-150
                ${isActive ? "bg-slate-200 font-medium" : "hover:bg-neutral-100"}
            `}
        >
            <span className="text-sm truncate">{title || "Untitled"}</span>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onStartEdit(id)
                    }}
                    className="p-1 rounded hover:bg-neutral-200"
                >
                    <Pencil size={14} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete?.(id)
                    }}
                    className="p-1 rounded hover:bg-red-100 text-red-500"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    )
}
