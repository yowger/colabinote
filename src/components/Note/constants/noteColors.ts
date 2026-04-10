export const NOTE_COLORS = [
    {
        name: "white",
        body: "bg-white",
        header: "bg-slate-200",
        text: "text-slate-800",
        border: "border-slate-200",
    },
    {
        name: "yellow",
        body: "bg-yellow-100",
        header: "bg-yellow-200",
        text: "text-slate-800",
        border: "border-yellow-200",
    },
    {
        name: "blue",
        body: "bg-blue-100",
        header: "bg-blue-200",
        text: "text-slate-800",
        border: "border-blue-200",
    },
    {
        name: "green",
        body: "bg-green-100",
        header: "bg-green-200",
        text: "text-slate-800",
        border: "border-green-200",
    },
    {
        name: "pink",
        body: "bg-pink-100",
        header: "bg-pink-200",
        text: "text-slate-800",
        border: "border-pink-200",
    },
    {
        name: "purple",
        body: "bg-purple-100",
        header: "bg-purple-200",
        text: "text-slate-800",
        border: "border-purple-200",
    },
] as const

export type NoteColor = (typeof NOTE_COLORS)[number]["name"]

const NOTE_COLOR_MAP = Object.fromEntries(
    NOTE_COLORS.map((c) => [c.name, c]),
) as Record<NoteColor, (typeof NOTE_COLORS)[number]>

export const getNoteTheme = (color?: NoteColor) =>
    color ? NOTE_COLOR_MAP[color] : NOTE_COLOR_MAP.white
