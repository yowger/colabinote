import { Rnd } from "react-rnd"

import { DEFAULT_NOTE_SIZE } from "../../constants/note"
import { useNotesStore } from "../../stores/useNotesStore"
import NoteFrame from "./NoteFrame"
import type { Note } from "../../types/note"
import { useBoardInteractionStore } from "../../stores/useBoardInteractionStore"

type NoteItemProps = {
    note: Note
}

export default function NoteItem({ note }: NoteItemProps) {
    const { setActiveInteraction } = useBoardInteractionStore()
    const updateNote = useNotesStore((store) => store.updateNote)
    const bringToFront = useNotesStore((store) => store.bringToFront)

    return (
        <Rnd
            default={{
                x: note.x,
                y: note.y,
                width: note.width,
                height: note.height,
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
            onMouseDown={() => bringToFront(note.id)}
            style={{
                zIndex: note.zIndex,
            }}
            dragHandleClassName="note-drag-handle"
            bounds="parent"
            minWidth={DEFAULT_NOTE_SIZE.width}
            minHeight={DEFAULT_NOTE_SIZE.height}
        >
            <NoteFrame note={note} />
        </Rnd>
    )
}
