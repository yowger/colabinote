import { MiniMap } from "../../minimap/components/Minimap"
import { useBoardInteraction } from "../hooks/useBoardInteraction"
import { useNotesStore } from "../hooks/useNotesStore"
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

            <div className="absolute z-20 top-0 right-0 m-4">
                <MiniMap
                    viewportRef={viewportRef}
                    boardWidth={BOARD_DIMENSIONS.width}
                    boardHeight={BOARD_DIMENSIONS.height}
                    width={200}
                    height={100}
                    items={Object.values(notes)}
                />
            </div>

            <div
                ref={viewportRef}
                {...handlers}
                className={`flex-1 overflow-hidden bg-neutral-900 touch-none ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
            >
                <div
                    className="bg-red-900 relative"
                    style={{
                        width: BOARD_DIMENSIONS.width,
                        height: BOARD_DIMENSIONS.height,
                    }}
                >
                    <NotesLayer />
                </div>
            </div>
        </div>
    )
}
