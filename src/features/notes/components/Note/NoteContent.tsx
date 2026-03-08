import { useState } from "react"

import { useNotesStore } from "../../stores/useNotesStore"
import type { Note } from "../../types/note"
import { EditorContent } from "@tiptap/react"
import { useNoteEditor } from "../../../../hooks/useNoteEditor"

type NoteContentProps = {
    note: Note
}

export default function NoteContent({ note }: NoteContentProps) {
    const selectedNoteId = useNotesStore((store) => store.selectedNoteId)
    const editor = useNoteEditor()
    const [localEditing, setLocalEditing] = useState(false)

    const isEditing = selectedNoteId === note.id && localEditing

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
            className="p-2 flex-1 overflow-auto min-h-0"
            onDoubleClick={handleDoubleClick}
            data-no-pan={localEditing ? false : true}
        >
            {isEditing ? (
                <EditorContent editor={editor} onKeyDown={onEscapeKeyDown} />
            ) : (
                <div
                    className="truncate"
                    onPointerDown={() =>
                        selectedNoteId === note.id && setLocalEditing(true)
                    }
                    dangerouslySetInnerHTML={{ __html: note.content }}
                />
            )}
        </div>
    )
}
