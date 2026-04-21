import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyleKit } from "@tiptap/extension-text-style"
import Collaboration from "@tiptap/extension-collaboration"
import * as Y from "yjs"

type UseNoteEditorOptions = {
    fragment: Y.XmlFragment | null
    noteId: string
}

export function useNoteEditor({ fragment, noteId }: UseNoteEditorOptions) {
    const editor = useEditor({
        extensions: [
            TextStyleKit,
            StarterKit.configure({
                undoRedo: false,
            }),
            Collaboration.configure({
                document: fragment?.doc,
                field: noteId,
            }),
        ],
        editorProps: {
            attributes: {
                class: "prose prose-sm focus:outline-none",
            },
        },
    })

    return editor
}
