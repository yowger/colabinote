export type NoteColor =
    | "white"
    | "yellow"
    | "blue"
    | "green"
    | "pink"
    | "purple"

export type Note = {
    id: string
    x: number
    y: number
    width: number
    height: number
    content: string
    color?: NoteColor
    updatedAt: number
}
