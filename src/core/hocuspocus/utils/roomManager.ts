import { HocuspocusProvider } from "@hocuspocus/provider"
import * as Y from "yjs"

type Room = {
    provider: HocuspocusProvider
    doc: Y.Doc
    lastUsed: number
}

const SOCKET_URL = import.meta.env.VITE_SERVER_SOCKET_URL

export function createRoomManager(url: string) {
    const rooms = new Map<string, Room>()
    const MAX_ROOMS = 5

    function getRoom(roomId: string) {
        let room = rooms.get(roomId)

        if (!room) {
            const doc = new Y.Doc()

            const provider = new HocuspocusProvider({
                url,
                name: roomId,
                document: doc,
            })

            room = {
                provider,
                doc,
                lastUsed: Date.now(),
            }

            rooms.set(roomId, room)

            evictIfNeeded()
        }

        room.lastUsed = Date.now()

        return room
    }

    function evictIfNeeded() {
        if (rooms.size <= MAX_ROOMS) return

        const sorted = [...rooms.entries()].sort(
            (a, b) => a[1].lastUsed - b[1].lastUsed,
        )

        const [oldestId, oldestRoom] = sorted[0]

        oldestRoom.provider.disconnect()
        oldestRoom.doc.destroy()

        rooms.delete(oldestId)
    }

    function destroyAll() {
        for (const [, room] of rooms) {
            room.provider.disconnect()
            room.doc.destroy()
        }
        rooms.clear()
    }

    return {
        getRoom,
        switchRoom: getRoom,
        destroyAll,
    }
}

export const roomManager = createRoomManager(SOCKET_URL)
