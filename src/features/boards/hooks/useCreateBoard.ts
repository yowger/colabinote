import { useMutation, useQueryClient } from "@tanstack/react-query"

import { boardsApi } from "../api/boardsApi"

import type { Board } from "../types/board"

export function useCreateBoard() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: boardsApi.createBoard,

        onSuccess: (newBoard) => {
            queryClient.setQueryData<Board[]>(["boards"], (old) => {
                return old ? [newBoard, ...old] : [newBoard]
            })
        },
    })
}
