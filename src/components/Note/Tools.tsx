import { ExpandIcon, PencilIcon, TrashIcon } from "lucide-react"
import { clsx } from "clsx"

type Tool = {
    id: string
    icon: React.ElementType
    title: string
    onClick?: () => void
    onPointerDown?: (e: React.PointerEvent) => void
}

type NoteToolsProps = {
    isEditing?: boolean
    onEdit: () => void
    onDelete?: () => void
    onResizePointerDown?: (e: React.PointerEvent) => void
}

export default function NoteTools({
    isEditing,
    onEdit,
    onDelete,
    onResizePointerDown,
}: NoteToolsProps) {
    const tools: Tool[] = [
        {
            id: "edit",
            icon: PencilIcon,
            title: "Edit",
            onClick: onEdit,
        },
        {
            id: "delete",
            icon: TrashIcon,
            title: "Delete",
            onClick: onDelete,
        },
        {
            id: "resize",
            icon: ExpandIcon,
            title: "Resize",
            onPointerDown: (e) => {
                e.stopPropagation()
                onResizePointerDown?.(e)
            },
        },
    ]

    return (
        <div
            className={clsx(
                "flex flex-wrap justify-end gap-2 px-2 py-1 bg-white/50 transition",
                "opacity-0 pointer-events-none",
                "group-hover:opacity-100 group-hover:pointer-events-auto",
                isEditing && "opacity-100 pointer-events-auto",
            )}
            onPointerDown={(e) => e.stopPropagation()}
        >
            {tools.map(({ id, icon: Icon, title, onClick, onPointerDown }) => (
                <button
                    key={id}
                    title={title}
                    className="p-1 rounded hover:bg-gray-100"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={onClick}
                    onPointerDown={onPointerDown}
                >
                    <Icon className="w-4 h-4" />
                </button>
            ))}
        </div>
    )
}
