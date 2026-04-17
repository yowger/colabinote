import { useMemo } from "react"

import { roomManager } from "../utils/roomManager"

const SOCKET_URL = import.meta.env.VITE_SERVER_URL
const SOCKET_PATH = SOCKET_URL + "/collaboration"

export function useRoom(roomId: string | null) {
    return useMemo(() => {
        if (!roomId) {
            return { provider: null, doc: null }
        }

        const room = roomManager.getRoom(roomId, SOCKET_PATH)

        return {
            provider: room.provider,
            doc: room.doc,
        }
    }, [roomId])
}
