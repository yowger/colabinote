import { create } from "zustand"



export type EditingTarget = {
    noteId: string
    field: "content" | "header"
} | null

type NotesState = {
    selectedNoteId: string | null
    editing: EditingTarget

    selectNote: (id: string | null) => void
    startEditing: (noteId: string, field: "content" | "header") => void
    stopEditing: () => void
}

export const useNoteUiStateStore = create<NotesState>((set) => ({
    selectedNoteId: null,
    editing: null,

    selectNote: (id) => {
        if (!id) return
        set({ selectedNoteId: id })
    },

    startEditing: (noteId, field) => {
        set({
            editing: { noteId, field },
            selectedNoteId: noteId,
        })
    },

    stopEditing: () => {
        set({ editing: null })
    },
}))
