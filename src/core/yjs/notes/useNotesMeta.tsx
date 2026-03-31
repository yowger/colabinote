import { useEffect, useState } from "react"
import * as Y from "yjs"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"
import { MAP_ID } from "../constants/note"

export function useNotesMeta() {
    const { provider } = useHocuspocusContext()
    const [notesMeta, setNotesMeta] = useState<unknown[]>([])

    useEffect(() => {
        const doc = provider?.document
        if (!doc) return

        const yNotes = doc.getMap<Y.Map<unknown>>(MAP_ID)
        if (!yNotes || !(yNotes instanceof Y.Map)) return

        const update = () => {
            const result: unknown[] = []

            yNotes.forEach((yNote, id) => {
                result.push({
                    id,
                    x: yNote.get("x"),
                    y: yNote.get("y"),
                    width: yNote.get("width"),
                    height: yNote.get("height"),
                })
            })

            setNotesMeta(result)
        }

        update()
        yNotes.observeDeep(update)

        return () => {
            yNotes.observeDeep(update)
        }
    }, [provider])

    return notesMeta
}
