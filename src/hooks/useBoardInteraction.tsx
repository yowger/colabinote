import { useState } from "react"

export const BoardInteractionType = {
    PAN: "pan" as const,
}

type BoardInteraction = {
    type: typeof BoardInteractionType.PAN
    startX: number
    startY: number
    scrollLeft: number
    scrollTop: number
} | null

export function useBoardInteraction(
    viewportRef: React.RefObject<HTMLDivElement | null>,
) {
    const [interaction, setInteraction] = useState<BoardInteraction>(null)

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const viewport = viewportRef.current
        if (!viewport) return

        e.currentTarget.setPointerCapture(e.pointerId)

        setInteraction({
            type: BoardInteractionType.PAN,
            startX: e.clientX,
            startY: e.clientY,
            scrollLeft: viewport.scrollLeft,
            scrollTop: viewport.scrollTop,
        })
    }

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!interaction) return
        if (interaction.type !== BoardInteractionType.PAN) return

        const viewport = viewportRef.current
        if (!viewport) return

        const deltaX = e.clientX - interaction.startX
        const deltaY = e.clientY - interaction.startY

        viewport.scrollLeft = interaction.scrollLeft - deltaX
        viewport.scrollTop = interaction.scrollTop - deltaY
    }

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.releasePointerCapture(e.pointerId)
        setInteraction(null)
    }

    const getCursorClass = () => {
        return interaction ? "cursor-grabbing" : "cursor-grab"
    }

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        getCursorClass,
        isPanning: interaction !== null,
    }
}
