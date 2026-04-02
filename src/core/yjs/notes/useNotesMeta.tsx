import { useEffect, useState } from "react"
import * as Y from "yjs"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"
import { MAP_ID } from "../constants/note"

export type NoteMeta = {
    id: string
    x: number
    y: number
    width: number
    height: number
}

export function useNotesMeta() {
    const { provider } = useHocuspocusContext()
    const [notesMeta, setNotesMeta] = useState<NoteMeta[]>([])

    useEffect(() => {
        const doc = provider?.document
        if (!doc) return

        const yNotes = doc.getMap<Y.Map<unknown>>(MAP_ID)
        if (!yNotes || !(yNotes instanceof Y.Map)) return

        const update = () => {
            const result: NoteMeta[] = []

            yNotes.forEach((yNote, id) => {
                result.push({
                    id,
                    x: yNote.get("x") as number,
                    y: yNote.get("y") as number,
                    width: yNote.get("width") as number,
                    height: yNote.get("height") as number,
                })
            })

            setNotesMeta(result)
        }

        update()
        yNotes.observeDeep(update)

        return () => {
            yNotes.unobserveDeep(update)
        }
    }, [provider])

    return notesMeta
}
