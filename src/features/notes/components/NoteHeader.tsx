type NoteHeaderProps = {
    title: string
}

export default function NoteHeader({ title }: NoteHeaderProps) {
    return (
        <div className="note-drag-handle px-2 py-1 cursor-move select-none">
            {title}
        </div>
    )
}
