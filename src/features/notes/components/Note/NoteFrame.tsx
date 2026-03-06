import { forwardRef } from "react"

import { NOTE_COLOR_STYLES } from "../../../../components/Note/styles/noteColorStyles"
import type { Note } from "../../types/note"
import NoteContent from "./NoteContent"
import NoteHeader from "./NoteHeader"
import { DEFAULT_NOTE_COLOR } from "../constants/defaults"

type NoteFrameProps = {
    note: Note
}

const NoteFrame = forwardRef<HTMLDivElement, NoteFrameProps>(
    ({ note }, ref) => {
        const colorStyle =
            NOTE_COLOR_STYLES[note.color ?? DEFAULT_NOTE_COLOR].background

        return (
            <div
                ref={ref}
                data-note-id={note.id}
                data-no-pan="true"
                className={`shadow-md rounded-xs flex flex-col h-full w-full ${colorStyle}`}
            >
                <NoteHeader title={note.title} />
                <NoteContent content={note.content} />
            </div>
        )
    },
)

export default NoteFrame
