import { ExpandIcon, PencilIcon, TrashIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export type Note = {
    id: number
    x: number
    y: number
    width: number
    height: number
    text: string
    isEditing?: boolean
}

export type NoteProps = {
    note: Note
    onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void
    onResizePointerDown?: (e: React.PointerEvent) => void
    onStartEdit: (id: number) => void
    onCommitText: (id: number, text: string) => void
    onCancelEdit?: (id: number) => void
}

export default function Note({
    note,
    onPointerDown,
    onResizePointerDown,
    onStartEdit,
    onCommitText,
    onCancelEdit,
}: NoteProps) {
    const [draft, setDraft] = useState(note.text)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (note.isEditing) {
            requestAnimationFrame(() => {
                const el = textareaRef.current
                if (!el) return

                el.focus()

                const length = el.value.length
                el.setSelectionRange(length, length)
            })
        }
    }, [note.isEditing])

    return (
        <div
            className="group absolute bg-yellow-200 rounded shadow select-none flex flex-col"
            style={{
                left: note.x,
                top: note.y,
                width: note.width,
                height: note.height,
            }}
        >
            <div
                className="group h-7 flex items-center px-2 bg-yellow-300 rounded-t"
                onPointerDown={onPointerDown}
            >
                <span className="text-xs font-medium text-gray-700 pointer-events-auto">
                    Note Title
                </span>
            </div>

            <div
                className="p-2 h-full"
                onDoubleClick={() => onStartEdit(note.id)}
            >
                {note.isEditing ? (
                    <textarea
                        ref={textareaRef}
                        value={draft}
                        className="w-full h-full resize-none outline-none bg-white/35 rounded"
                        onChange={(e) => setDraft(e.target.value)}
                        onPointerDown={(e) => e.stopPropagation()}
                        onBlur={() => onCommitText(note.id, draft)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                onCommitText(note.id, draft)
                            }

                            if (e.key === "Escape") {
                                onCancelEdit?.(note.id)
                            }
                        }}
                    />
                ) : (
                    <div
                        className="hover:cursor-text wrap-normal"
                        onMouseDown={(e) => {
                            e.stopPropagation()
                            onStartEdit(note.id)
                        }}
                    >
                        {note.text}
                    </div>
                )}
            </div>

            <div
                className={`
                    flex items-center justify-end gap-2
                    px-2 py-1
                    bg-white/50
                    opacity-0 pointer-events-none
                    transition
                    group-hover:opacity-100 group-hover:pointer-events-auto
                    ${note.isEditing ? "opacity-100 pointer-events-auto" : ""}
                `}
                onPointerDown={(e) => e.stopPropagation()}
            >
                <button
                    className="text-sm px-2 py-1 rounded hover:bg-gray-100"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => onStartEdit(note.id)}
                >
                    <PencilIcon className="inline w-4 h-4" />
                </button>

                <button
                    className="text-sm px-2 py-1 rounded hover:bg-gray-100"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <TrashIcon className="inline w-4 h-4" />
                </button>

                <button
                    className="text-sm px-2 py-1 rounded hover:bg-gray-100"
                    onPointerDown={(e) => {
                        e.stopPropagation()
                        onResizePointerDown?.(e)
                    }}
                >
                    <ExpandIcon className="inline w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

/*
TODO
- Editable note text
- Note resize
- Note selection / outline
- Multiplayer ownership
*/
