type NoteToolbarProps = {
    noteId: string
}

export default function NoteToolbar({ noteId }: NoteToolbarProps) {
    console.log("🚀 ~ NoteToolbar ~ noteId:", noteId)

    return <div className="p-1 flex gap-1">NoteToolbar</div>
}
