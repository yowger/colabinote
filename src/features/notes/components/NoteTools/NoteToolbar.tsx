import ColorTool from "./ColorTool"
import RemoveTool from "./RemoveTool"

export default function NoteToolbar() {
    return (
        <div className="flex gap-0.5">
            <ColorTool />
            <RemoveTool />
        </div>
    )
}
