import { useEffect, useRef, useState } from "react"
import BoardBackground from "./Background"

const BOARD_WIDTH = 2000
const BOARD_HEIGHT = 2000

type Note = {
    id: number
    x: number
    y: number
    text: string
}

export default function Board() {
    const viewportRef = useRef<HTMLDivElement | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [notes, setNotes] = useState<Note[]>([])
    const [draggingNoteId, setDraggingNoteId] = useState<number | null>(null)
    const noteDragStart = useRef<{
        x: number
        y: number
        noteX: number
        noteY: number
    }>({ x: 0, y: 0, noteX: 0, noteY: 0 })

    const dragStart = useRef<{
        x: number
        y: number
        scrollLeft: number
        scrollTop: number
    }>({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 })

    const startDrag = (mouseEvent: React.MouseEvent<HTMLDivElement>) => {
        const viewport = viewportRef.current
        if (!viewport) return

        setIsDragging(true)
        dragStart.current = {
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
            scrollLeft: viewport.scrollLeft,
            scrollTop: viewport.scrollTop,
        }
    }

    const dragMove = (mouseEvent: React.MouseEvent<HTMLDivElement>) => {
        if (draggingNoteId !== null) {
            moveNote(mouseEvent)
            return
        }

        if (!isDragging) return
        const viewport = viewportRef.current
        if (!viewport) return

        const deltaX = mouseEvent.clientX - dragStart.current.x
        const deltaY = mouseEvent.clientY - dragStart.current.y

        viewport.scrollLeft = dragStart.current.scrollLeft - deltaX
        viewport.scrollTop = dragStart.current.scrollTop - deltaY
    }

    const endDrag = () => {
        setIsDragging(false)
        setDraggingNoteId(null)
    }
    const enterBoard = () => setIsHovering(true)
    const exitBoard = () => setIsHovering(false)

    const getCursorClass = () => {
        if (isDragging) return "cursor-grabbing"
        if (isHovering) return "cursor-grab"
        return "cursor-default"
    }

    const addNote = () => {
        const newNote: Note = {
            id: Date.now(),
            x: BOARD_WIDTH / 2 - 50,
            y: BOARD_HEIGHT / 2 - 25,
            text: "New Note",
        }
        setNotes((prev) => [...prev, newNote])
    }

    const startNoteDrag = (
        mouseEvent: React.MouseEvent<HTMLDivElement>,
        note: Note,
    ) => {
        mouseEvent.stopPropagation()
        setDraggingNoteId(note.id)

        noteDragStart.current = {
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
            noteX: note.x,
            noteY: note.y,
        }
    }

    const moveNote = (mouseEvent: React.MouseEvent<HTMLDivElement>) => {
        if (draggingNoteId === null) return

        const deltaX = mouseEvent.clientX - noteDragStart.current.x
        const deltaY = mouseEvent.clientY - noteDragStart.current.y

        setNotes((prevNote) =>
            prevNote.map((note) =>
                note.id === draggingNoteId
                    ? {
                          ...note,
                          x: noteDragStart.current.noteX + deltaX,
                          y: noteDragStart.current.noteY + deltaY,
                      }
                    : note,
            ),
        )
    }

    useEffect(() => {
        const centerViewport = () => {
            const viewport = viewportRef.current
            if (!viewport) return
            viewport.scrollLeft = BOARD_WIDTH / 2 - viewport.clientWidth / 2
            viewport.scrollTop = BOARD_HEIGHT / 2 - viewport.clientHeight / 2
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
                className={`w-screen h-screen overflow-auto ${getCursorClass()}`}
                onMouseDown={startDrag}
                onMouseMove={dragMove}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
                onMouseEnter={enterBoard}
                onMouseOut={exitBoard}
            >
                <div
                    className="relative bg-gray-50"
                    style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
                >
                    <BoardBackground gridSize={224} lineWidth={2} />
                    <div className="relative  z-10">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                onMouseDown={(e) => startNoteDrag(e, note)}
                                className="absolute bg-yellow-200 p-2 rounded shadow cursor-move select-none"
                                style={{
                                    left: note.x,
                                    top: note.y,
                                    width: 100,
                                    height: 50,
                                }}
                            >
                                {note.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
