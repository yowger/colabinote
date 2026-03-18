import { forwardRef } from "react"
import { Rnd } from "react-rnd"

import { DEFAULT_NOTE_SIZE } from "../../constants/note"
import NoteFrame from "./NoteFrame"
import type { Note } from "../../types/note"
import { useBoardInteractionStore } from "../../stores/useBoardInteractionStore"
import { NOTE_COLOR_STYLES } from "../../../../components/Note/styles/noteColorStyles"
import { DEFAULT_NOTE_COLOR } from "../constants/defaults"
import NoteHeader from "./NoteHeader"
import NoteContent from "./NoteContent"
import { useNotesYjs } from "../../../../hooks/useNotesYjs"
import { useNotesStore } from "../../stores/useNotesStore"

type NoteItemProps = {
    note: Note
}

const NoteItem = forwardRef<HTMLDivElement, NoteItemProps>(({ note }, ref) => {
    const { setActiveInteraction } = useBoardInteractionStore()
    const { updateNote } = useNotesYjs()
    const setSelectedNoteId = useNotesStore((store) => store.selectNote)
    // const bringToFront = useNotesStore((store) => store.bringToFront)
    const colorStyle =
        NOTE_COLOR_STYLES[note.color ?? DEFAULT_NOTE_COLOR].background

    return (
        <Rnd
            size={{
                width: note.width,
                height: note.height,
            }}
            position={{
                x: note.x,
                y: note.y,
            }}
            onDragStart={() => {
                setActiveInteraction("note-drag")
            }}
            onDragStop={(_event, delta) => {
                setActiveInteraction(null)

                updateNote(note.id, { x: delta.x, y: delta.y })
            }}
            onResizeStart={() => {
                setActiveInteraction("note-resize")
            }}
            onResizeStop={(_event, _direction, ref, _delta, position) => {
                setActiveInteraction(null)

                updateNote(note.id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: position.x,
                    y: position.y,
                })
            }}
            onMouseDown={() => {
                setSelectedNoteId(note.id)
                // bringToFront(note.id)
            }}
            style={{
                zIndex: note.zIndex,
            }}
            dragHandleClassName="note-drag-handle"
            bounds="parent"
            minWidth={DEFAULT_NOTE_SIZE.width}
            minHeight={DEFAULT_NOTE_SIZE.height}
        >
            <NoteFrame
                ref={ref}
                data-note-id={note.id}
                className={`overflow-hidden ${colorStyle}`}
            >
                <NoteHeader noteId={note.id} title={note.title} />
                <NoteContent note={note} />
            </NoteFrame>
        </Rnd>
    )
})

export default NoteItem
