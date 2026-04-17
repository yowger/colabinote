import { HocuspocusProvider } from "@hocuspocus/provider"
import * as Y from "yjs"

type Room = {
    id: string
    provider: HocuspocusProvider
    doc: Y.Doc
}

class ConnectionManager {
    private activeRoom: Room | null = null

    getRoom(roomId: string, url: string): Room {
        if (this.activeRoom?.id === roomId) {
            return this.activeRoom
        }

        this.destroyActiveRoom()

        const doc = new Y.Doc()
        const provider = new HocuspocusProvider({
            url,
            name: roomId,
            document: doc,
        })

        this.activeRoom = { id: roomId, provider, doc }
        return this.activeRoom
    }

    destroyActiveRoom() {
        if (this.activeRoom) {
            this.activeRoom.provider.destroy()
            this.activeRoom.doc.destroy()
            this.activeRoom = null
        }
    }
}

export const roomManager = new ConnectionManager()
