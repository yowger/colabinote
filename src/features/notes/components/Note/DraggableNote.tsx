import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { createPortal } from "react-dom"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"

import { useSingleNoteYjs } from "../../hooks/useSingleNoteYjs"
import NoteDragPreview from "./NotePreview"

import type {
    BaseEventPayload,
    ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types"
export type DraggableState =
    | {
          type: "idle"
      }
    | {
          type: "preview"
          container: HTMLElement
      }
    | {
          type: "dragging"
      }
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

    const containerRef = useRef<HTMLDivElement | null>(null)
    const headerRef = useRef<HTMLDivElement | null>(null)
    const offsetRef = useRef({ x: 0, y: 0 })
    const [dragState, setDragState] = useState<DraggableState>({ type: "idle" })

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
        const { clientX, clientY } = data.location.current.input
        computeOffset(clientX, clientY)

        setDragState({ type: "dragging" })
    }

    const handleDrop = (data: BaseEventPayload<ElementDragType>) => {
        const { clientX, clientY } = data.location.current.input

        setDragState({ type: "idle" })

        onDrop?.({
            noteId: note!.id,
            clientX,
            clientY,
            offsetX: offsetRef.current.x,
            offsetY: offsetRef.current.y,
        })
    }

    const handleGenerateDragPreview = (
        data: BaseEventPayload<ElementDragType> & {
            nativeSetDragImage: DataTransfer["setDragImage"] | null
        },
    ) => {
        const { nativeSetDragImage } = data
        const { clientX, clientY } = data.location.current.input

        computeOffset(clientX, clientY)

        setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: () => ({
                x: offsetRef.current.x,
                y: offsetRef.current.y,
            }),
            render({ container }) {
                setDragState({
                    type: "preview",
                    container,
                })
            },
        })
    }

    useEffect(() => {
        if (!note || !headerRef.current) return

        return draggable({
            element: headerRef.current,
            onGenerateDragPreview: handleGenerateDragPreview,
            onDragStart: handleDragStart,
            onDrop: handleDrop,
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note])

    if (!note) return null

    return (
        <>
            <div
                ref={containerRef}
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
                    dragState.type === "dragging" && "opacity-50",
                )}
            >
                <div
                    ref={headerRef}
                    className="cursor-grab active:cursor-grabbing p-2 bg-black/20"
                >
                    Header
                </div>

                <div className="flex-1 p-2">DraggableNote content</div>
            </div>

            {dragState.type === "preview" &&
                createPortal(
                    <NoteDragPreview
                        width={note.width}
                        height={note.height}
                        color={note.color}
                    />,
                    dragState.container,
                )}
        </>
    )
}
