import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { useNotesStore } from "../../hooks/useNotesStore"
import type { Note } from "../../types/note"

export default function NoteEditor({ note }: { note: Note }) {
    const updateNote = useNotesStore((s) => s.updateNote)

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
