import { useNoteActions } from "../../core/yjs/notes/useNoteActions"
import { DEFAULT_NOTE_COLOR } from "../../core/notes/constants/defaults"

export default function NotesBoardToolbar() {
    const { addNote } = useNoteActions()

    const handleAddNote = () => {
        addNote({
            x: 200,
            y: 200,
            width: 150,
            height: 150,
            title: "New Note",
            updatedAt: Date.now(),
            color: DEFAULT_NOTE_COLOR,
        })
    }

    return (
        <div className="flex-none bg-green-100">
            <button
                onClick={handleAddNote}
                className="px-4 py-2 text-sm bg-green-200 hover:bg-green-300"
            >
                Add Note
            </button>
        </div>
    )
}
