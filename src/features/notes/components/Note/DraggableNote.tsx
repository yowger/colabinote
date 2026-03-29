import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { createPortal } from "react-dom"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"

import { useSingleNoteYjs } from "../../hooks/useSingleNoteYjs"
import NoteDragPreview from "./NotePreview"
import { useNotesStore } from "../../stores/useNotesStore"

import type {
    BaseEventPayload,
    ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types"

export type NoteAction = "move" | "resize"

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

export type NoteActionPayload =
    | {
          action: "move"
          note: {
              id: string
              width: number
              height: number
          }
          clientX: number
          clientY: number
          offsetX: number
          offsetY: number
      }
    | {
          action: "resize"
          note: {
              id: string
              width: number
              height: number
          }
      }

export type DraggableNoteProps = {
    noteId: string
    onInteractionEnd?: (data: NoteActionPayload) => void
    setNode?: (el: HTMLDivElement | null) => void
}

export default function DraggableNote({
    noteId,
    onInteractionEnd: onDragEnd,
    setNode,
}: DraggableNoteProps) {
    const note = useSingleNoteYjs(noteId)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const headerRef = useRef<HTMLDivElement | null>(null)
    const offsetRef = useRef({ x: 0, y: 0 })
    const isResizing = useRef(false)
    const resizeStart = useRef({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })
    const [dragState, setDragState] = useState<DraggableState>({ type: "idle" })
    const selectNote = useNotesStore((store) => store.selectNote)

    const setContainerRef = (node: HTMLDivElement | null) => {
        containerRef.current = node
        setNode?.(node)
    }

    const computeOffset = (clientX: number, clientY: number) => {
        if (!note) return

        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return

        offsetRef.current = {
            x: clientX - rect.left,
            y: clientY - rect.top,
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

        onDragEnd?.({
            action: "move",
            note: {
                id: noteId,
                width: note?.width || 0,
                height: note?.height || 0,
            },
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

    const handleResizeStart = (event: React.PointerEvent) => {
        if (!note) return

        event.preventDefault()
        event.stopPropagation()

        isResizing.current = true

        resizeStart.current = {
            x: event.clientX,
            y: event.clientY,
            width: note.width,
            height: note.height,
        }

        event.currentTarget.setPointerCapture(event.pointerId)
    }

    useEffect(() => {
        if (!headerRef.current) return

        return draggable({
            element: headerRef.current,
            onGenerateDragPreview: handleGenerateDragPreview,
            onDragStart: handleDragStart,
            onDrop: handleDrop,
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note?.id])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const onMove = (e: PointerEvent) => {
            if (!isResizing.current) return

            const dx = e.clientX - resizeStart.current.x
            const dy = e.clientY - resizeStart.current.y

            const newWidth = resizeStart.current.width + dx
            const newHeight = resizeStart.current.height + dy

            if (containerRef.current) {
                containerRef.current.style.width = `${newWidth}px`
                containerRef.current.style.height = `${newHeight}px`
            }
        }

        const onUp = (event: PointerEvent) => {
            if (!isResizing.current || !note) return

            isResizing.current = false

            el.releasePointerCapture(event.pointerId)

            const finalWidth = containerRef.current?.offsetWidth || note.width
            const finalHeight =
                containerRef.current?.offsetHeight || note.height

            onDragEnd?.({
                action: "resize",
                note: {
                    id: noteId,
                    width: finalWidth,
                    height: finalHeight,
                },
            })
        }

        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerup", onUp)

        return () => {
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerup", onUp)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [note])

    if (!note) return null

    return (
        <>
            <div
                ref={setContainerRef}
                onMouseDown={() => {
                    selectNote(noteId)
                }}
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
                    "relative rounded-md shadow-md flex-inline overflow-hidden",
                    dragState.type === "dragging" && "opacity-50",
                )}
            >
                <div
                    ref={headerRef}
                    className="cursor-grab active:cursor-grabbing p-2 bg-slate-900/20 h-9"
                />

                <div className="flex-1 p-3">DraggableNote content</div>

                <div
                    onPointerDown={handleResizeStart}
                    className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-black/40"
                />
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
