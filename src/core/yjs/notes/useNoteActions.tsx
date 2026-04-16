import * as Y from "yjs"

import { MAP_ID } from "../constants/note"
import type { Note } from "../../notes/types/note"
import { useHocuspocusContext } from "../../hocuspocus/hooks/useHocuspocusContext"
import {
    DEFAULT_NOTE_COLOR,
    DEFAULT_NOTE_HEIGHT,
    DEFAULT_NOTE_WIDTH,
} from "../../notes/constants/defaults"

export function useNoteActions() {
    const { provider } = useHocuspocusContext()

    const addNote = (noteData?: Partial<Note>) => {
        if (!provider) return

        const doc = provider?.document
        if (!doc) return

        const yNotes = doc?.getMap(MAP_ID)
        if (!yNotes) return

        const noteId = noteData?.id ?? crypto.randomUUID()

        const newNote: Note = {
            id: noteId,
            title: "New Note",
            content: "",
            color: DEFAULT_NOTE_COLOR,
            x: 100,
            y: 100,
            width: DEFAULT_NOTE_WIDTH,
            height: DEFAULT_NOTE_HEIGHT,
            zIndex: 0,
            ...noteData,
        }

        doc.transact(() => {
            const yNote = new Y.Map()

            Object.entries(newNote).forEach(([key, value]) => {
                yNote.set(key, value)
            })

            yNotes.set(noteId, yNote)
        })
    }

    const updateNote = (id: string, patch: Partial<Note>) => {
        if (!provider) return

        const doc = provider?.document
        if (!doc) return

        const yNotes = doc?.getMap<Y.Map<unknown>>(MAP_ID)
        const yNote = yNotes.get(id)

        if (!yNote || !(yNote instanceof Y.Map)) return

        doc.transact(() => {
            Object.entries(patch).forEach(([key, value]) => {
                const currentValue = yNote.get(key as keyof Note)

                if (currentValue !== value) {
                    yNote.set(key as keyof Note, value)
                }
            })
        })
    }

    const removeNote = (id: string) => {
        if (!provider) return

        const doc = provider?.document
        if (!doc) return

        doc.getMap<Note>(MAP_ID).delete(id)
    }

    return { addNote, updateNote, removeNote }
}
