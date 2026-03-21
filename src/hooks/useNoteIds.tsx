import { useEffect, useState } from "react"

import { useHocuspocusContext } from "./useHocuspocusContext"
import type { Note } from "../features/notes/types/note"
import { MAP_ID } from "../conts/noteMaps"

export function useNoteIdsYjs() {
    const { provider } = useHocuspocusContext()
    const [noteIds, setNoteIds] = useState<string[]>([])

    useEffect(() => {
        const doc = provider?.document
        if (!doc) return

        const yNotes = doc.getMap<Note>(MAP_ID)
        if (!yNotes) return

        const updateNoteIds = () => {
            setNoteIds([...yNotes.keys()])
        }

        updateNoteIds()
        yNotes.observe(updateNoteIds)

        return () => {
            yNotes.unobserve(updateNoteIds)
        }
    }, [provider])

    return noteIds
}
