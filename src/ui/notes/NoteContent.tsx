import { EditorContent } from "@tiptap/react"
import { useOnClickOutside } from "usehooks-ts"
import { useRef } from "react"

// import { useNoteUiStateStore } from "../../colabinote/src/features/interactions/stores/useNoteUiStateStore"
// import BubbleMenuComponent from "../../colabinote/src/ui/toolbar/BubbleMenu"
import { useNoteEditor } from "../../features/tiptap/hooks/useNoteEditor"

import type { Note } from "../../core/notes/types/note"

import { type RefObject } from "react"
import * as Y from "yjs"

import { useNoteUiStateStore } from "../../features/interactions/stores/useNoteUiStateStore"
import BubbleMenuComponent from "../toolbar/BubbleMenu"

type NoteContentProps = {
    note: Note
    fragment: Y.XmlFragment | null
}

export default function NoteContent({ note, fragment }: NoteContentProps) {
    const ref = useRef<HTMLDivElement>(null)

    // const [localEditing, setLocalEditing] = useState(false)
    const selectedNoteId = useNoteUiStateStore((store) => store.selectedNoteId)

    const editor = useNoteEditor({
        noteId: note.id,
        fragment: fragment,
    })

    const previewHtml = editor?.getHTML()

    const isEditing = selectedNoteId === note.id

    const handleOnPointerDown = () => {
        // if (selectedNoteId !== note.id || isEditing) return
        // setLocalEditing(true)
    }

    const handleDoubleClick = () => {
        // if (selectedNoteId !== note.id || isEditing) return
        // setLocalEditing(true)
        // editor.commands.focus("end")
    }

    const onEscapeKeyDown = () =>
        // keyEvent: React.KeyboardEvent
        {
            // if (keyEvent.key === "Escape") {
            //     setLocalEditing(false)
            // }
        }

    const handleClickOutside = () => {
        // if (isEditing && !editor?.isFocused) {
        //     setLocalEditing(false)
        // }
    }

    useOnClickOutside(ref as RefObject<HTMLElement>, handleClickOutside)

    return (
        <div
            ref={ref}
            className="p-4 flex-1 overflow-y-auto min-h-0 scrollbar-thin"
            onDoubleClick={handleDoubleClick}
            // data-no-pan={isEditing ? true : false}
        >
            <BubbleMenuComponent editor={editor} />
            {isEditing && editor ? (
                <EditorContent editor={editor} onKeyDown={onEscapeKeyDown} />
            ) : (
                <div
                    className="prose prose-sm wrap-break-words"
                    onPointerDown={handleOnPointerDown}
                    dangerouslySetInnerHTML={{ __html: previewHtml || "" }}
                />
            )}
        </div>
    )
}
