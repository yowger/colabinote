import {
    autoUpdate,
    flip,
    offset,
    shift,
    useFloating,
} from "@floating-ui/react"

import { useBoardInteractionStore } from "../stores/useBoardInteractionStore"
import { useNotesStore } from "../stores/useNotesStore"
import NoteItem from "./Note/NoteItem"
import FloatingToolbar from "./NoteTools/FloatingToolbar"
import ColorTool from "./NoteTools/ColorTool"
import RemoveTool from "./NoteTools/RemoveTool"
import { getAnchorFromPlacement } from "./helpers/floating"

export default function NotesLayer() {
    const notesMap = useNotesStore((store) => store.notes)
    const selectedNoteId = useNotesStore((store) => store.selectedNoteId)
    const activeInteraction = useBoardInteractionStore(
        (store) => store.activeInteraction,
    )
    const { x, y, refs, strategy, placement } = useFloating({
        strategy: "fixed",
        placement: "right-start",
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: (reference, floating, update) =>
            autoUpdate(reference, floating, update, {
                animationFrame: true,
            }),
    })

    const notes = Object.values(notesMap)

    const anchor = getAnchorFromPlacement(placement)

    const isNoteTransforming =
        activeInteraction === "note-drag" || activeInteraction === "note-resize"

    return (
        <>
            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    ref={(node) => {
                        if (selectedNoteId === note.id) refs.setReference(node)
                    }}
                    note={note}
                />
            ))}

            {selectedNoteId && !isNoteTransforming && (
                <FloatingToolbar
                    ref={(node) => refs.setFloating(node)}
                    style={{
                        position: strategy,
                        top: y ?? 0,
                        left: x ?? 0,
                    }}
                    className="pointer-events-auto flex flex-col gap-0.5 relative z-40"
                >
                    <ColorTool position={anchor} />
                    <RemoveTool position={anchor} />
                </FloatingToolbar>
            )}
        </>
    )
}
