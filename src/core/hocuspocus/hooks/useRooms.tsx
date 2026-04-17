import { useState, useLayoutEffect } from "react"
import type { HocuspocusProvider } from "@hocuspocus/provider"
import * as Y from "yjs"

import { roomManager } from "../utils/roomManager"

const SOCKET_URL = import.meta.env.VITE_SERVER_URL
const SOCKET_PATH = SOCKET_URL + "/collaboration"

export function useRoom(roomId: string | null) {
    const [roomState, setRoomState] = useState<{
        provider: HocuspocusProvider | null
        doc: Y.Doc | null
    }>({ provider: null, doc: null })

    useLayoutEffect(() => {
        const syncRoom = async () => {
            if (!roomId) {
                setRoomState({ provider: null, doc: null })
                return
            }

            const room = roomManager.getRoom(roomId, SOCKET_PATH)

            setRoomState({
                provider: room.provider,
                doc: room.doc,
            })
        }

        syncRoom()
    }, [roomId])

    return roomState
}
