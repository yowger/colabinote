import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyleKit } from "@tiptap/extension-text-style"
import { useEffect } from "react"

import MenuBar from "./Editor/MenuBar"
import NoteTools from "./Tools"

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
    // onCommitText,
    onCancelEdit,
}: NoteProps) {
    // const [draft, setDraft] = useState(note.text)

    const editor = useEditor({
        extensions: [TextStyleKit, StarterKit],
        content: note.text || "<h1>Title</h1><p>hello</p>",
        // editable: !!note.isEditing,
        // onUpdate: ({ editor }) => {
        //     setDraft(editor.getHTML())
        // },
        editorProps: {
            attributes: {
                class: "prose prose-sm focus:outline-none",
            },
        },
    })

    useEffect(() => {
        if (note.isEditing && editor) {
            requestAnimationFrame(() => {
                editor.commands.focus("end")
            })
        }
    }, [note.isEditing, editor])

    return (
        <div
            // onBlur={() => note.isEditing && onCommitText(note.id, draft)}
            className="group absolute bg-yellow-200 rounded shadow flex flex-col"
            style={{
                left: note.x,
                top: note.y,
                width: note.width,
                height: note.height,
            }}
        >
            <div
                className=" py-2 flex items-center px-2 bg-yellow-300 rounded-t"
                onPointerDown={onPointerDown}
            >
                <span className="text-xs font-medium text-gray-700 pointer-events-auto">
                    Note Title
                </span>
            </div>

            <section className="flex-1 flex flex-col min-h-0 relative">
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
                            className="tiptap prose prose-sm max-w-none"
                            onMouseDown={(e) => {
                                e.stopPropagation()
                                onStartEdit(note.id)
                            }}
                            dangerouslySetInnerHTML={{ __html: note.text }}
                        />
                    )}
                </div>

                {editor && note.isEditing && (
                    <div
                        data-no-drag
                        className="flex items-center gap-1 px-2 py-1 bg-white/50 border-t"
                    >
                        <MenuBar editor={editor} />
                    </div>
                )}
            </section>

            <NoteTools
                isEditing={note.isEditing}
                onEdit={() => onStartEdit(note.id)}
                onDelete={() => {}}
                onResizePointerDown={onResizePointerDown}
            />
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
