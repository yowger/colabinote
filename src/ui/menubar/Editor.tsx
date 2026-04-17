import type { Editor } from "@tiptap/core"
import { useEditorState } from "@tiptap/react"
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
} from "lucide-react"
import { clsx } from "clsx"

import { menuBarStateSelector } from "./MenuBarSelector"

type MenuItem = {
    icon: React.ElementType
    label: string
    onClick: () => void
    isActive?: boolean
    isDisabled?: boolean
}

export default function MenuBar({ editor }: { editor: Editor | null }) {
    const state = useEditorState({
        editor,
        selector: menuBarStateSelector,
    })
    if (!editor || !state) return null

    const items: MenuItem[] = [
        {
            icon: Bold,
            label: "Bold",
            onClick: () => editor.chain().focus().toggleBold().run(),
            isActive: state.isBold,
            isDisabled: !state.canBold,
        },
        {
            icon: Italic,
            label: "Italic",
            onClick: () => editor.chain().focus().toggleItalic().run(),
            isActive: state.isItalic,
            isDisabled: !state.canItalic,
        },
        {
            icon: Strikethrough,
            label: "Strike",
            onClick: () => editor.chain().focus().toggleStrike().run(),
            isActive: state.isStrike,
            isDisabled: !state.canStrike,
        },
        {
            icon: Code,
            label: "Code",
            onClick: () => editor.chain().focus().toggleCode().run(),
            isActive: state.isCode,
            isDisabled: !state.canCode,
        },
        {
            icon: Heading1,
            label: "H1",
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: state.isHeading1,
        },
        {
            icon: Heading2,
            label: "H2",
            onClick: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: state.isHeading2,
        },
        {
            icon: List,
            label: "Bullet list",
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            isActive: state.isBulletList,
        },
        {
            icon: ListOrdered,
            label: "Ordered list",
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: state.isOrderedList,
        },
        {
            icon: Quote,
            label: "Blockquote",
            onClick: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: state.isBlockquote,
        },
        {
            icon: Undo,
            label: "Undo",
            onClick: () => editor.chain().focus().undo().run(),
            isDisabled: !state.canUndo,
        },
        {
            icon: Redo,
            label: "Redo",
            onClick: () => editor.chain().focus().redo().run(),
            isDisabled: !state.canRedo,
        },
    ]

    return (
        <div
            data-component="note-editor"
            className="flex flex-wrap gap-1 px-2 py-1 transition"
        >
            {items.map(
                ({ icon: Icon, label, onClick, isActive, isDisabled }) => (
                    <button
                        key={label}
                        title={label}
                        disabled={isDisabled}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={onClick}
                        className={clsx(
                            "p-2 rounded hover:bg-gray-200 disabled:opacity-40",
                            isActive && "bg-gray-800 text-white",
                        )}
                    >
                        <Icon size={16} />
                    </button>
                ),
            )}
        </div>
    )
}
