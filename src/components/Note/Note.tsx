import { EditorContent } from "@tiptap/react"
import { useEffect } from "react"

import MenuBar from "./Editor/MenuBar"
import NoteTools from "./Tools/Tools"
import { useNoteEditor } from "../../hooks/useNoteEditor"
import { getNoteColor, type NoteColor } from "./constants/noteColors"

export type Note = {
    id: number
    x: number
    y: number
    width: number
    height: number
    text: string
    color?: NoteColor
    isEditing?: boolean
}

export type NoteProps = {
    note: Note
    onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void
    onResizePointerDown?: (e: React.PointerEvent) => void
    onStartEdit: (id: number) => void
    onCommitText: (id: number, text: string) => void
    onCancelEdit?: (id: number) => void
    onColorChange?: (id: number, color: Note["color"]) => void
}

export default function Note({
    note,
    onPointerDown,
    onResizePointerDown,
    onStartEdit,
    onCancelEdit,
    onColorChange,
}: NoteProps) {
    const editor = useNoteEditor(note.text)

    const { bg: noteColor, headerBg } = getNoteColor(note.color ?? "yellow")

    useEffect(() => {
        if (note.isEditing && editor) {
            requestAnimationFrame(() => {
                editor.commands.focus("end")
            })
        }
    }, [note.isEditing, editor])

    return (
        <div
            className={`group absolute rounded shadow flex flex-col ${noteColor}`}
            style={{
                left: note.x,
                top: note.y,
                width: note.width,
                height: note.height,
            }}
        >
            <div
                className={`py-2 px-2 flex items-center rounded-t ${headerBg}`}
                onPointerDown={onPointerDown}
            >
                <span className="text-xs font-medium text-gray-700 pointer-events-auto">
                    Note Title
                </span>
            </div>

            <section
                data-no-drag
                className="flex-1 flex flex-col min-h-0 relative"
            >
                <div className="p-2 flex-1 overflow-auto min-h-0">
                    {note.isEditing ? (
                        <EditorContent
                            data-no-drag
                            editor={editor}
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    onCancelEdit?.(note.id)
                                }
                            }}
                            className="bg-white/25 rounded min-h-0"
                        />
                    ) : (
                        <div
                            className="tiptap prose prose-sm max-w-none cursor-text"
                            onMouseDown={(e) => {
                                e.stopPropagation()
                                onStartEdit(note.id)
                            }}
                            dangerouslySetInnerHTML={{ __html: note.text }}
                        />
                    )}
                </div>
            </section>

            <div className="bg-white/50">
                {editor && note.isEditing && (
                    <MenuBar data-no-drag editor={editor} />
                )}

                <NoteTools
                    data-no-drag
                    isEditing={note.isEditing}
                    onEdit={() => onStartEdit(note.id)}
                    onDelete={() => {}}
                    onColorChange={(color: NoteColor) => {
                        console.log("")
                        onColorChange?.(note.id, color)
                    }}
                    onResizePointerDown={onResizePointerDown}
                />
            </div>
        </div>
    )
}
