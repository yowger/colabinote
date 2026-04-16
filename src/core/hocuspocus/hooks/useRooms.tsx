import { useEffect, useRef } from "react"
import * as Y from "yjs"

import { roomManager } from "../utils/roomManager"

import type { HocuspocusProvider } from "@hocuspocus/provider"

export function useRoom(roomId: string | null) {
    const providerRef = useRef<HocuspocusProvider | null>(null)
    const docRef = useRef<Y.Doc | null>(null)

    useEffect(() => {
        if (!roomId) return

        const room = roomManager.getRoom(roomId)

        providerRef.current = room.provider
        docRef.current = room.doc
    }, [roomId])

    return { providerRef, docRef }
}
