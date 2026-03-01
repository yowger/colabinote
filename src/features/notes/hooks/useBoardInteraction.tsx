import { useRef } from "react"
import { useBoardInteractionStore } from "../stores/useBoardInteractionStore"

export function useBoardInteraction() {
    const viewportRef = useRef<HTMLDivElement | null>(null)

    const activeInteraction = useBoardInteractionStore(
        (s) => s.activeInteraction,
    )

    const panState = useBoardInteractionStore((s) => s.panState)

    const startPan = useBoardInteractionStore((s) => s.startPan)

    const stopPan = useBoardInteractionStore((s) => s.stopPan)

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
        if (activeInteraction !== "pan" || !panState) return

        const viewport = viewportRef.current
        if (!viewport) return

        const deltaX = pointerEvent.clientX - panState.startX
        const deltaY = pointerEvent.clientY - panState.startY

        viewport.scrollLeft = panState.scrollLeft - deltaX
        viewport.scrollTop = panState.scrollTop - deltaY
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
