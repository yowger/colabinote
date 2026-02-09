import { NOTE_COLORS, type NoteColor } from "./Note/constants/noteColors"

export type GhostNoteProps = {
    x: number
    y: number
    width: number
    height: number
    color?: NoteColor
}

export default function GhostNote({
    x,
    y,
    width,
    height,
    color = "yellow",
}: GhostNoteProps) {
    const colorObj = NOTE_COLORS.find((c) => c.name === color) ?? NOTE_COLORS[0]

    return (
        <div
            className={`absolute border-2 border-dashed border-gray-300 ${colorObj.bg} opacity-50 pointer-events-none z-20`}
            style={{ left: x, top: y, width, height }}
        />
    )
}
