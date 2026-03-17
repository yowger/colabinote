import { useNotesYjs } from "../../../hooks/useNotesYjs"
import { DEFAULT_NOTE_COLOR } from "./constants/defaults"

export default function NotesBoardToolbar() {
    const { addNote } = useNotesYjs()

    const handleAddNote = () => {
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
