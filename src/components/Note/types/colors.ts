export const NOTE_COLORS = [
    "white",
    "yellow",
    "blue",
    "green",
    "pink",
    "purple",
] as const

export type NoteColor = (typeof NOTE_COLORS)[number]
