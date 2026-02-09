import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyleKit } from "@tiptap/extension-text-style"

export function useNoteEditor(content: string | undefined) {
    const editor = useEditor({
        extensions: [TextStyleKit, StarterKit],
        content: content || "<p>New note</p>",
        editorProps: {
            attributes: {
                class: "prose prose-sm focus:outline-none",
            },
        },
    })

    return editor
}
