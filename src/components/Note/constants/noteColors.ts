export const NOTE_COLORS = [
    {
        name: "white",
        background: "bg-white",
        headerBackground: "bg-gray-100",
    },
    {
        name: "yellow",
        background: "bg-yellow-200",
        headerBackground: "bg-yellow-300",
    },
    {
        name: "blue",
        background: "bg-blue-200",
        headerBackground: "bg-blue-300",
    },
    {
        name: "green",
        background: "bg-green-200",
        headerBackground: "bg-green-300",
    },
    {
        name: "pink",
        background: "bg-pink-200",
        headerBackground: "bg-pink-300",
    },
    {
        name: "purple",
        background: "bg-purple-200",
        headerBackground: "bg-purple-300",
    },
] as const

export type NoteColor = (typeof NOTE_COLORS)[number]["name"]

const NOTE_COLOR_MAP = Object.fromEntries(
    NOTE_COLORS.map((color) => [color.name, color]),
) as Record<NoteColor, (typeof NOTE_COLORS)[number]>

export const getNoteColor = (color?: NoteColor) =>
    color ? NOTE_COLOR_MAP[color] : NOTE_COLORS[0]
