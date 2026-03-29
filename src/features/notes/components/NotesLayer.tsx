import {
    autoUpdate,
    flip,
    offset,
    shift,
    useFloating,
} from "@floating-ui/react"
import { useLayoutEffect, useRef } from "react"

import { useBoardInteractionStore } from "../stores/useBoardInteractionStore"
import { useNotesStore } from "../stores/useNotesStore"
import { useNoteActions } from "../hooks/useNoteActions"
import FloatingToolbar from "./NoteTools/FloatingToolbar"
import ColorTool from "./NoteTools/ColorTool"
import RemoveTool from "./NoteTools/RemoveTool"
import DraggableNote, { type DropDataProps } from "./Note/DraggableNote"
import { getAnchorFromPlacement } from "./helpers/floating"
import { useNotesMetaActions } from "../../presence/hooks/useNotesMetaActions"

type NotesLayerProps = {
    noteIds: string[]
    canvasRef: React.RefObject<HTMLDivElement | null>
}

const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(value, max))
}

export default function NotesLayer({ noteIds, canvasRef }: NotesLayerProps) {
    const { updateNote } = useNoteActions()
    const { updateNotesMeta } = useNotesMetaActions()

    const selectedNoteId = useNotesStore((store) => store.selectedNoteId)
    const activeInteraction = useBoardInteractionStore(
        (s) => s.activeInteraction,
    )

    const { x, y, refs, strategy, placement } = useFloating({
        strategy: "fixed",
        placement: "right-start",
        middleware: [offset(8), flip(), shift()],
        whileElementsMounted: (reference, floating, update) =>
            autoUpdate(reference, floating, update),
    })

    const noteRefs = useRef(new Map<string, HTMLDivElement | null>())

    const anchor = getAnchorFromPlacement(placement)

    const isTransforming =
        activeInteraction === "note-drag" || activeInteraction === "note-resize"

    const handleDrop = ({
        note,
        clientX,
        clientY,
        offsetX,
        offsetY,
    }: DropDataProps) => {
        if (!canvasRef.current) return
        const rect = canvasRef.current.getBoundingClientRect()

        const mouseX = clientX - rect.left
        const mouseY = clientY - rect.top

        let x = mouseX - offsetX
        let y = mouseY - offsetY

        const maxX = rect.width - (note?.width ?? 0)
        const maxY = rect.height - (note?.height ?? 0)

        x = clamp(x, 0, maxX)
        y = clamp(y, 0, maxY)

        updateNote(note.id, { x, y })
        updateNotesMeta(note.id, { x, y })
    }

    useLayoutEffect(() => {
        const element = selectedNoteId
            ? noteRefs.current.get(selectedNoteId)
            : null

        if (!element) return

        refs.setReference(element)
    }, [selectedNoteId, refs])

    return (
        <>
            {noteIds.map((noteId) => (
                <DraggableNote
                    key={noteId}
                    noteId={noteId}
                    onDragEnd={handleDrop}
                    setNode={(element) => {
                        if (element) {
                            noteRefs.current.set(noteId, element)
                        } else {
                            noteRefs.current.delete(noteId)
                        }
                    }}
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
