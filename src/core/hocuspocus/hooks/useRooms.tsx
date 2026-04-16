import * as Y from "yjs"
import type { HocuspocusProvider } from "@hocuspocus/provider"

import { roomManager } from "../utils/roomManager"

export function useRoom(roomId: string | null): {
    provider: HocuspocusProvider | null
    doc: Y.Doc | null
} {
    if (!roomId) {
        return { provider: null, doc: null }
    }

    const room = roomManager.getRoom(roomId)
    return {
        provider: room.provider,
        doc: room.doc,
    }
}
