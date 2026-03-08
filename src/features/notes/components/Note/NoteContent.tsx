import { useState } from "react"

import { useNotesStore } from "../../stores/useNotesStore"
import type { Note } from "../../types/note"
import { EditorContent } from "@tiptap/react"
import { useNoteEditor } from "../../../../hooks/useNoteEditor"
import BubbleMenuComponent from "../NoteTools/BubbleMenu"

type NoteContentProps = {
    note: Note
}

export default function NoteContent({ note }: NoteContentProps) {
    const selectedNoteId = useNotesStore((store) => store.selectedNoteId)
    const editor = useNoteEditor()
    const [localEditing, setLocalEditing] = useState(false)

    const isEditing = selectedNoteId === note.id && localEditing

    const handleOnPointerDown = () => {
        if (selectedNoteId !== note.id || isEditing) return

        setLocalEditing(true)
    }

    const handleDoubleClick = () => {
        if (selectedNoteId === note.id) {
            setLocalEditing(true)
            editor.commands.focus("end")
        }
    }

    const onEscapeKeyDown = (keyEvent: React.KeyboardEvent) => {
        if (keyEvent.key === "Escape") {
            setLocalEditing(false)
        }
    }

    return (
        <div
            className="p-5 flex-1 overflow-auto min-h-0"
            onDoubleClick={handleDoubleClick}
            data-no-pan={isEditing ? true : false}
        >
            {isEditing ? (
                <>
                    <EditorContent
                        editor={editor}
                        onKeyDown={onEscapeKeyDown}
                    />
                    <BubbleMenuComponent editor={editor} />
                </>
            ) : (
                <div
                    className="truncate"
                    onPointerDown={handleOnPointerDown}
                    dangerouslySetInnerHTML={{ __html: note.content }}
                />
            )}
        </div>
    )
}
