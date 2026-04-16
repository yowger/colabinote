import { http } from "../../../core/http/axiosClient"

import type { Board } from "../types/board"

const BASE_URL = "/boards"

export const boardsApi = {
    getBoards: async (): Promise<Board[]> => {
        const { data } = await http.get(BASE_URL)
        return data
    },

    createBoard: async (): Promise<Board> => {
        const { data } = await http.post(BASE_URL)
        return data
    },

    updateBoardTitle: async (id: string, title: string): Promise<Board> => {
        const { data } = await http.patch(`${BASE_URL}/${id}`, { title })
        return data
    },

    deleteBoard: async (id: string): Promise<void> => {
        await http.delete(`${BASE_URL}/${id}`)
    },
}
