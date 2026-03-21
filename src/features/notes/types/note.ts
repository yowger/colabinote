import type { NoteColor } from "../../../components/Note/types/colors"

export type Note = {
    id: string
    x: number
    y: number
    width: number
    height: number
    title: string
    content: string
    color?: NoteColor
    updatedAt?: number
    zIndex?: number 
}
