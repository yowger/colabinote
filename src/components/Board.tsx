import { useEffect, useRef, useState } from "react"

import BoardBackground from "./Background"
import Note, { type Note as NoteType } from "./Note"
import GhostNote, { type GhostNoteProps } from "./GhostNote"

const BOARD_SIZE = { width: 2000, height: 2000 }
const DEFAULT_NOTE_SIZE = { width: 200, height: 215 }
const NOTE_MIN_SIZE = { width: 100, height: 60 }

type Interaction =
    | {
          type: "pan"
          startX: number
          startY: number
          scrollLeft: number
          scrollTop: number
      }
    | {
          type: "drag"
          note: NoteType
          startX: number
          startY: number
          noteStartX: number
          noteStartY: number
      }
    | {
          type: "resize"
          note: NoteType
          startX: number
          startY: number
          startWidth: number
          startHeight: number
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
        mode: "drag" | "resize" | "pan",
        note?: NoteType,
    ) => {
        pointerEvent.stopPropagation()
        pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId)

        const viewport = viewportRef.current
        if (!viewport) return

        if (mode === "drag" && note) {
            setInteraction({
                type: "drag",
                note: note,
                startX: pointerEvent.clientX,
                startY: pointerEvent.clientY,
                noteStartX: note.x,
                noteStartY: note.y,
            })
        } else if (mode === "resize" && note) {
            setInteraction({
                type: "resize",
                note: note,
                startX: pointerEvent.clientX,
                startY: pointerEvent.clientY,
                startWidth: note.width,
                startHeight: note.height,
            })
        } else if (mode === "pan") {
            setInteraction({
                type: "pan",
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
            case "drag": {
                const deltaX = pointerEvent.clientX - interaction.startX
                const deltaY = pointerEvent.clientY - interaction.startY
                const noteX = Math.max(
                    0,
                    Math.min(
                        BOARD_SIZE.width - interaction.note.width,
                        interaction.noteStartX + deltaX,
                    ),
                )
                const noteY = Math.max(
                    0,
                    Math.min(
                        BOARD_SIZE.height - interaction.noteStartY,
                        interaction.noteStartY + deltaY,
                    ),
                )

                setGhostNote({
                    x: noteX,
                    y: noteY,
                    width: interaction.note.width,
                    height: interaction.note.height,
                })

                liveDragRef.current = {
                    noteId: interaction.note.id,
                    x: noteX,
                    y: noteY,
                }

                break
            }
            case "resize": {
                const deltaX = pointerEvent.clientX - interaction.startX
                const deltaY = pointerEvent.clientY - interaction.startY
                const noteWidth = Math.max(
                    NOTE_MIN_SIZE.width,
                    interaction.startWidth + deltaX,
                )
                const noteHeight = Math.max(
                    NOTE_MIN_SIZE.height,
                    interaction.startHeight + deltaY,
                )

                setGhostNote({
                    x: interaction.note.x,
                    y: interaction.note.y,
                    width: noteWidth,
                    height: noteHeight,
                })

                liveResizeRef.current = {
                    noteId: interaction.note.id,
                    width: noteWidth,
                    height: noteHeight,
                }

                break
            }
            case "pan": {
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

        if (interaction?.type === "drag" && liveDragRef.current) {
            const { noteId, x, y } = liveDragRef.current

            setNotes((prev) =>
                prev.map((n) => (n.id === noteId ? { ...n, x, y } : n)),
            )

            // TODO DB
        }

        if (interaction?.type === "resize" && liveResizeRef.current) {
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
            case "pan":
                return "cursor-grabbing"
            case "drag":
                return "cursor-grabbing"
            case "resize":
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
                    onPointerDown(pointerEvent, "pan")
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
                                            "drag",
                                            note,
                                        )
                                    }
                                    onResizePointerDown={(pointerEvent) =>
                                        onPointerDown(
                                            pointerEvent,
                                            "resize",
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
