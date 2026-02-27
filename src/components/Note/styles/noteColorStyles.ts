import type { NoteColor } from "../types/colors"

export const NOTE_COLOR_STYLES: Record<
    NoteColor,
    {
        background: string
        header: string
    }
> = {
    white: {
        background: "bg-white",
        header: "bg-gray-100",
    },
    yellow: {
        background: "bg-yellow-200",
        header: "bg-yellow-300",
    },
    blue: {
        background: "bg-blue-200",
        header: "bg-blue-300",
    },
    green: {
        background: "bg-green-200",
        header: "bg-green-300",
    },
    pink: {
        background: "bg-pink-200",
        header: "bg-pink-300",
    },
    purple: {
        background: "bg-purple-200",
        header: "bg-purple-300",
    },
}

export const COLOR_BUTTON_STYLES: Record<NoteColor, string> = {
    white: "bg-white",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    pink: "bg-pink-500",
    purple: "bg-purple-500",
}
