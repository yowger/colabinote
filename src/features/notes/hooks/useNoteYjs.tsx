import { useEffect, useState } from "react"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"
import type { Note } from "../types/note"
import { MAP_ID } from "../../../conts/noteMaps"

export function useNoteYjs(noteId: string | null) {
    const { provider } = useHocuspocusContext()
    const doc = provider?.document
    const [note, setNote] = useState<Note | null>(null)

    useEffect(() => {
        if (!doc || !noteId) return

        const yNotes = doc.getMap<Note>(MAP_ID)

        const updateNote = () => {
            setNote(yNotes.get(noteId) || null)
        }

        updateNote()

        yNotes.observe((event) => {
            if (event.keysChanged.has(noteId)) {
                updateNote()
            }
        })
    }, [doc, noteId])

    return note
}
