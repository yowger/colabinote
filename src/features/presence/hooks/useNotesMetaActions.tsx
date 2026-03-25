import * as Y from "yjs"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"

type NotesMetaUpdate = {
    x?: number
    y?: number
    width?: number
    height?: number
}

export function useNotesMetaActions() {
    const { provider } = useHocuspocusContext()

    const updateNotesMeta = (noteId: string, updates: NotesMetaUpdate) => {
        if (!provider) return

        const ydoc = provider.document
        const notesMeta = ydoc.getMap<Y.Map<number | string>>("notes_meta")

        let noteMeta = notesMeta.get(noteId)

        if (!noteMeta) {
            noteMeta = new Y.Map()
            notesMeta.set(noteId, noteMeta)
        }

        if (updates.x !== undefined) noteMeta.set("x", updates.x)
        if (updates.y !== undefined) noteMeta.set("y", updates.y)
        if (updates.width !== undefined) noteMeta.set("width", updates.width)
        if (updates.height !== undefined) noteMeta.set("height", updates.height)
    }

    return { updateNotesMeta }
}
