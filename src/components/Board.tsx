import { useEffect, useRef, useState } from "react"
import BoardBackground from "./Background"
import Note, { type Note as NoteType } from "./Note"

const BOARD_WIDTH = 2000
const BOARD_HEIGHT = 2000

type GhostNote = {
    x: number
    y: number
    width: number
    height: number
}

export default function Board() {
    const [isDragging, setIsDragging] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [notes, setNotes] = useState<NoteType[]>([])
    const [draggingNoteId, setDraggingNoteId] = useState<number | null>(null)
    const [resizingNoteId, setResizingNoteId] = useState<number | null>(null)
    const [ghostNote, setGhostNote] = useState<GhostNote | null>(null)

    const viewportRef = useRef<HTMLDivElement | null>(null)
    const noteDragStart = useRef<{
        x: number
        y: number
        noteX: number
        noteY: number
    }>({ x: 0, y: 0, noteX: 0, noteY: 0 })

    const resizeStart = useRef({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })

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
        if (resizingNoteId !== null) {
            const dx = mouseEvent.clientX - resizeStart.current.x
            const dy = mouseEvent.clientY - resizeStart.current.y

            setNotes((prev) =>
                prev.map((note) =>
                    note.id === resizingNoteId
                        ? {
                              ...note,
                              width: Math.max(
                                  60,
                                  resizeStart.current.width + dx,
                              ),
                              height: Math.max(
                                  40,
                                  resizeStart.current.height + dy,
                              ),
                          }
                        : note,
                ),
            )
            return
        }

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
        setResizingNoteId(null)
        setGhostNote(null)
    }
    const enterBoard = () => setIsHovering(true)
    const exitBoard = () => setIsHovering(false)

    const isInteractingWithNote =
        draggingNoteId !== null || resizingNoteId !== null

    const getCursorClass = () => {
        if (isInteractingWithNote) return "cursor-default"
        if (isDragging) return "cursor-grabbing"
        if (isHovering) return "cursor-grab"
        return "cursor-default"
    }

    const addNote = () => {
        const newNote: NoteType = {
            id: Date.now(),
            x: BOARD_WIDTH / 2 - 50,
            y: BOARD_HEIGHT / 2 - 25,
            width: 100,
            height: 100,
            text: "New Note",
        }
        setNotes((prev) => [...prev, newNote])
    }

    const startNoteDrag = (
        mouseEvent: React.MouseEvent<HTMLDivElement>,
        note: NoteType,
    ) => {
        mouseEvent.stopPropagation()
        setDraggingNoteId(note.id)

        console.log(
            "Starting note drag at",
            mouseEvent.clientX,
            mouseEvent.clientY,
        )

        setGhostNote({
            width: note.width,
            height: note.height,
            x: note.x,
            y: note.y,
        })

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

    const startResize = (
        e: React.MouseEvent<HTMLDivElement>,
        note: NoteType,
    ) => {
        e.stopPropagation()

        setResizingNoteId(note.id)
        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: note.width,
            height: note.height,
        }
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
                        {ghostNote && draggingNoteId && (
                            <div
                                className="absolute border-2 border-dashed border-gray-300 bg-yellow-100 opacity-50 pointer-events-none"
                                style={{
                                    left: ghostNote.x,
                                    top: ghostNote.y,
                                    width: ghostNote.width,
                                    height: ghostNote.height,
                                }}
                            >
                                
                            </div>
                        )}

                        {notes.map((note) => (
                            <Note
                                key={note.id}
                                note={note}
                                onMoveMouseDown={(e) => startNoteDrag(e, note)}
                                onResizeMouseDown={(e) => startResize(e, note)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
