import { useRef } from "react"

import { BoardCanvas } from "./BoardCanvas"
import { BoardViewport } from "./BoardViewport"
import BoardToolbar from "../toolbar/NotesBoardToolbar"
import NotesLayer from "../notes/NotesLayer"
import { MiniMap } from "../../features/minimap/components/Minimap"
import { useBoardInteraction } from "../../features/interactions/hooks/useBoardInteraction"
import { useBoardInteractionStore } from "../../features/boards/stores/useBoardInteractionStore"
import { useNoteIdsYjs } from "../../core/yjs/notes/useNoteIds"
import { useAwarenessUsers } from "../../core/presence/hooks/useAwarenessUsers"
import { usePresenceUser } from "../../core/presence/hooks/usePresenceUser"
// import { useNotesMeta } from "../../presence/hooks/useNotesMeta"
import CursorsLayer from "../cursor/components/CursorsLayer"
import { useHocuspocusContext } from "../../hooks/useHocuspocusContext"
import { DEFAULT_NOTE_HEIGHT, DEFAULT_NOTE_WIDTH } from "../../core/notes/constants/defaults"
import { useNotesMeta } from "../../core/yjs/notes/useNotesMeta"

const BOARD_DIMENSIONS = {
    width: 2000,
    height: 1000,
}

export default function NotesBoard() {
    usePresenceUser()

    const { provider } = useHocuspocusContext()
    const users = useAwarenessUsers()

    const { viewportRef, handlers } = useBoardInteraction()
    const activeInteraction = useBoardInteractionStore(
        (store) => store.activeInteraction,
    )
    const isPanning = activeInteraction === "pan"

    const noteIds = useNoteIdsYjs()
    const notesMeta = useNotesMeta()

    const canvasRef = useRef<HTMLDivElement | null>(null)

    const clientId = provider?.awareness?.clientID
    const otherUsers = users.filter((u) => u.clientId !== clientId)

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <BoardToolbar />

            <MiniMap
                className="absolute z-20 top-0 right-0 m-6"
                viewportRef={viewportRef}
                boardWidth={BOARD_DIMENSIONS.width}
                boardHeight={BOARD_DIMENSIONS.height}
                width={DEFAULT_NOTE_WIDTH}
                height={DEFAULT_NOTE_HEIGHT}
                items={notesMeta}
            />

            <BoardViewport
                ref={viewportRef}
                isPanning={isPanning}
                {...handlers}
            >
                <BoardCanvas
                    ref={canvasRef}
                    width={BOARD_DIMENSIONS.width}
                    height={BOARD_DIMENSIONS.height}
                >
                    <NotesLayer noteIds={noteIds} canvasRef={canvasRef} />

                    <CursorsLayer users={otherUsers} />
                </BoardCanvas>
            </BoardViewport>
        </div>
    )
}
