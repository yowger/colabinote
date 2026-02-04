import { useEffect, useRef, useState } from "react"

import BoardBackground from "./Background"
import Note, { type Note as NoteType } from "./Note"
import GhostNote from "./GhostNote"
import { useBoardInteraction } from "../hooks/useBoardInteraction"
import { useNoteInteraction } from "../hooks/useNoteInteraction"

const BOARD_SIZE = { width: 2000, height: 2000 }
const DEFAULT_NOTE_SIZE = { width: 200, height: 215 }

export default function Board() {
    const [notes, setNotes] = useState<NoteType[]>([])
    const viewportRef = useRef<HTMLDivElement | null>(null)

    const commitNote = (id: number, updates: Partial<NoteType>) => {
        setNotes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, ...updates } : n)),
        )

        // TODO: DB
    }

    const {
        onPointerDown: onBoardPointerDown,
        onPointerMove: onBoardPointerMove,
        onPointerUp: onBoardPointerUp,
        getCursorClass: getBoardCursor,
    } = useBoardInteraction(viewportRef)

    const {
        ghostNote,
        onDragPointerDown,
        onResizePointerDown,
        onPointerMove: onNotePointerMove,
        onPointerUp: onNotePointerUp,
        getCursorClass: getNoteCursor,
        isInteracting: isNoteInteracting,
    } = useNoteInteraction(BOARD_SIZE, commitNote)

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
        const viewport = viewportRef.current
        if (!viewport) return

        viewport.scrollLeft = BOARD_SIZE.width / 2 - viewport.clientWidth / 2
        viewport.scrollTop = BOARD_SIZE.height / 2 - viewport.clientHeight / 2
    }, [])

    return (
        <>
            <div className="fixed top-4 left-4 z-20">
                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
                    onClick={addNote}
                >
                    + Add Note
                </button>
            </div>

            <div
                ref={viewportRef}
                className={`w-screen h-screen overflow-auto ${
                    isNoteInteracting ? getNoteCursor() : getBoardCursor()
                }`}
                onPointerDown={onBoardPointerDown}
                onPointerMove={(e) => {
                    onBoardPointerMove(e)
                    onNotePointerMove(e)
                }}
                onPointerUp={(e) => {
                    onBoardPointerUp(e)
                    onNotePointerUp(e)
                }}
                onPointerLeave={(e) => {
                    onBoardPointerUp(e)
                    onNotePointerUp(e)
                }}
            >
                <div
                    className="relative bg-gray-50"
                    style={{
                        width: BOARD_SIZE.width,
                        height: BOARD_SIZE.height,
                    }}
                >
                    <BoardBackground gridSize={224} lineWidth={2} />

                    <div className="relative z-10">
                        {ghostNote && <GhostNote {...ghostNote} />}

                        {notes.map((note) => (
                            <Note
                                key={note.id}
                                note={note}
                                onPointerDown={(e) =>
                                    onDragPointerDown(e, note)
                                }
                                onResizePointerDown={(e) =>
                                    onResizePointerDown(e, note)
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
