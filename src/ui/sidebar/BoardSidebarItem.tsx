import { useEffect, useState } from "react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { EllipsisVertical } from "lucide-react"

import { useBoardsStore } from "../../features/boards/stores/useBoardsStore"

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
            <div className="px-3 py-2 rounded-md border border-slate-200 bg-white flex gap-2 items-center shadow-sm">
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

                <button onClick={() => onFinishEdit(id, localTitle)}>✓</button>
                <button onClick={() => onFinishEdit(id, null)}>✕</button>
            </div>
        )
    }

    return (
        <div
            onClick={() => setActiveBoard(id)}
            className={`
                group flex items-center justify-between px-4 h-11 rounded-md cursor-pointer
                transition-all duration-150
                ${isActive ? "bg-white font-medium" : "hover:bg-slate-200/70"}
            `}
        >
            <span className="text-sm truncate ms-2">{title || "Untitled"}</span>

            <Menu as="div" className="relative">
                <MenuButton
                    onClick={(event) => event.stopPropagation()}
                    className="p-2 rounded-md opacity-0 group-hover:opacity-100 hover:bg-slate-300/60 transition"
                >
                    <EllipsisVertical size={16} />
                </MenuButton>

                <MenuItems
                    anchor="right start"
                    className="
                        mt-2 w-36 origin-top-right
                        rounded-md bg-white shadow-md border border-slate-200
                        focus:outline-none z-50
                    "
                >
                    <div className="py-1 text-sm">
                        <MenuItem>
                            {() => (
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        onStartEdit(id)
                                    }}
                                    className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-100 transition`}
                                >
                                    Rename
                                </button>
                            )}
                        </MenuItem>

                        <MenuItem>
                            {() => (
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        onDelete?.(id)
                                    }}
                                    className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-100 transition`}
                                >
                                    Remove
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        </div>
    )
}
