import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { useNoteUiStateStore } from "../../features/interactions/stores/useNoteUiStateStore"
import type { Note } from "../../core/notes/types/note"

export default function NoteEditor({ note }: { note: Note }) {
    const updateNote = useNoteUiStateStore((s) => s.updateNote)

    const editor = useEditor({
        extensions: [StarterKit],
        content: note.content,
        onUpdate({ editor }) {
            updateNote(note.id, {
                // content: editor.getJSON(),
                content: editor.getHTML(),
                updatedAt: Date.now(),
            })
        },
    })

    return <EditorContent editor={editor} />
}
