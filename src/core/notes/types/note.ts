import type { NoteColor } from "../styles/noteColorStyles"

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

export type DraggableState =
    | {
          type: "idle"
      }
    | {
          type: "preview"
          container: HTMLElement
      }
    | {
          type: "dragging"
      }

export type NoteActionPayload =
    | {
          action: "move"
          note: {
              id: string
              width: number
              height: number
          }
          clientX: number
          clientY: number
          offsetX: number
          offsetY: number
      }
    | {
          action: "resize"
          note: {
              id: string
              width: number
              height: number
          }
      }
