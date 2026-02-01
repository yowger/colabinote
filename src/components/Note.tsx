export type Note = {
    id: number
    x: number
    y: number
    width: number
    height: number
    text: string
}

export type NoteProps = {
    note: Note
    onMoveMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void
    onResizeMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export default function Note({
    note,
    onMoveMouseDown,
    onResizeMouseDown,
}: NoteProps) {
    return (
        <div
            className="absolute bg-yellow-200 rounded shadow select-none"
            style={{
                left: note.x,
                top: note.y,
                width: note.width,
                height: note.height,
            }}
        >
            <div
                className="group h-7 flex items-center px-2 bg-yellow-300 rounded-t"
                onMouseDown={onMoveMouseDown}
            >
                <span className="text-xs font-medium text-gray-700 pointer-events-auto">
                    Note Title
                </span>
            </div>

            <div className="p-2 text-sm">{note.text}</div>

            <div
                onMouseDown={onResizeMouseDown}
                className="absolute right-1 bottom-1 w-3 h-3 bg-gray-600 cursor-se-resize rounded-sm"
                title="Resize"
            />
        </div>
    )
}

/*
TODO
- Editable note text
- Note resize
- Note selection / outline
- Multiplayer ownership
*/
