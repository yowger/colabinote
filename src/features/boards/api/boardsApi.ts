import { http } from "../../../core/api/axiosClient"

import type { Board } from "../types/board"

export const boardsApi = {
    getBoards: async (): Promise<Board[]> => {
        const { data } = await http.get("/")
        return data
    },

    createBoard: async (): Promise<Board> => {
        const { data } = await http.post("/")
        return data
    },

    updateBoardTitle: async (id: string, title: string): Promise<Board> => {
        const { data } = await http.patch(`/${id}`, { title })
        return data
    },

    deleteBoard: async (id: string): Promise<void> => {
        await http.delete(`/${id}`)
    },
}
