import ColorTool from "./ColorTool"

type NoteToolbarProps = {
    noteId: string
}

export default function NoteToolbar({ noteId }: NoteToolbarProps) {
    return (
        <div className="flex gap-2">
            <ColorTool noteId={noteId} />
        </div>
    )
}
