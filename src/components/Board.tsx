import { useEffect, useRef, useState } from "react"

import BoardBackground from "./Background"
import Note, { type Note as NoteType } from "./Note"
import GhostNote, { type GhostNoteProps } from "./GhostNote"

const BOARD_SIZE = { width: 2000, height: 2000 }
const DEFAULT_NOTE_SIZE = { width: 200, height: 215 }
const NOTE_MIN_SIZE = { width: 100, height: 60 }

const InteractionType = {
    DRAG: "drag" as const,
    RESIZE: "resize" as const,
    PAN: "pan" as const,
}

type Interaction =
    | {
          type: typeof InteractionType.PAN
          startX: number
          startY: number
          scrollLeft: number
          scrollTop: number
      }
    | {
          type: typeof InteractionType.DRAG
          startX: number
          startY: number
          noteId: number
          noteStartX: number
          noteStartY: number
          noteWidth: number
          noteHeight: number
      }
    | {
          type: typeof InteractionType.RESIZE
          startX: number
          startY: number
          noteId: number
          noteStartX: number
          noteStartY: number
          noteStartWidth: number
          noteStartHeight: number
      }
    | null

export default function Board() {
    console.log("RENDER")

    const [interaction, setInteraction] = useState<Interaction>(null)
    const [notes, setNotes] = useState<NoteType[]>([])
    const [ghostNote, setGhostNote] = useState<GhostNoteProps | null>(null)

    const viewportRef = useRef<HTMLDivElement | null>(null)
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

    const onPointerDown = (
        pointerEvent: React.PointerEvent<HTMLDivElement>,
        mode:
            | typeof InteractionType.DRAG
            | typeof InteractionType.RESIZE
            | typeof InteractionType.PAN,
        note?: NoteType,
    ) => {
        pointerEvent.stopPropagation()
        pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId)

        const viewport = viewportRef.current
        if (!viewport) return

        if (mode === InteractionType.DRAG && note) {
            setInteraction({
                type: InteractionType.DRAG,
                startX: pointerEvent.clientX,
                startY: pointerEvent.clientY,
                noteId: note.id,
                noteStartX: note.x,
                noteStartY: note.y,
                noteWidth: note.width,
                noteHeight: note.height,
            })
        } else if (mode === InteractionType.RESIZE && note) {
            setInteraction({
                type: InteractionType.RESIZE,
                startX: pointerEvent.clientX,
                startY: pointerEvent.clientY,
                noteId: note.id,
                noteStartX: note.x,
                noteStartY: note.y,
                noteStartWidth: note.width,
                noteStartHeight: note.height,
            })
        } else if (mode === InteractionType.PAN) {
            setInteraction({
                type: InteractionType.PAN,
                startX: pointerEvent.clientX,
                startY: pointerEvent.clientY,
                scrollLeft: viewport.scrollLeft,
                scrollTop: viewport.scrollTop,
            })
        }
    }

    const onPointerMove = (
        pointerEvent: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (!interaction) return

        const viewport = viewportRef.current
        if (!viewport) return

        switch (interaction.type) {
            case InteractionType.DRAG: {
                const deltaX = pointerEvent.clientX - interaction.startX
                const deltaY = pointerEvent.clientY - interaction.startY
                const noteX = Math.max(
                    0,
                    Math.min(
                        BOARD_SIZE.width - interaction.noteWidth,
                        interaction.noteStartX + deltaX,
                    ),
                )
                const noteY = Math.max(
                    0,
                    Math.min(
                        BOARD_SIZE.height - interaction.noteHeight,
                        interaction.noteStartY + deltaY,
                    ),
                )

                setGhostNote({
                    x: noteX,
                    y: noteY,
                    width: interaction.noteWidth,
                    height: interaction.noteHeight,
                })

                liveDragRef.current = {
                    noteId: interaction.noteId,
                    x: noteX,
                    y: noteY,
                }

                break
            }
            case InteractionType.RESIZE: {
                const deltaX = pointerEvent.clientX - interaction.startX
                const deltaY = pointerEvent.clientY - interaction.startY

                const noteWidth = Math.max(
                    NOTE_MIN_SIZE.width,
                    interaction.noteStartWidth + deltaX,
                )
                const noteHeight = Math.max(
                    NOTE_MIN_SIZE.height,
                    interaction.noteStartHeight + deltaY,
                )

                setGhostNote({
                    x: interaction.noteStartX,
                    y: interaction.noteStartY,
                    width: noteWidth,
                    height: noteHeight,
                })

                liveResizeRef.current = {
                    noteId: interaction.noteId,
                    width: noteWidth,
                    height: noteHeight,
                }
                break
            }
            case InteractionType.PAN: {
                const deltaX = pointerEvent.clientX - interaction.startX
                const deltaY = pointerEvent.clientY - interaction.startY
                viewport.scrollLeft = interaction.scrollLeft - deltaX
                viewport.scrollTop = interaction.scrollTop - deltaY
                break
            }
        }
    }

    const onPointerUp = (pointerEvent: React.PointerEvent) => {
        pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId)

        if (interaction?.type === InteractionType.DRAG && liveDragRef.current) {
            const { noteId, x, y } = liveDragRef.current

            setNotes((prev) =>
                prev.map((n) => (n.id === noteId ? { ...n, x, y } : n)),
            )

            // TODO DB
        }

        if (
            interaction?.type === InteractionType.RESIZE &&
            liveResizeRef.current
        ) {
            const { noteId, width, height } = liveResizeRef.current

            setNotes((prev) =>
                prev.map((n) =>
                    n.id === noteId ? { ...n, width, height } : n,
                ),
            )

            // TODO DB
        }

        setGhostNote(null)
        liveDragRef.current = null
        liveResizeRef.current = null
        setInteraction(null)
    }

    const getCursorClass = (interaction: Interaction) => {
        switch (interaction?.type) {
            case InteractionType.PAN:
                return "cursor-grabbing"
            case InteractionType.DRAG:
                return "cursor-grabbing"
            case InteractionType.RESIZE:
                return "cursor-se-resize"
            default:
                return "cursor-grab"
        }
    }

    const addNote = () => {
        const viewport = viewportRef.current
        if (!viewport) return

        const newNote: NoteType = {
            id: Date.now(),
            x:
                viewport.scrollLeft +
                viewport.clientWidth / 2 -
                DEFAULT_NOTE_SIZE.width / 2,
            y:
                viewport.scrollTop +
                viewport.clientHeight / 2 -
                DEFAULT_NOTE_SIZE.height / 2,
            width: DEFAULT_NOTE_SIZE.width,
            height: DEFAULT_NOTE_SIZE.height,
            text: "New Note",
        }
        setNotes((prev) => [...prev, newNote])
    }

    useEffect(() => {
        const centerViewport = () => {
            const viewport = viewportRef.current
            if (!viewport) return

            viewport.scrollLeft =
                BOARD_SIZE.width / 2 - viewport.clientWidth / 2
            viewport.scrollTop =
                BOARD_SIZE.height / 2 - viewport.clientHeight / 2
        }

        centerViewport()
    }, [])

    return (
        <>
            <div className="fixed top-4 left-4 z-20 flex items-center gap-2">
                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                    onClick={addNote}
                >
                    + Add Note
                </button>
            </div>

            <div
                ref={viewportRef}
                className={`w-screen h-screen overflow-auto ${getCursorClass(interaction)}`}
                onPointerDown={(pointerEvent) =>
                    onPointerDown(pointerEvent, InteractionType.PAN)
                }
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
            >
                <div
                    className="relative bg-gray-50"
                    style={{
                        width: BOARD_SIZE.width,
                        height: BOARD_SIZE.height,
                    }}
                >
                    <BoardBackground gridSize={224} lineWidth={2} />
                    <div className="relative  z-10">
                        {ghostNote && <GhostNote {...ghostNote} />}

                        {notes.map((note) => {
                            return (
                                <Note
                                    key={note.id}
                                    note={note}
                                    onPointerDown={(pointerEvent) =>
                                        onPointerDown(
                                            pointerEvent,
                                            InteractionType.DRAG,
                                            note,
                                        )
                                    }
                                    onResizePointerDown={(pointerEvent) =>
                                        onPointerDown(
                                            pointerEvent,
                                            InteractionType.RESIZE,
                                            note,
                                        )
                                    }
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}
