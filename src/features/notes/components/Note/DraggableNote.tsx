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

export type DraggableNoteProps = {
    noteId: string
    onDragEnd?: (data: DropDataProps) => void
    setNode?: (el: HTMLDivElement | null) => void
}

export default function DraggableNote({
    noteId,
    onDragEnd,
    setNode,
}: DraggableNoteProps) {
    const note = useSingleNoteYjs(noteId)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const headerRef = useRef<HTMLDivElement | null>(null)
    const offsetRef = useRef({ x: 0, y: 0 })
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
                    "rounded-md shadow-md flex-inline overflow-hidden",
                    dragState.type === "dragging" && "opacity-50",
                )}
            >
                <div
                    ref={headerRef}
                    className="cursor-grab active:cursor-grabbing p-2 bg-slate-900/20 h-9"
                />

                <div className="flex-1 p-3">DraggableNote content</div>
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
