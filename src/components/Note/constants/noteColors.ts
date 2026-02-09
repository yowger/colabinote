export const NOTE_COLORS = [
    { name: "yellow", bg: "bg-yellow-200", headerBg: "bg-yellow-300" },
    { name: "blue", bg: "bg-blue-200", headerBg: "bg-blue-300" },
    { name: "green", bg: "bg-green-200", headerBg: "bg-green-300" },
    { name: "pink", bg: "bg-pink-200", headerBg: "bg-pink-300" },
    { name: "purple", bg: "bg-purple-200", headerBg: "bg-purple-300" },
] as const

export type NoteColor = (typeof NOTE_COLORS)[number]["name"]

export const getNoteColor = (color: NoteColor | undefined) =>
    NOTE_COLORS.find((c) => c.name === color) ?? NOTE_COLORS[0]
