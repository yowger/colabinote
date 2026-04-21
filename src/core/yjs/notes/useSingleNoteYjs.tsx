import { useEffect, useState } from "react"

import { useHocuspocusContext } from "../../hocuspocus/hooks/useHocuspocusContext"
import type { Note } from "../../notes/types/note"
import { MAP_ID } from "../constants/note"
import * as Y from "yjs"

export function useSingleNoteYjs(id: string) {
    const { provider } = useHocuspocusContext()

    const [note, setNote] = useState<Note | null>(null)
    const [fragment, setFragment] = useState<Y.XmlFragment | null>(null)

    useEffect(() => {
        const doc = provider?.document
        if (!doc || !id) return

        const yNotes = doc.getMap<Y.Map<unknown>>(MAP_ID)
        const yNote = yNotes.get(id)

        if (!yNote || !(yNote instanceof Y.Map)) return

        const yContent = yNote.get("content") as Y.XmlFragment

        const updateYFragment = (fragment: Y.XmlFragment) => {
            setFragment(fragment)
        }

        if (yContent instanceof Y.XmlFragment) {
            updateYFragment(yContent)
        }

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

    return { note, fragment }
}
