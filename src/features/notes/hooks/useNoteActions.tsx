import type { NoteColor } from "../../../components/Note/types/colors"
import { useNotesStore } from "../stores/useNotesStore"

export function useNoteActions() {
    const updateNote = useNotesStore((store) => store.updateNote)
    const removeNoteStore = useNotesStore((store) => store.removeNote)

    const changeColor = (noteId: string, color: NoteColor) => {
        updateNote(noteId, { color })
    }

    const removeNote = (noteId: string) => {
        removeNoteStore(noteId)
    }

    return {
        changeColor,
        removeNote,
    }
}
