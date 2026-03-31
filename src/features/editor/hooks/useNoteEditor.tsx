import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyleKit } from "@tiptap/extension-text-style"

type UseNoteEditorOptions = {
    content?: string
    onUpdate?: (content: string) => void
}

export function useNoteEditor({
    content,
    onUpdate,
}: UseNoteEditorOptions = {}) {
    const editor = useEditor({
        extensions: [TextStyleKit, StarterKit],
        content: content || "<p>New note</p>",
        editorProps: {
            attributes: {
                class: "prose prose-sm focus:outline-none",
            },
        },
        onUpdate({ editor }) {
            onUpdate?.(editor.getHTML())
        },
    })

    return editor
}
