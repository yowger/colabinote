import { useMutation, useQueryClient } from "@tanstack/react-query"

import { boardsApi } from "../api/boardsApi"

import type { Board } from "../types/board"

export function useDeleteBoard() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: boardsApi.deleteBoard,

        onSuccess: (_, id) => {
            queryClient.setQueryData<Board[]>(["boards"], (old) => {
                if (!old) return old
                return old.filter((board: Board) => board.id !== id)
            })
        },
    })
}
