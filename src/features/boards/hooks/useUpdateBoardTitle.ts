import { useMutation, useQueryClient } from "@tanstack/react-query"

import { boardsApi } from "../api/boardsApi"

import type { Board } from "../types/board"

export function useUpdateBoardTitle() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) =>
            boardsApi.updateBoardTitle(id, title),

        onSuccess: (updatedBoard) => {
            queryClient.setQueryData<Board[]>(["boards"], (old) => {
                if (!old) return old

                return old.map((board: Board) =>
                    board.id === updatedBoard.id ? updatedBoard : board,
                )
            })
        },
    })
}
