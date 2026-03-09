import { EditorContent } from "@tiptap/react"
import { useRef, useState, type RefObject } from "react"
import { useDebounceCallback, useOnClickOutside } from "usehooks-ts"

import { useNotesStore } from "../../stores/useNotesStore"
import type { Note } from "../../types/note"
import { useNoteEditor } from "../../../../hooks/useNoteEditor"
import BubbleMenuComponent from "../NoteTools/BubbleMenu"

type NoteContentProps = {
    note: Note
}

export default function NoteContent({ note }: NoteContentProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [localEditing, setLocalEditing] = useState(false)
    const updateNote = useNotesStore((store) => store.updateNote)
    const selectedNoteId = useNotesStore((store) => store.selectedNoteId)
    const debouncedUpdate = useDebounceCallback((content: string) => {
        updateNote(note.id, { content })
    }, 500)
    const editor = useNoteEditor({
        content: note.content,
        onUpdate: debouncedUpdate,
    })

    const isEditing = selectedNoteId === note.id && localEditing

    const handleOnPointerDown = () => {
        if (selectedNoteId !== note.id || isEditing) return

        setLocalEditing(true)
    }

    const handleDoubleClick = () => {
        if (selectedNoteId !== note.id || isEditing) return

        setLocalEditing(true)
        editor.commands.focus("end")
    }

    const onEscapeKeyDown = (keyEvent: React.KeyboardEvent) => {
        if (keyEvent.key === "Escape") {
            setLocalEditing(false)
        }
    }

    const handleClickOutside = () => {
        if (isEditing && !editor?.isFocused) {
            setLocalEditing(false)
        }
    }

    useOnClickOutside(ref as RefObject<HTMLElement>, handleClickOutside)

    return (
        <div
            ref={ref}
            className="px-4 pb-4 flex-1 overflow-auto min-h-0"
            onDoubleClick={handleDoubleClick}
            data-no-pan={isEditing ? true : false}
        >
            {isEditing && editor ? (
                <>
                    <EditorContent
                        editor={editor}
                        onKeyDown={onEscapeKeyDown}
                    />
                    <BubbleMenuComponent editor={editor} />
                </>
            ) : (
                <div
                    className="flex-wrap"
                    onPointerDown={handleOnPointerDown}
                    dangerouslySetInnerHTML={{ __html: note.content }}
                />
            )}
        </div>
    )
}
