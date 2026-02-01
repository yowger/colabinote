export type GhostNoteProps = {
    x: number
    y: number
    width: number
    height: number
}

export default function GhostNote({ x, y, width, height }: GhostNoteProps) {
    return (
        <div
            className="absolute border-2 border-dashed border-gray-300 bg-yellow-100 opacity-50 pointer-events-none"
            style={{ left: x, top: y, width, height }}
        />
    )
}
