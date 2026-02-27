import { NOTE_COLOR_STYLES } from "../../../../components/Note/styles/noteColorStyles"
import type { Note } from "../../types/note"
import NoteContent from "./NoteContent"
import NoteHeader from "./NoteHeader"
import NoteToolbar from "../NoteTools/NoteToolbar"

type NoteFrameProps = {
    note: Note
}

export default function NoteFrame({ note }: NoteFrameProps) {
    const colorStyle = NOTE_COLOR_STYLES[note.color ?? "yellow"].background

    return (
        <div
            data-no-pan="true"
            className={`shadow-md rounded-xs flex flex-col h-full w-full ${colorStyle}`}
        >
            <NoteHeader title={note.title} />
            <NoteContent content={note.content} />
            <NoteToolbar noteId={note.id} />
        </div>
    )
}
