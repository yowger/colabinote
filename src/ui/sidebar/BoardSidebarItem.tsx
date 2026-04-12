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

    return isEditing ? (
        <div className="px-3 py-2 rounded-md border border-border bg-bg-soft flex gap-2 items-center shadow-sm">
            <input
                autoFocus
                className="flex-1 outline-none text-sm bg-transparent text-text placeholder:text-text-muted"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onFinishEdit(id, localTitle)
                    if (e.key === "Escape") onFinishEdit(id, null)
                }}
            />

            <button
                onClick={() => onFinishEdit(id, localTitle)}
                className="text-text-muted hover:text-text transition"
            >
                ✓
            </button>

            <button
                onClick={() => onFinishEdit(id, null)}
                className="text-text-muted hover:text-text transition"
            >
                ✕
            </button>
        </div>
    ) : (
        <div
            onClick={() => setActiveBoard(id)}
            className={`
            group flex items-center justify-between px-4 h-11 rounded-md cursor-pointer
            transition-all duration-150
            ${
                isActive
                    ? "bg-bg text-text font-medium"
                    : "hover:bg-bg text-text-muted"
            }
        `}
        >
            <span className="text-sm truncate ms-2">{title || "Untitled"}</span>

            <Menu as="div" className="relative">
                <MenuButton
                    onClick={(event) => event.stopPropagation()}
                    className="
                    p-2 rounded-md
                    opacity-0 group-hover:opacity-100
                    hover:bg-bg
                    transition
                "
                >
                    <EllipsisVertical size={16} className="text-text-muted" />
                </MenuButton>

                <MenuItems
                    anchor="right start"
                    className="
                    mt-2 w-36 origin-top-right
                    rounded-md bg-bg-soft shadow-md border border-border
                    focus:outline-none z-50
                "
                >
                    <div className="py-1 text-sm text-text">
                        <MenuItem>
                            {() => (
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        onStartEdit(id)
                                    }}
                                    className="
                                    flex items-center gap-2 w-full px-3 py-2
                                    hover:bg-bg
                                    transition
                                "
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
                                    className="
                                    flex items-center gap-2 w-full px-3 py-2
                                    hover:bg-bg
                                    transition
                                "
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
