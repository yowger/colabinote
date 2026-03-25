import { useEffect, useState } from "react"
import * as Y from "yjs"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"

type NoteMeta = {
    id: string
    x: number
    y: number
    width: number
    height: number
}

export function useNotesMeta(): NoteMeta[] {
    const { provider } = useHocuspocusContext()
    const [notes, setNotes] = useState<NoteMeta[]>([])

    useEffect(() => {
        if (!provider) return

        const ydoc = provider.document
        const metaMap = ydoc.getMap<Y.Map<number>>("notes_meta")

        const update = () => {
            const next: NoteMeta[] = []

            metaMap.forEach((value, id) => {
                next.push({
                    id,
                    x: value.get("x") ?? 0,
                    y: value.get("y") ?? 0,
                    width: value.get("width") ?? 0,
                    height: value.get("height") ?? 0,
                })
            })

            setNotes(next)
        }

        update()
        metaMap.observeDeep(update)

        return () => {
            metaMap.unobserveDeep(update)
        }
    }, [provider])

    return notes
}
