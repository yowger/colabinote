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

        ydoc.transact(() => {
            Object.entries(updates).forEach(([key, value]) => {
                if (value !== undefined) {
                    noteMeta.set(key, value)
                }
            })
        })
    }

    return { updateNotesMeta }
}
