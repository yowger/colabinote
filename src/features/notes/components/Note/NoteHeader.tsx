type NoteHeaderProps = {
    title: string
}

export default function NoteHeader({ title }: NoteHeaderProps) {
    return (
        <div className="note-drag-handle p-4 cursor-move select-none text-xl font-medium">
            {title}
        </div>
    )
}
