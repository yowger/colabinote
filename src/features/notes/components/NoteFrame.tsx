import type { Note } from "../types/note"
import NoteContent from "./NoteContent"
import NoteHeader from "./NoteHeader"
import NoteToolbar from "./NoteToolbar"

type NoteFrameProps = {
    note: Note
}

export default function NoteFrame({ note }: NoteFrameProps) {
    console.log("🚀 ~ NoteFrame ~ note:", note)
    return (
        <div className="shadow flex flex-col h-full w-full bg-yellow-500">
            <NoteHeader title={note.title} />
            <NoteContent content={note.content} />
            <NoteToolbar noteId={note.id} />
        </div>
    )
}
