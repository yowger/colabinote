import { create } from "zustand"

import type { Note } from "../types/note"

type NotesState = {
    notes: Record<string, Note>

    addNote: (note: Note) => void
    updateNote: (id: string, patch: Partial<Note>) => void
    removeNote: (id: string) => void
}

export const useNotesStore = create<NotesState>((set) => ({
    notes: {},

    addNote: (note) => set((s) => ({ notes: { ...s.notes, [note.id]: note } })),

    updateNote: (id, patch) =>
        set((s) => ({
            notes: {
                ...s.notes,
                [id]: { ...s.notes[id], ...patch },
            },
        })),

    removeNote: (id) =>
        set((s) => {
            const copy = { ...s.notes }
            delete copy[id]
            return { notes: copy }
        }),
}))
