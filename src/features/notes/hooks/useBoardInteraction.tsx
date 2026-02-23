import { useState, useRef } from "react"

export const BoardInteractionType = {
    PAN: "pan" as const,
}

export type BoardInteraction = {
    type: typeof BoardInteractionType.PAN
    startX: number
    startY: number
    scrollLeft: number
    scrollTop: number
} | null

export function useBoardInteraction() {
    const viewportRef = useRef<HTMLDivElement | null>(null)

    const [interaction, setInteraction] = useState<BoardInteraction>(null)

    const onPointerDown = (
        pointerEvent: React.PointerEvent<HTMLDivElement>,
    ) => {
        const viewport = viewportRef.current
        if (!viewport) return

        pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId)

        setInteraction({
            type: BoardInteractionType.PAN,
            startX: pointerEvent.clientX,
            startY: pointerEvent.clientY,
            scrollLeft: viewport.scrollLeft,
            scrollTop: viewport.scrollTop,
        })
    }

    const onPointerMove = (
        pointerEvent: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (interaction?.type !== BoardInteractionType.PAN) return

        const viewport = viewportRef.current
        if (!viewport) return

        const deltaX = pointerEvent.clientX - interaction.startX
        const deltaY = pointerEvent.clientY - interaction.startY

        viewport.scrollLeft = interaction.scrollLeft - deltaX
        viewport.scrollTop = interaction.scrollTop - deltaY
    }

    const onPointerUp = (pointerEvent: React.PointerEvent<HTMLDivElement>) => {
        pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId)
        setInteraction(null)
    }

    return {
        viewportRef,
        handlers: {
            onPointerDown,
            onPointerMove,
            onPointerUp,
        },
        isPanning: interaction !== null,
    }
}
