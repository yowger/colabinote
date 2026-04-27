import { create } from "zustand"

type Board = {
    id?: string
    title: string
}

type BoardsStore = {
    boards: Board[]
    activeBoardId: string | null

    addBoard: (id: string, title: string) => void
    setActiveBoard: (id: string) => void
    setBoardTitle: (id: string, newTitle: string) => void
}

export const useBoardsStore = create<BoardsStore>((set) => ({
    boards: [],

    activeBoardId: null,

    addBoard: (id: string, title: string) => {
        set((state) => ({
            boards: [...state.boards, { id, title }],
        }))
    },

    setActiveBoard: (id) => set({ activeBoardId: id }),

    setBoardTitle: (id: string, newTitle: string) =>
        set((state) => ({
            boards: state.boards.map((b) =>
                b.id === id ? { ...b, title: newTitle } : b,
            ),
        })),
}))
