import { Dialog, DialogBackdrop, DialogTitle } from "@headlessui/react"
import { EditorContent } from "@tiptap/react"
import NoteTools from "../Note/Tools/Tools"
import { getNoteColor } from "../Note/constants/noteColors"
import { useNoteEditor } from "../../hooks/useNoteEditor"
import type { Note } from "../Note/Note"
import { XIcon } from "lucide-react"

export default function FocusedNoteOverlay({
    note,
    onClose,
    onCommitText,
    onColorChange,
}: {
    note: Note
    onClose: () => void
    onCommitText: (id: number, text: string) => void
    onColorChange: (id: number, color: Note["color"]) => void
}) {
    const editor = useNoteEditor(note.text)
    const { background: backgroundColor, headerBackground: headerColor } =
        getNoteColor(note.color ?? "yellow")

    return (
        <Dialog onClose={onClose} open className="fixed inset-0 z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex w-screen items-center justify-center">
                <div className="inline-block w-full max-w-2xl h-[80vh] bg-white shadow-2xl">
                    <div
                        className={`flex items-center justify-between px-4 py-2 ${headerColor}`}
                    >
                        <DialogTitle className="text-sm font-medium text-gray-700">
                            Note
                        </DialogTitle>
                        <button
                            onClick={() => {
                                onCommitText(
                                    note.id,
                                    editor?.getHTML() ?? note.text,
                                )
                                onClose()
                            }}
                            className="text-sm opacity-70 hover:opacity-100"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className={`flex flex-col h-full ${backgroundColor}`}>
                        <section className="flex-1 min-h-0 overflow-auto p-4">
                            <EditorContent
                                editor={editor}
                                className="flex tiptap prose max-w-none min-h-full"
                            />
                        </section>

                        <div className="bg-white/60 backdrop-blur-sm">
                            <NoteTools
                                isEditing={true}
                                onEdit={() => {}}
                                onDelete={() => {}}
                                onColorChange={(color) =>
                                    onColorChange(note.id, color)
                                }
                                onMaximize={() => {}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}
