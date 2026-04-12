import { useQuery } from "@tanstack/react-query"

import { boardsApi } from "../api/boardsApi"

export function useBoards() {
    return useQuery({
        queryKey: ["boards"],
        queryFn: boardsApi.getBoards,
    })
}
