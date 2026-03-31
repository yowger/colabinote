import { useEffect, useRef } from "react"
import { useBoardInteractionStore } from "../../boards/stores/useBoardInteractionStore"

const EDGE_SIZE = 75
const MAX_SCROLL_SPEED = 10

export function useBoardInteraction() {
    const viewportRef = useRef<HTMLDivElement | null>(null)

    const activeInteraction = useBoardInteractionStore(
        (store) => store.activeInteraction,
    )
    const panState = useBoardInteractionStore((store) => {
        return store.panState
    })
    const startPan = useBoardInteractionStore((store) => store.startPan)
    const stopPan = useBoardInteractionStore((store) => store.stopPan)

    useEffect(() => {
        if (activeInteraction !== "note-drag") return

        const handleScrollEdge = (event: MouseEvent) => {
            const viewport = viewportRef.current
            if (!viewport) return

            const rect = viewport.getBoundingClientRect()

            const distanceLeft = event.clientX - rect.left
            const distanceRight = rect.right - event.clientX
            const distanceTop = event.clientY - rect.top
            const distanceBottom = rect.bottom - event.clientY

            if (distanceTop < EDGE_SIZE) {
                viewport.scrollTop -= MAX_SCROLL_SPEED
            }

            if (distanceBottom < EDGE_SIZE) {
                viewport.scrollTop += MAX_SCROLL_SPEED
            }

            if (distanceLeft < EDGE_SIZE) {
                viewport.scrollLeft -= MAX_SCROLL_SPEED
            }

            if (distanceRight < EDGE_SIZE) {
                viewport.scrollLeft += MAX_SCROLL_SPEED
            }
        }

        window.addEventListener("mousemove", handleScrollEdge)

        return () => {
            window.removeEventListener("mousemove", handleScrollEdge)
        }
    }, [activeInteraction])

    const onPointerDown = (
        pointerEvent: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (activeInteraction !== null) return

        if ((pointerEvent.target as Element).closest('[data-no-pan="true"]'))
            return

        const viewport = viewportRef.current
        if (!viewport) return

        pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId)

        startPan({
            startX: pointerEvent.clientX,
            startY: pointerEvent.clientY,
            scrollLeft: viewport.scrollLeft,
            scrollTop: viewport.scrollTop,
        })
    }

    const onPointerMove = (
        pointerEvent: React.PointerEvent<HTMLDivElement>,
    ) => {
        const viewport = viewportRef.current
        if (!viewport) return

        if (activeInteraction == "pan" && panState) {
            const deltaX = pointerEvent.clientX - panState.startX
            const deltaY = pointerEvent.clientY - panState.startY

            viewport.scrollLeft = panState.scrollLeft - deltaX
            viewport.scrollTop = panState.scrollTop - deltaY
        }
    }

    const onPointerUp = (pointerEvent: React.PointerEvent<HTMLDivElement>) => {
        if (activeInteraction === "pan") {
            pointerEvent.currentTarget.releasePointerCapture(
                pointerEvent.pointerId,
            )

            stopPan()
        }
    }

    return {
        viewportRef,
        handlers: {
            onPointerDown,
            onPointerMove,
            onPointerUp,
        },
    }
}
