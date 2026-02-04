import { useRef, useState } from "react"

import type { Note as NoteType } from "../components/Note"
import type { GhostNoteProps } from "../components/GhostNote"

export const NoteInteractionType = {
    DRAG: "drag" as const,
    RESIZE: "resize" as const,
}

type NoteInteraction =
    | {
          type: typeof NoteInteractionType.DRAG
          startX: number
          startY: number
          noteId: number
          noteStartX: number
          noteStartY: number
          noteWidth: number
          noteHeight: number
      }
    | {
          type: typeof NoteInteractionType.RESIZE
          startX: number
          startY: number
          noteId: number
          noteStartX: number
          noteStartY: number
          noteStartWidth: number
          noteStartHeight: number
      }
    | null

export function useNoteInteraction(
    boardSize: { width: number; height: number },
    onCommitNote: (id: number, updates: Partial<NoteType>) => void,
) {
    const [interaction, setInteraction] = useState<NoteInteraction>(null)
    const [ghostNote, setGhostNote] = useState<GhostNoteProps | null>(null)

    const liveDragRef = useRef<{
        noteId: number
        x: number
        y: number
    } | null>(null)

    const liveResizeRef = useRef<{
        noteId: number
        width: number
        height: number
    } | null>(null)

    const onDragPointerDown = (
        e: React.PointerEvent<HTMLDivElement>,
        note: NoteType,
    ) => {
        e.stopPropagation()
        e.currentTarget.setPointerCapture(e.pointerId)

        setInteraction({
            type: NoteInteractionType.DRAG,
            startX: e.clientX,
            startY: e.clientY,
            noteId: note.id,
            noteStartX: note.x,
            noteStartY: note.y,
            noteWidth: note.width,
            noteHeight: note.height,
        })
    }

    const onResizePointerDown = (
        e: React.PointerEvent<HTMLDivElement>,
        note: NoteType,
    ) => {
        e.stopPropagation()
        e.currentTarget.setPointerCapture(e.pointerId)

        setInteraction({
            type: NoteInteractionType.RESIZE,
            startX: e.clientX,
            startY: e.clientY,
            noteId: note.id,
            noteStartX: note.x,
            noteStartY: note.y,
            noteStartWidth: note.width,
            noteStartHeight: note.height,
        })
    }

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!interaction) return

        if (interaction.type === NoteInteractionType.DRAG) {
            const deltaX = e.clientX - interaction.startX
            const deltaY = e.clientY - interaction.startY

            const x = Math.max(
                0,
                Math.min(
                    boardSize.width - interaction.noteWidth,
                    interaction.noteStartX + deltaX,
                ),
            )

            const y = Math.max(
                0,
                Math.min(
                    boardSize.height - interaction.noteHeight,
                    interaction.noteStartY + deltaY,
                ),
            )

            setGhostNote({
                x,
                y,
                width: interaction.noteWidth,
                height: interaction.noteHeight,
            })

            liveDragRef.current = {
                noteId: interaction.noteId,
                x,
                y,
            }
        }

        if (interaction.type === NoteInteractionType.RESIZE) {
            const deltaX = e.clientX - interaction.startX
            const deltaY = e.clientY - interaction.startY

            const width = Math.max(80, interaction.noteStartWidth + deltaX)

            const height = Math.max(60, interaction.noteStartHeight + deltaY)

            setGhostNote({
                x: interaction.noteStartX,
                y: interaction.noteStartY,
                width,
                height,
            })

            liveResizeRef.current = {
                noteId: interaction.noteId,
                width,
                height,
            }
        }
    }

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId)

        if (
            interaction?.type === NoteInteractionType.DRAG &&
            liveDragRef.current
        ) {
            onCommitNote(liveDragRef.current.noteId, {
                x: liveDragRef.current.x,
                y: liveDragRef.current.y,
            })
        }

        if (
            interaction?.type === NoteInteractionType.RESIZE &&
            liveResizeRef.current
        ) {
            onCommitNote(liveResizeRef.current.noteId, {
                width: liveResizeRef.current.width,
                height: liveResizeRef.current.height,
            })
        }

        setInteraction(null)
        setGhostNote(null)
        liveDragRef.current = null
        liveResizeRef.current = null
    }

    const getCursorClass = () => {
        switch (interaction?.type) {
            case NoteInteractionType.DRAG:
                return "cursor-grabbing"
            case NoteInteractionType.RESIZE:
                return "cursor-se-resize"
            default:
                return "cursor-default"
        }
    }

    return {
        ghostNote,
        onDragPointerDown,
        onResizePointerDown,
        onPointerMove,
        onPointerUp,
        getCursorClass,
        isInteracting: interaction !== null,
    }
}
