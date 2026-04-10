export const NOTE_COLORS = [
    {
        name: "white",
        background: "bg-white",
        headerBackground: "bg-slate-100",
    },
    {
        name: "yellow",
        background: "bg-yellow-100",
        headerBackground: "bg-yellow-200",
    },
    {
        name: "blue",
        background: "bg-blue-100",
        headerBackground: "bg-blue-200",
    },
    {
        name: "green",
        background: "bg-green-100",
        headerBackground: "bg-green-200",
    },
    {
        name: "pink",
        background: "bg-pink-100",
        headerBackground: "bg-pink-200",
    },
    {
        name: "purple",
        background: "bg-purple-100",
        headerBackground: "bg-purple-200",
    },
] as const

export type NoteColor = (typeof NOTE_COLORS)[number]["name"]

const NOTE_COLOR_MAP = Object.fromEntries(
    NOTE_COLORS.map((color) => [color.name, color]),
) as Record<NoteColor, (typeof NOTE_COLORS)[number]>

export const getNoteColor = (color?: NoteColor) =>
    color ? NOTE_COLOR_MAP[color] : NOTE_COLORS[0]
