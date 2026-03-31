import { create } from "zustand"

export type ActiveInteraction = "pan" | "note-drag" | "note-resize" | null

type PanState = {
    startX: number
    startY: number
    scrollLeft: number
    scrollTop: number
} | null

type BoardInteractionStore = {
    activeInteraction: ActiveInteraction
    panState: PanState

    startPan: (payload: {
        startX: number
        startY: number
        scrollLeft: number
        scrollTop: number
    }) => void
    stopPan: () => void
    setActiveInteraction: (interaction: ActiveInteraction) => void
}

export const useBoardInteractionStore = create<BoardInteractionStore>(
    (set) => ({
        activeInteraction: null,
        panState: null,

        startPan: (payload) =>
            set({
                activeInteraction: "pan",
                panState: payload,
            }),

        stopPan: () =>
            set({
                activeInteraction: null,
                panState: null,
            }),

        setActiveInteraction: (v) => set({ activeInteraction: v }),
    }),
)
