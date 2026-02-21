import { create } from "zustand"

import type { Note } from "../types/note"

type NotesState = {
    notes: Record<string, Note>
    topZ: number

    addNote: (note: Note) => void
    updateNote: (id: string, patch: Partial<Note>) => void
    removeNote: (id: string) => void
    bringToFront: (id: string) => void
}

export const useNotesStore = create<NotesState>((set) => ({
    notes: {},
    topZ: 1,

    addNote: (note) =>
        set((state) => ({ notes: { ...state.notes, [note.id]: note } })),

    updateNote: (id, patch) =>
        set((state) => ({
            notes: {
                ...state.notes,
                [id]: { ...state.notes[id], ...patch },
            },
        })),

    removeNote: (id) =>
        set((state) => {
            const copy = { ...state.notes }
            delete copy[id]
            return { notes: copy }
        }),

    bringToFront: (id) =>
        set((state) => {
            const nextZ = state.topZ + 1
            const note = state.notes[id]

            if (!note) return state

            if (note.zIndex === state.topZ) return state

            return {
                topZ: nextZ,
                notes: {
                    ...state.notes,
                    [id]: {
                        ...note,
                        zIndex: nextZ,
                    },
                },
            }
        }),
}))
