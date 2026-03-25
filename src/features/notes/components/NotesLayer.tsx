import {
    autoUpdate,
    flip,
    offset,
    shift,
    useFloating,
} from "@floating-ui/react"

import { useBoardInteractionStore } from "../stores/useBoardInteractionStore"
import { useNotesStore } from "../stores/useNotesStore"
import { useNoteActions } from "../hooks/useNoteActions"
import FloatingToolbar from "./NoteTools/FloatingToolbar"
import ColorTool from "./NoteTools/ColorTool"
import RemoveTool from "./NoteTools/RemoveTool"
import DraggableNote, { type DropDataProps } from "./Note/DraggableNote"
import { getAnchorFromPlacement } from "./helpers/floating"

type NotesLayerProps = {
    noteIds: string[]
    canvasRef: React.RefObject<HTMLDivElement | null>
}

export default function NotesLayer({ noteIds, canvasRef }: NotesLayerProps) {
    const { updateNote } = useNoteActions()

    const selectedNoteId = useNotesStore((s) => s.selectedNoteId)
    const activeInteraction = useBoardInteractionStore(
        (s) => s.activeInteraction,
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

    const anchor = getAnchorFromPlacement(placement)

    const isTransforming =
        activeInteraction === "note-drag" || activeInteraction === "note-resize"

    const handleDrop = ({
        noteId,
        clientX,
        clientY,
        offsetX,
        offsetY,
    }: DropDataProps) => {
        if (!canvasRef.current) return
        const rect = canvasRef.current.getBoundingClientRect()

        const mouseX = clientX - rect.left
        const mouseY = clientY - rect.top

        const x = mouseX - offsetX
        const y = mouseY - offsetY

        updateNote(noteId, { x, y })
    }

    return (
        <>
            {noteIds.map((noteId) => (
                <DraggableNote
                    key={noteId}
                    canvasRef={canvasRef}
                    noteId={noteId}
                    onDrop={handleDrop}
                />
            ))}

            {selectedNoteId && !isTransforming && (
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

// <NoteItem
//     key={noteId}
//     ref={(node) => {
//         if (selectedNoteId === noteId) refs.setReference(node)
//     }}
//     noteId={noteId}
// />
