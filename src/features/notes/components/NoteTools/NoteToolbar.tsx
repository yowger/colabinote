import ColorTool from "./ColorTool"
import RemoveTool from "./RemoveTool"

type NoteToolbarProps = {
    noteId: string
}

export default function NoteToolbar({ noteId }: NoteToolbarProps) {
    return (
        <div className="flex gap-0.5">
            <ColorTool noteId={noteId} />
            <RemoveTool noteId={noteId} />
        </div>
    )
}
