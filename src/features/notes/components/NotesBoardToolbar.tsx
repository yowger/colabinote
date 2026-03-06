import { useNotesStore } from "../stores/useNotesStore"
import { DEFAULT_NOTE_COLOR } from "./constants/defaults"

export default function NotesBoardToolbar() {
    const { addNote } = useNotesStore()

    return (
        <div>
            <button
                onClick={() =>
                    addNote({
                        id: Date.now().toLocaleString(),
                        x: 20,
                        y: 20,
                        width: 150,
                        height: 150,
                        title: "New Note",
                        content: "New note content",
                        updatedAt: Date.now(),
                        color: DEFAULT_NOTE_COLOR,
                    })
                }
            >
                Add Note
            </button>
        </div>
    )
}
