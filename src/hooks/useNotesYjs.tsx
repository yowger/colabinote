import { useEffect, useState } from "react"

import { useHocuspocusContext } from "./useHocuspocusContext"
import type { Note } from "../features/notes/types/note"
import { MAP_ID } from "../conts/noteMaps"

export function useNotesYjs() {
    const { provider } = useHocuspocusContext()
    const doc = provider?.document

    const [notes, setNotes] = useState<Note[]>([])

    useEffect(() => {
        if (!doc) return

        const yNotes = doc.getMap<Note>(MAP_ID)

        const updateNotes = () => {
            setNotes([...yNotes.values()])
        }

        updateNotes()
        yNotes.observe(updateNotes)

        return () => {
            yNotes.unobserve(updateNotes)
        }
    }, [doc])

    const addNote = (note: Note) => {
        const yNotes = doc?.getMap<Note>(MAP_ID)

        if (!yNotes) return

        yNotes.set(note.id, note)
    }

    const updateNote = (id: string, patch: Partial<Note>) => {
        const yNotes = doc?.getMap<Note>(MAP_ID)
        if (!yNotes) return

        const noteExist = yNotes.get(id)
        if (!noteExist) return

        yNotes.set(id, { ...noteExist, ...patch })
    }

    const removeNote = (id: string) => {
        const yNotes = doc?.getMap<Note>(MAP_ID)
        if (!yNotes) return

        yNotes.delete(id)
    }

    return { notes, addNote, updateNote, removeNote }
}
