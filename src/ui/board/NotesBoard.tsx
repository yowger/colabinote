import { useRef } from "react"

import { BoardCanvas } from "./BoardCanvas"
import { BoardViewport } from "./BoardViewport"
import BoardToolbar from "../toolbar/NotesBoardToolbar"
import NotesLayer from "../notes/NotesLayer"
import { MiniMap } from "../minimap/Minimap"
import { useBoardInteraction } from "../../features/boards/hooks/useBoardInteraction"
import { useBoardInteractionStore } from "../../features/boards/stores/useBoardInteractionStore"
import { useNoteIdsYjs } from "../../core/yjs/notes/useNoteIds"
import { usePresenceUsers } from "../../core/presence/hooks/usePresenceUsers"
import { usePresenceUser } from "../../core/presence/hooks/usePresenceUser"
import CursorsLayer from "../cursor/components/CursorsLayer"
import {
    DEFAULT_NOTE_HEIGHT,
    DEFAULT_NOTE_WIDTH,
} from "../../core/notes/constants/defaults"
import { useNotesMeta } from "../../core/yjs/notes/useNotesMeta"
import { useBoardsStore } from "../../features/boards/stores/useBoardsStore"
import emptyNotes from "../../assets/images/emptyNotes.svg"

const BOARD_DIMENSIONS = {
    width: 2000,
    height: 1000,
}

export default function NotesBoard() {
    usePresenceUser()

    const activeBoardId = useBoardsStore((store) => {
        return store.activeBoardId
    })
    const otherUsers = usePresenceUsers({ excludeSelf: true })

    const { viewportRef, handlers } = useBoardInteraction()
    const activeInteraction = useBoardInteractionStore(
        (store) => store.activeInteraction,
    )
    const isPanning = activeInteraction === "pan"

    const noteIds = useNoteIdsYjs()
    const notesMeta = useNotesMeta()

    const canvasRef = useRef<HTMLDivElement | null>(null)

    if (!activeBoardId) {
        return (
            <div className="flex flex-1 items-center justify-center bg-bg-canvas">
                <div className="flex flex-col items-center text-center max-w-sm px-6">
                    <img
                        src={emptyNotes}
                        alt="No board selected"
                        className="w-72 mb-6 opacity-90 select-none pointer-events-none"
                    />

                    <h2 className="text-lg font-medium text-text mb-2">
                        No notebook selected
                    </h2>

                    <p className="text-sm text-text-muted">
                        Pick a notebook from the sidebar or create a new one to
                        start writing.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 overflow-hidden bg-bg-canvas bg-grid">
            <BoardToolbar />

            <MiniMap
                className="absolute z-20 bottom-0 right-0 m-6"
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
