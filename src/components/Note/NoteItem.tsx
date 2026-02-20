import { Rnd } from "react-rnd"
import type { Note } from "../../types/note"
import { useNotesStore } from "../../hooks/useNotesStore"

type NoteItemProps = {
    note: Note
}

export default function NoteItem({ note }: NoteItemProps) {
    const updateNote = useNotesStore((store) => store.updateNote)

    return (
        <Rnd
            size={{ width: note.width, height: note.height }}
            position={{ x: note.x, y: note.y }}
            onDragStop={(_event, delta) =>
                updateNote(note.id, { x: delta.x, y: delta.y })
            }
            onResizeStop={(_event, _direction, ref, _delta, position) =>
                updateNote(note.id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: position.x,
                    y: position.y,
                })
            }
        >
            <div className="flex bg-red-500 h-full w-full">Rnd</div>
        </Rnd>
    )
}
