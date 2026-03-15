import { create } from "zustand"

import type { Note } from "../types/note"

type NotesState = {
    notes: Record<string, Note>
    topZ: number
    selectedNoteId: string | null

    addNote: (note: Note) => void
    updateNote: (id: string, patch: Partial<Note>) => void
    removeNote: (id: string) => void
    bringToFront: (id: string) => void
    selectNote: (id: string | null) => void
}

export const useNotesStore = create<NotesState>((set) => ({
    notes: {},
    topZ: 1,
    selectedNoteId: null,

    addNote: (note) =>
        set((state) => ({ notes: { ...state.notes, [note.id]: note } })),

    updateNote: (id, patch) => {
        if (!id || !patch) return

        set((state) => ({
            notes: {
                ...state.notes,
                [id]: { ...state.notes[id], ...patch },
            },
        }))
    },

    removeNote: (id) =>
        set((state) => {
            if (!state.notes[id]) return state

            const copy = { ...state.notes }
            delete copy[id]
            return { notes: copy }
        }),

    bringToFront: (id) => {
        if (!id) return

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
        })
    },

    selectNote: (id) => {
        if (id === null) return

        set({ selectedNoteId: id })
    },
}))
