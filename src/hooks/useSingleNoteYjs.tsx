import { useEffect, useState } from "react"

import { useHocuspocusContext } from "./useHocuspocusContext"
import type { Note } from "../features/notes/types/note"
import { MAP_ID } from "../conts/noteMaps"
import * as Y from "yjs"

export function useSingleNoteYjs(id: string) {
    const { provider } = useHocuspocusContext()
    const [note, setNote] = useState<Note | null>(null)
    console.log("render: ", id)
    useEffect(() => {
        const doc = provider?.document
        if (!doc || !id) return

        const yNotes = doc.getMap<Y.Map<Note>>(MAP_ID)
        const yNote = yNotes.get(id)

        if (!yNote || !(yNote instanceof Y.Map)) return

        const updateNote = () => {
            const rawNote = yNote.toJSON() as Note
            setNote(rawNote)
        }

        updateNote()
        yNote.observe(updateNote)

        return () => {
            yNote.unobserve(updateNote)
        }
    }, [id, provider])

    return note
}
