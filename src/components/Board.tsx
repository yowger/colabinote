import { useEffect, useRef, useState } from "react"

import BoardBackground from "./Background"
import Note, { type Note as NoteType } from "./Note"

const BOARD_SIZE = { width: 2000, height: 2000 }
const DEFAULT_NOTE_SIZE = { width: 200, height: 215 }

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
          noteId: number
          startX: number
          startY: number
          noteStartX: number
          noteStartY: number
      }
    | {
          type: "resize"
          noteId: number
          startX: number
          startY: number
          startWidth: number
          startHeight: number
      }
    | null

export default function Board() {
    const [interaction, setInteraction] = useState<Interaction>(null)
    const [notes, setNotes] = useState<NoteType[]>([])

    const viewportRef = useRef<HTMLDivElement | null>(null)

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
                noteId: note.id,
                startX: pointerEvent.clientX,
                startY: pointerEvent.clientY,
                noteStartX: note.x,
                noteStartY: note.y,
            })
        } else if (mode === "resize" && note) {
            setInteraction({
                type: "resize",
                noteId: note.id,
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
                setNotes((prevNote) =>
                    prevNote.map((note) =>
                        note.id === interaction.noteId
                            ? {
                                  ...note,
                                  x: interaction.noteStartX + deltaX,
                                  y: interaction.noteStartY + deltaY,
                              }
                            : note,
                    ),
                )

                break
            }
            case "resize": {
                const dx = pointerEvent.clientX - interaction.startX
                const dy = pointerEvent.clientY - interaction.startY
                setNotes((prev) =>
                    prev.map((note) =>
                        note.id === interaction.noteId
                            ? {
                                  ...note,
                                  width: Math.max(
                                      60,
                                      interaction.startWidth + dx,
                                  ),
                                  height: Math.max(
                                      40,
                                      interaction.startHeight + dy,
                                  ),
                              }
                            : note,
                    ),
                )

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

    const onPointerUp = () => {
        setInteraction(null)
    }

    const getCursorClass = (interaction: Interaction) => {
        if (interaction?.type === "pan") {
            return "cursor-grabbing"
        }

        return "cursor-default"
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
                        {notes.map((note) => (
                            <Note
                                key={note.id}
                                note={note}
                                onPointerDown={(pointerEvent) =>
                                    onPointerDown(pointerEvent, "drag", note)
                                }
                                onResizePointerDown={(pointerEvent) =>
                                    onPointerDown(pointerEvent, "resize", note)
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
