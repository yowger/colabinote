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
    // Undo,
    // Redo,
    type LucideIcon,
} from "lucide-react"
import { BubbleMenu } from "@tiptap/react/menus"
import type { Editor } from "@tiptap/core"
import { useEditorState } from "@tiptap/react"

import { TipTapSTateSelector } from "./TiptapStateSelector"
import ToolbarButton from "./ToolbarButton"
import FloatingToolbar from "./FloatingToolbar"

type BubbleMenuProps = {
    editor: Editor
}

type MenuItem = {
    icon: LucideIcon
    label: string
    onClick: () => void
    isActive?: boolean
    isDisabled?: boolean
}

export default function BubbleMenuComponent({ editor }: BubbleMenuProps) {
    const state = useEditorState({
        editor,
        selector: TipTapSTateSelector,
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
        // {
        //     icon: Undo,
        //     label: "Undo",
        //     onClick: () => editor.chain().focus().undo().run(),
        //     isDisabled: !state.canUndo,
        // },
        // {
        //     icon: Redo,
        //     label: "Redo",
        //     onClick: () => editor.chain().focus().redo().run(),
        //     isDisabled: !state.canRedo,
        // },
    ]

    return (
        <BubbleMenu editor={editor} style={{ zIndex: 100 }}>
            <FloatingToolbar className="flex">
                {items.map(
                    ({ icon: Icon, label, onClick, isActive, isDisabled }) => (
                        <ToolbarButton
                            key={label}
                            icon={Icon}
                            title={label}
                            onClick={onClick}
                            disabled={isDisabled}
                            className={
                                isActive ? "bg-neutral-700 text-white z-50" : ""
                            }
                        />
                    ),
                )}
            </FloatingToolbar>
        </BubbleMenu>
    )
}
