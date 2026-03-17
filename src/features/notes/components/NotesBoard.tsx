import { BoardCanvas } from "./BoardCanvas"
import { BoardViewport } from "./BoardViewport"
import { useBoardInteraction } from "../hooks/useBoardInteraction"
import { MiniMap } from "../../minimap/components/Minimap"
import BoardToolbar from "./NotesBoardToolbar"
import NotesLayer from "./NotesLayer"
import { useBoardInteractionStore } from "../stores/useBoardInteractionStore"
import { DEFAULT_NOTE_HEIGHT, DEFAULT_NOTE_WIDTH } from "./constants/defaults"
import { useNotesYjs } from "../../../hooks/useNotesYjs"

const BOARD_DIMENSIONS = {
    width: 2000,
    height: 1000,
}

export default function NotesBoard() {
    const { viewportRef, handlers: boardHandlers } = useBoardInteraction()
    const { notes } = useNotesYjs()
    const activeInteraction = useBoardInteractionStore(
        (store) => store.activeInteraction,
    )
    const isPanning = activeInteraction === "pan"

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
                items={Object.values(notes)}
            />

            <BoardViewport
                ref={viewportRef}
                isPanning={isPanning}
                {...boardHandlers}
            >
                <BoardCanvas
                    width={BOARD_DIMENSIONS.width}
                    height={BOARD_DIMENSIONS.height}
                >
                    <NotesLayer notes={notes} />
                </BoardCanvas>
            </BoardViewport>
        </div>
    )
}
