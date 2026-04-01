import { createPortal } from "react-dom"
import clsx from "clsx"
import { useRef } from "react"

import { useSingleNoteYjs } from "../../core/yjs/notes/useSingleNoteYjs"
import { useNoteUiStateStore } from "../../features/interactions/stores/useNoteUiStateStore"
import NoteDragPreview from "./NotePreview"

import type { NoteActionPayload } from "../../core/notes/types/note"
import { useNoteInteractions } from "../../core/notes/hooks/useNoteInteraction"

export type DraggableNoteProps = {
    noteId: string
    onInteractionEnd?: (data: NoteActionPayload) => void
    setNode?: (el: HTMLDivElement | null) => void
}

export default function DraggableNote({
    noteId,
    onInteractionEnd: onDragEnd,
    setNode,
}: DraggableNoteProps) {
    const note = useSingleNoteYjs(noteId)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const headerRef = useRef<HTMLDivElement | null>(null)

    const selectNote = useNoteUiStateStore((store) => store.selectNote)

    const { state, onResizeStart } = useNoteInteractions({
        note,
        noteId,
        containerRef,
        headerRef,
        onCommit: onDragEnd,
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
                onMouseDown={() => selectNote(noteId)}
                data-no-pan
                style={{
                    position: "absolute",
                    left: note.x ?? 0,
                    top: note.y ?? 0,
                    width: note.width ?? 0,
                    height: note.height ?? 0,
                    background: note.color ?? "yellow",
                }}
                className={clsx(
                    "relative rounded-md shadow-md overflow-hidden",
                    state.type === "dragging" && "opacity-50",
                )}
            >
                <div
                    ref={headerRef}
                    className="cursor-grab active:cursor-grabbing p-2 bg-slate-900/20 h-9"
                />

                <div className="flex-1 p-3">DraggableNote content</div>

                <div
                    onPointerDown={onResizeStart}
                    className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-black/40"
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
