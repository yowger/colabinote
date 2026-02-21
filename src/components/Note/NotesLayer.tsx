import { useNotesStore } from "../../features/notes/hooks/useNotesStore"
import NoteItem from "../../features/notes/components/NoteItem"

export default function NotesLayer() {
    const notesMap = useNotesStore((s) => s.notes)
    const notes = Object.values(notesMap)

    return (
        <>
            {notes.map((note) => (
                <NoteItem key={note.id} note={note} />
            ))}
        </>
    )
}
