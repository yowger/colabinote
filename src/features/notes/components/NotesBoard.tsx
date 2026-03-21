import { BoardCanvas } from "./BoardCanvas"
import { BoardViewport } from "./BoardViewport"
import { useBoardInteraction } from "../hooks/useBoardInteraction"
import BoardToolbar from "./NotesBoardToolbar"
import NotesLayer from "./NotesLayer"
import { useBoardInteractionStore } from "../stores/useBoardInteractionStore"
import { useNoteIdsYjs } from "../../../hooks/useNoteIds"
import { useAwarenessUsers } from "../../../hooks/useAwarenessUsers"

const BOARD_DIMENSIONS = {
    width: 2000,
    height: 1000,
}

export default function NotesBoard() {
    const { viewportRef, handlers: boardHandlers } = useBoardInteraction()
    const users = useAwarenessUsers()
    const activeInteraction = useBoardInteractionStore(
        (store) => store.activeInteraction,
    )
    const noteIds = useNoteIdsYjs()

    const isPanning = activeInteraction === "pan"

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <BoardToolbar />

            {/* <MiniMap
                className="absolute z-20 top-0 right-0 m-6"
                viewportRef={viewportRef}
                boardWidth={BOARD_DIMENSIONS.width}
                boardHeight={BOARD_DIMENSIONS.height}
                width={DEFAULT_NOTE_WIDTH}
                height={DEFAULT_NOTE_HEIGHT}
                items={notes}
            /> */}

            <BoardViewport
                ref={viewportRef}
                isPanning={isPanning}
                {...boardHandlers}
            >
                <BoardCanvas
                    width={BOARD_DIMENSIONS.width}
                    height={BOARD_DIMENSIONS.height}
                >
                    <NotesLayer noteIds={noteIds} />

                    {users.map((u, i) => {
                        if (!u.cursor) return null

                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    left: u.cursor.x,
                                    top: u.cursor.y,
                                    background: u.user?.color,
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                }}
                            />
                        )
                    })}
                </BoardCanvas>
            </BoardViewport>
        </div>
    )
}
