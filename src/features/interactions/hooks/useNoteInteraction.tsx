import { useEffect, useRef, useState } from "react"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"

import type {
    BaseEventPayload,
    ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types"

type InteractionState =
    | { type: "idle" }
    | { type: "drag-preview"; container: HTMLElement }
    | { type: "dragging" }
    | { type: "resizing" }

type Note = {
    id: string
    width: number
    height: number
}

type MovePayload = {
    action: "move"
    note: Note
    clientX: number
    clientY: number
    offsetX: number
    offsetY: number
}

type ResizePayload = {
    action: "resize"
    note: Note
}

type Params = {
    note: Note | null
    noteId: string
    containerRef: React.RefObject<HTMLDivElement | null>
    headerRef: React.RefObject<HTMLElement | null>
    onDragStart?: (note: Note) => void
    onDragMove?: (payload: MovePayload) => void
    onDragEnd?: (payload: MovePayload) => void
    onResizeStart?: (note: Note) => void
    onResizeEnd?: (payload: ResizePayload) => void
}

const MIN_WIDTH = 120
const MIN_HEIGHT = 80
const MAX_WIDTH = 600
const MAX_HEIGHT = 500

const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(v, max))

export function useNoteInteractions({
    note,
    containerRef,
    headerRef,
    onDragStart,
    onDragEnd,
    onResizeStart,
    onResizeEnd,
}: Params) {
    const [state, setState] = useState<InteractionState>({ type: "idle" })

    const offsetRef = useRef({ x: 0, y: 0 })

    const resizeStart = useRef({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })

    const handleDragStart = (data: BaseEventPayload<ElementDragType>) => {
        if (!note) return

        const { clientX, clientY } = data.location.current.input
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return

        offsetRef.current = {
            x: clientX - rect.left,
            y: clientY - rect.top,
        }

        setState({ type: "dragging" })

        onDragStart?.(note)
    }

    const handleDragPreview = (
        data: BaseEventPayload<ElementDragType> & {
            nativeSetDragImage: DataTransfer["setDragImage"] | null
        },
    ) => {
        const { nativeSetDragImage } = data

        setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: () => offsetRef.current,
            render({ container }) {
                setState({ type: "drag-preview", container })
            },
        })
    }

    const handleDrop = (data: BaseEventPayload<ElementDragType>) => {
        const { clientX, clientY } = data.location.current.input

        setState({ type: "idle" })

        if (!note) return

        const payload: MovePayload = {
            action: "move",
            note,
            clientX,
            clientY,
            offsetX: offsetRef.current.x,
            offsetY: offsetRef.current.y,
        }

        onDragEnd?.(payload)
    }

    useEffect(() => {
        if (!headerRef.current) return

        return draggable({
            element: headerRef.current,
            onDragStart: handleDragStart,
            onGenerateDragPreview: handleDragPreview,
            onDrop: handleDrop,
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headerRef.current])

    const handleResizeStart = (e: React.PointerEvent) => {
        if (!note) return

        e.preventDefault()
        e.stopPropagation()

        setState({ type: "resizing" })

        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: note.width,
            height: note.height,
        }

        onResizeStart?.(note)

        e.currentTarget.setPointerCapture(e.pointerId)
    }

    useEffect(() => {
        const containerElement = containerRef.current
        if (!containerElement) return

        const onMove = (pointerEvent: PointerEvent) => {
            if (state.type !== "resizing") return

            const dx = pointerEvent.clientX - resizeStart.current.x
            const dy = pointerEvent.clientY - resizeStart.current.y

            const newWidth = clamp(
                resizeStart.current.width + dx,
                MIN_WIDTH,
                MAX_WIDTH,
            )

            const newHeight = clamp(
                resizeStart.current.height + dy,
                MIN_HEIGHT,
                MAX_HEIGHT,
            )

            containerElement.style.width = `${newWidth}px`
            containerElement.style.height = `${newHeight}px`
        }

        const onUp = (e: PointerEvent) => {
            if (state.type !== "resizing" || !note) return

            setState({ type: "idle" })
            containerElement.releasePointerCapture(e.pointerId)

            const payload: ResizePayload = {
                action: "resize",
                note: {
                    id: note.id,
                    width: containerElement.offsetWidth,
                    height: containerElement.offsetHeight,
                },
            }

            onResizeEnd?.(payload)
        }

        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerup", onUp)

        return () => {
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerup", onUp)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, note])

    return {
        state,
        onResizeStart: handleResizeStart,
    }
}
