import { useNotesStore } from "../stores/useNotesStore"
import NoteItem from "./Note/NoteItem"
import {
    autoUpdate,
    flip,
    offset,
    shift,
    useFloating,
} from "@floating-ui/react"

export default function NotesLayer() {
    const notesMap = useNotesStore((store) => store.notes)
    const notes = Object.values(notesMap)
    const selectedNoteId = useNotesStore((store) => store.selectedNoteId)

    const { x, y, refs, strategy } = useFloating({
        placement: "bottom",
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: (reference, floating, update) =>
            autoUpdate(reference, floating, update, {
                animationFrame: true, 
            }),
    })

    return (
        <>
            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    ref={(node) => {
                        if (selectedNoteId === note.id) {
                            refs.setReference(node)
                        }
                    }}
                    note={note}
                />
            ))}

            {selectedNoteId && (
                <div
                    ref={(node) => {
                        refs.setFloating(node)
                    }}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0,
                        backgroundColor: "black",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        pointerEvents: "none",
                        whiteSpace: "nowrap",
                        zIndex: 100,
                    }}
                >
                    Tooltip here
                </div>
            )}
        </>
    )
}
