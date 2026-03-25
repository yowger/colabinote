import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"

import { useSingleNoteYjs } from "../../hooks/useSingleNoteYjs"

import type {
    BaseEventPayload,
    ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types"

export type DropDataProps = {
    noteId: string
    clientX: number
    clientY: number
    offsetX: number
    offsetY: number
}

export type DraggableNoteProps = {
    noteId: string
    canvasRef: React.RefObject<HTMLDivElement | null>
    onDrop?: (data: DropDataProps) => void
}

export default function DraggableNote({
    noteId,
    onDrop,
    canvasRef,
}: DraggableNoteProps) {
    const note = useSingleNoteYjs(noteId)

    const ref = useRef<HTMLDivElement | null>(null)
    const offsetRef = useRef({ x: 0, y: 0 })
    const [dragging, setDragging] = useState(false)

    const getCanvasMousePosition = (clientX: number, clientY: number) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return null

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        }
    }

    const computeOffset = (clientX: number, clientY: number) => {
        const mouse = getCanvasMousePosition(clientX, clientY)
        if (!mouse || !note) return

        offsetRef.current = {
            x: mouse.x - note.x,
            y: mouse.y - note.y,
        }
    }

    const handleDragStart = (data: BaseEventPayload<ElementDragType>) => {
        setDragging(true)

        const { clientX, clientY } = data.location.current.input
        computeOffset(clientX, clientY)
    }

    const handleDrop = (data: BaseEventPayload<ElementDragType>) => {
        setDragging(false)

        const { clientX, clientY } = data.location.current.input

        onDrop?.({
            noteId: note!.id,
            clientX,
            clientY,
            offsetX: offsetRef.current.x,
            offsetY: offsetRef.current.y,
        })
    }

    useEffect(() => {
        if (!note || !ref.current) return

        return draggable({
            element: ref.current,
            onDragStart: handleDragStart,
            onDrop: handleDrop,
        })
    }, [note])

    if (!note) return null

    return (
        <div
            ref={ref}
            data-no-pan={true}
            style={{
                position: "absolute",
                left: note.x ?? 0,
                top: note.y ?? 0,
                width: note.width ?? 0,
                height: note.height ?? 0,
                background: note.color ?? "yellow",
            }}
            className={clsx(
                "bg-neutral-800 text-white shadow-lg rounded-md flex-inline",
                dragging && "opacity-50",
            )}
        >
            DraggableNote
        </div>
    )
}
