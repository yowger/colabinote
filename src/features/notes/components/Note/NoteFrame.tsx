import { NOTE_COLOR_STYLES } from "../../../../components/Note/styles/noteColorStyles"
import type { Note } from "../../types/note"
import NoteContent from "./NoteContent"
import NoteHeader from "./NoteHeader"
import NoteToolbar from "../NoteTools/NoteToolbar"

type NoteFrameProps = {
    note: Note
    ref?: React.Ref<HTMLDivElement>
}

export default function NoteFrame({ note, ref }: NoteFrameProps) {
    const colorStyle = NOTE_COLOR_STYLES[note.color ?? "yellow"].background

    return (
        <div
            ref={ref}
            data-note-id={note.id}
            data-no-pan="true"
            className={`shadow-md rounded-xs flex flex-col h-full w-full ${colorStyle}`}
        >
            <NoteHeader title={note.title} />
            <NoteContent content={note.content} />
            <NoteToolbar noteId={note.id} />
        </div>
    )
}
