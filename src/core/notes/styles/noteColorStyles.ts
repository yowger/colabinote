export const noteColorStyles = {
    white: {
        background: "bg-white",
        header: "bg-gray-100",
        button: "bg-white",
    },
    yellow: {
        background: "bg-yellow-200",
        header: "bg-yellow-300",
        button: "bg-yellow-500",
    },
    blue: {
        background: "bg-blue-200",
        header: "bg-blue-300",
        button: "bg-blue-500",
    },
    green: {
        background: "bg-green-200",
        header: "bg-green-300",
        button: "bg-green-500",
    },
    pink: {
        background: "bg-pink-200",
        header: "bg-pink-300",
        button: "bg-pink-500",
    },
    purple: {
        background: "bg-purple-200",
        header: "bg-purple-300",
        button: "bg-purple-500",
    },
} as const

export type NoteColor = keyof typeof noteColorStyles
