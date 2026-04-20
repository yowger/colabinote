import {
    autoUpdate,
    flip,
    offset,
    shift,
    useFloating,
} from "@floating-ui/react"
import { useLayoutEffect, useRef } from "react"

import { useBoardInteractionStore } from "../../features/boards/stores/useBoardInteractionStore"
import { useNoteUiStateStore } from "../../features/interactions/stores/useNoteUiStateStore"
import { useNoteActions } from "../../core/yjs/notes/useNoteActions"
import FloatingToolbar from "../toolbar/FloatingToolbar"
import ColorTool from "../toolbar/ColorTool"
import RemoveTool from "../toolbar/RemoveTool"
import DraggableNote from "./DraggableNote"
import { getAnchorFromPlacement } from "../../core/notes/helpers/floating"
import { usePresenceUsers } from "../../core/presence/hooks/usePresenceUsers"
import PresenceOverlayLayer from "../presence/PresenceOverlayLayer"
import { usePresenceActions } from "../../core/presence/hooks/usePresenceActions"

import type { NoteActionPayload } from "../../core/notes/types/note"

type NotesLayerProps = {
    noteIds: string[]
    canvasRef: React.RefObject<HTMLDivElement | null>
}

const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(value, max))
}

function computeNextPosition(
    data: Extract<NoteActionPayload, { action: "move" }>,
    rect: DOMRect,
) {
    const mouseX = data.clientX - rect.left
    const mouseY = data.clientY - rect.top

    const x = mouseX - data.offsetX
    const y = mouseY - data.offsetY

    const maxX = rect.width - data.note.width
    const maxY = rect.height - data.note.height

    return {
        x: clamp(x, 0, maxX),
        y: clamp(y, 0, maxY),
    }
}

export default function NotesLayer({ noteIds, canvasRef }: NotesLayerProps) {
    const { updateNote } = useNoteActions()
    const selectNote = useNoteUiStateStore((store) => store.selectNote)
    const selectedNoteId = useNoteUiStateStore((store) => store.selectedNoteId)
    const activeInteraction = useBoardInteractionStore(
        (store) => store.activeInteraction,
    )

    const users = usePresenceUsers({ excludeSelf: true })
    const { clearAction } = usePresenceActions()

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

    const handleInteractionEnd = (data: NoteActionPayload) => {
        if (!canvasRef.current) return
        const rect = canvasRef.current.getBoundingClientRect()

        clearAction()

        if (data.action === "move") {
            const { x, y } = computeNextPosition(data, rect)

            updateNote(data.note.id, { x, y })
            return
        }

        if (data.action === "resize") {
            updateNote(data.note.id, {
                width: data.note.width,
                height: data.note.height,
            })
        }
    }

    useLayoutEffect(() => {
        const element = selectedNoteId
            ? noteRefs.current.get(selectedNoteId)
            : null

        if (!element) return

        refs.setReference(element)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNoteId])

    return (
        <>
            {noteIds.map((noteId) => (
                <DraggableNote
                    key={noteId}
                    noteId={noteId}
                    onSelect={selectNote}
                    onInteractionEnd={handleInteractionEnd}
                    setNode={(element) => {
                        if (element) {
                            noteRefs.current.set(noteId, element)
                        } else {
                            noteRefs.current.delete(noteId)
                        }
                    }}
                />
            ))}

            <PresenceOverlayLayer users={users} noteRefs={noteRefs} />

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
