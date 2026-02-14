import { ExpandIcon, MaximizeIcon, PencilIcon, TrashIcon } from "lucide-react"
import { clsx } from "clsx"

import ColorPicker from "./ColorPicker"
import { NOTE_COLORS, type NoteColor } from "../constants/noteColors"

type BaseTool = {
    id: string
}

type ButtonTool = BaseTool & {
    type: "button"
    icon: React.ElementType
    title: string
    onClick?: () => void
    onPointerDown?: (e: React.PointerEvent) => void
}

type RenderTool = BaseTool & {
    type: "render"
    render: () => React.ReactNode
}

type Tool = ButtonTool | RenderTool

type NoteToolsProps = {
    isEditing?: boolean
    onColorChange?: (color: NoteColor) => void
    onEdit: () => void
    onDelete?: () => void
    onMaximize?: () => void
    onResizePointerDown?: (e: React.PointerEvent) => void
}

export default function NoteTools({
    isEditing,
    onColorChange,
    onEdit,
    onDelete,
    onResizePointerDown,
    onMaximize,
}: NoteToolsProps) {
    const tools: Tool[] = [
        {
            id: "color",
            type: "render",
            render: () => (
                <ColorPicker
                    colors={NOTE_COLORS}
                    onSelect={(color) => {
                        onColorChange?.(color)
                    }}
                />
            ),
        },
        {
            id: "edit",
            type: "button",
            icon: PencilIcon,
            title: "Edit",
            onClick: onEdit,
        },
        {
            id: "delete",
            type: "button",
            icon: TrashIcon,
            title: "Delete",
            onClick: onDelete,
        },
        {
            id: "maximize",
            type: "button",
            icon: MaximizeIcon,
            title: "Maximize",
            onClick: onMaximize,
        },
        {
            id: "resize",
            type: "button",
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
                "relative flex flex-wrap justify-end gap-2 px-2 py-1 transition",
                "opacity-0 pointer-events-auto",
                "group-hover:opacity-100 group-hover:pointer-events-auto",
                isEditing && "opacity-100 pointer-events-auto",
            )}
            onPointerDown={(e) => e.stopPropagation()}
        >
            {tools.map((tool) => {
                if (tool.type === "render") {
                    return (
                        <div key={tool.id} className="relative">
                            {tool.render()}
                        </div>
                    )
                }

                const Icon = tool.icon

                return (
                    <div className="relative z-90">
                        <button
                            key={tool.id}
                            title={tool.title}
                            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
                            onClick={tool.onClick}
                            onPointerDown={(e) => {
                                e.stopPropagation()
                                tool.onPointerDown?.(e)
                            }}
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
