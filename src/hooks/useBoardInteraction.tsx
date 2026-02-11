import { useState } from "react"

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

export function useBoardInteraction(
    viewportRef: React.RefObject<HTMLDivElement | null>,
) {
    const [interaction, setInteraction] = useState<BoardInteraction>(null)

    const onPointerDown = (
        pointerEvent: React.PointerEvent<HTMLDivElement>,
    ) => {
        const target = pointerEvent.target as HTMLElement

        if (
            target.closest('[data-component="note-content"]') ||
            target.closest('[data-component="note-editor"]')
        ) {
            return
        }

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
        PointerEvent: React.PointerEvent<HTMLDivElement>,
    ) => {
        if (!interaction) return
        if (interaction.type !== BoardInteractionType.PAN) return

        const viewport = viewportRef.current
        if (!viewport) return

        const deltaX = PointerEvent.clientX - interaction.startX
        const deltaY = PointerEvent.clientY - interaction.startY

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
