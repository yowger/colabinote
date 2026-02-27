import { BoardCanvas } from "./BoardCanvas"
import { BoardViewport } from "./BoardViewport"
import { useBoardInteraction } from "../hooks/useBoardInteraction"
import { useNotesStore } from "../stores/useNotesStore"
import { MiniMap } from "../../minimap/components/Minimap"
import BoardToolbar from "./NotesBoardToolbar"
import NotesLayer from "./NotesLayer"

const BOARD_DIMENSIONS = {
    width: 2000,
    height: 1000,
}

export default function NotesBoard() {
    const { viewportRef, handlers, isPanning } = useBoardInteraction()
    const notes = useNotesStore((store) => store.notes)

    return (
        <div className="flex flex-col h-screen">
            <BoardToolbar />

            <MiniMap
                className="absolute z-20 top-0 right-0 m-6"
                viewportRef={viewportRef}
                boardWidth={BOARD_DIMENSIONS.width}
                boardHeight={BOARD_DIMENSIONS.height}
                width={200}
                height={100}
                items={Object.values(notes)}
            />

            <BoardViewport
                ref={viewportRef}
                isPanning={isPanning}
                {...handlers}
            >
                <BoardCanvas
                    width={BOARD_DIMENSIONS.width}
                    height={BOARD_DIMENSIONS.height}
                >
                    <NotesLayer />
                </BoardCanvas>
            </BoardViewport>
        </div>
    )
}
