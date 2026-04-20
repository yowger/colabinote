import { createPortal } from "react-dom"
import clsx from "clsx"
import { useRef } from "react"

import { useSingleNoteYjs } from "../../core/yjs/notes/useSingleNoteYjs"
import NoteDragPreview from "./NotePreview"
import { useNoteInteractions } from "../../core/notes/hooks/useNoteInteraction"
import { usePresenceActions } from "../../core/presence/hooks/usePresenceActions"
import { getNoteTheme } from "../../core/notes/constants/noteColors"

import type { NoteActionPayload } from "../../core/notes/types/note"
import { type NoteColor } from "../../core/notes/constants/noteColors"

export type DraggableNoteProps = {
    noteId: string
    onSelect?: (noteId: string) => void
    onInteractionEnd?: (data: NoteActionPayload) => void
    setNode?: (el: HTMLDivElement | null) => void
}

export default function DraggableNote({
    noteId,
    onInteractionEnd: onDragEnd,
    onSelect,
    setNode,
}: DraggableNoteProps) {
    const note = useSingleNoteYjs(noteId)
    const theme = getNoteTheme(note?.color as NoteColor)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const headerRef = useRef<HTMLDivElement | null>(null)

    const { setAction } = usePresenceActions()
    const { state, onResizeStart } = useNoteInteractions({
        note,
        noteId,
        containerRef,
        headerRef,
        onCommit: onDragEnd,
        onDragStart: (note) => {
            setAction({
                type: "dragging-note",
                noteId: note.id,
            })
        },
        onResizeStart: (note) => {
            setAction({
                type: "resizing-note",
                noteId: note.id,
            })
        },
    })

    const setContainerRef = (node: HTMLDivElement | null) => {
        containerRef.current = node
        setNode?.(node)
    }

    if (!note) return null

    return (
        <>
            <div
                ref={setContainerRef}
                onMouseDown={() => onSelect?.(noteId)}
                data-no-pan
                style={{
                    position: "absolute",
                    left: note.x ?? 0,
                    top: note.y ?? 0,
                    width: note.width ?? 0,
                    height: note.height ?? 0,
                }}
                className={clsx(
                    "group relative rounded-xs overflow-hidden",
                    theme.body,
                    theme.text,
                    theme.border,
                    state.type === "dragging" && "opacity-50",
                )}
            >
                <div
                    ref={headerRef}
                    className={clsx(
                        "cursor-grab active:cursor-grabbing p-2 h-9",
                        theme.header,
                    )}
                />

                <div className="flex-1 p-3">DraggableNote content</div>

                <div
                    onPointerDown={onResizeStart}
                    className="
                        absolute bottom-0 right-0 w-3.5 h-3.5
                        cursor-se-resize rounded-xs
                        bg-black/30
                        opacity-0 group-hover:opacity-100
                        transition-opacity
                    "
                />
            </div>

            {state.type === "drag-preview" &&
                createPortal(
                    <NoteDragPreview
                        width={note.width}
                        height={note.height}
                        color={note.color}
                    />,
                    state.container,
                )}
        </>
    )
}
