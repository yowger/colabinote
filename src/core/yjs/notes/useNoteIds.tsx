import { useEffect, useState } from "react"
import * as Y from "yjs"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"
import { MAP_ID } from "../constants/note"

export function useNoteIdsYjs() {
    const { provider } = useHocuspocusContext()
    const [noteIds, setNoteIds] = useState<string[]>([])

    useEffect(() => {
        const doc = provider?.document
        if (!doc) return

        const yNotes = doc.getMap<unknown>(MAP_ID)
        if (!yNotes || !(yNotes instanceof Y.Map)) return

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
