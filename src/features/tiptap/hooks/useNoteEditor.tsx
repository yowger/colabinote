import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextStyleKit } from "@tiptap/extension-text-style"
import Collaboration from "@tiptap/extension-collaboration"
import Image from "@tiptap/extension-image"
import * as Y from "yjs"

import { useCloudinaryBulkUpload } from "../../../core/uploads/hooks/useCloudinaryBuldUpload"

type UseNoteEditorOptions = {
    fragment: Y.XmlFragment | null
    noteId: string
}

export function useNoteEditor({ fragment, noteId }: UseNoteEditorOptions) {
    const { upload } = useCloudinaryBulkUpload()

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
            Image,
        ],

        editorProps: {
            attributes: {
                class: "prose prose-sm focus:outline-none",
            },

            handleDrop: (_view, event) => {
                event.preventDefault()
                event.stopPropagation()

                const files = Array.from(event.dataTransfer?.files || [])
                const images = files.filter((files) =>
                    files.type.startsWith("image/"),
                )

                if (!images.length) return false

                uploadImages(images)
                return true
            },

            handlePaste: (_view, event) => {
                const items = Array.from(event.clipboardData?.items || [])

                const images: File[] = []

                for (const item of items) {
                    if (item.type.startsWith("image/")) {
                        const file = item.getAsFile()
                        if (file) images.push(file)
                    }
                }

                if (!images.length) return false

                uploadImages(images)
                return true
            },
        },
    })

    const uploadImages = async (files: File[]) => {
        if (!editor) return

        try {
            const results = await upload(files)

            results.forEach((img) => {
                editor.chain().focus().setImage({ src: img.url }).run()
            })
        } catch (err) {
            console.error("Upload failed:", err)
        }
    }

    return editor
}
