import { forwardRef } from "react"
import { Rnd } from "react-rnd"

import { DEFAULT_NOTE_SIZE } from "../../constants/note"
import NoteFrame from "./NoteFrame"
import { useBoardInteractionStore } from "../../stores/useBoardInteractionStore"
import { NOTE_COLOR_STYLES } from "../../../../components/Note/styles/noteColorStyles"
import { DEFAULT_NOTE_COLOR } from "../constants/defaults"
import NoteHeader from "./NoteHeader"
import NoteContent from "./NoteContent"
// import { useNotesYjs } from "../../../../hooks/useNotesYjs"
import { useNotesStore } from "../../stores/useNotesStore"
import { useSingleNoteYjs } from "../../hooks/useSingleNoteYjs"
import { useNoteActions } from "../../hooks/useNoteActions"
import { usePresenceActions } from "../../../presence/hooks/usePresenceActions"
import { useNotesMetaActions } from "../../../presence/hooks/useNotesMetaActions"
// import { usePresence } from "../../../presence/hooks/usePresence"

type NoteItemProps = {
    noteId: string
}

const NoteItem = forwardRef<HTMLDivElement, NoteItemProps>(
    ({ noteId }, ref) => {
        // const { updateNotesMeta } = useNotesMetaActions()
        const note = useSingleNoteYjs(noteId)
        // const { setActiveInteraction } = useBoardInteractionStore()
        // const { setInteraction, setActiveNoteId } = usePresenceActions()
        // const { updateNote } = useNotesYjs()
        // const { updateNote } = useNoteActions()
        // const setSelectedNoteId = useNotesStore((store) => store.selectNote)
        // const bringToFront = useNotesStore((store) => store.bringToFront)

        const colorStyle =
            NOTE_COLOR_STYLES[note?.color ?? DEFAULT_NOTE_COLOR].background

        if (!note) return null

        return (
            <Rnd
                // default={{
                //     height: note.height,
                //     width: note.width,
                //     x: note.x,
                //     y: note.y,
                // }}
                // size={{
                //     width: note.width,
                //     height: note.height,
                // }}
                // position={{
                //     x: note.x,
                //     y: note.y,
                // }}

                onDragStart={() => {
                    // setActiveInteraction("note-drag")
                    // setInteraction("dragging")
                }}
                onDragStop={(_event, delta) => {
                    // setActiveInteraction(null)
                    // updateNote(note.id, { x: delta.x, y: delta.y })
                    // updateNotesMeta(note.id, { x: delta.x, y: delta.y })
                }}
                onResizeStart={() => {
                    // setActiveInteraction("note-resize")
                }}
                onResizeStop={(_event, _direction, ref, _delta, position) => {
                    // setActiveInteraction(null)
                    // updateNote(note.id, {
                    //     width: ref.offsetWidth,
                    //     height: ref.offsetHeight,
                    //     x: position.x,
                    //     y: position.y,
                    // })
                    // updateNotesMeta(note.id, { x: position.x, y: position.y })
                }}
                onMouseDown={() => {
                    // setSelectedNoteId(note.id)
                    // setActiveNoteId(note.id)
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
                    <NoteHeader noteId={note.id} />
                    {/* <NoteContent note={note} /> */}
                </NoteFrame>
            </Rnd>
        )
    },
)

export default NoteItem
