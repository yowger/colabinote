import { useLayoutEffect, useState } from "react"

import {
    isDragging,
    isEditing,
    isNoteAction,
    isResizing,
} from "../../core/presence/hooks/usePresenceUsers"
import type { PresenceState } from "../../core/presence/types/presence"

type Props = {
    users: (PresenceState & { clientId: number })[]
    noteRefs: React.RefObject<Map<string, HTMLDivElement | null>>
    canvasRef: React.RefObject<HTMLDivElement | null>
}

export default function PresenceOverlayLayer({
    users,
    noteRefs,
    // canvasRef,
}: Props) {
    return (
        <>
            {users.map((user) => {
                if (!isNoteAction(user.action)) return null
                const action = user.action

                const noteEl = noteRefs.current.get(user.action.noteId)
                if (!noteEl) return null

                const rect = noteEl.getBoundingClientRect()

                return (
                    <div
                        key={user.clientId}
                        className="absolute pointer-events-none z-50"
                        style={{
                            top: rect.top,
                            left: rect.left,
                            width: rect.width,
                            height: rect.height,
                        }}
                    >
                        {isDragging(action) && (
                            <div className="absolute -top-24">
                                <div
                                    className="text-[10px] px-2 py-0.5 rounded text-white whitespace-nowrap"
                                    style={{
                                        backgroundColor: user.user.color,
                                    }}
                                >
                                    {user.user.name} is dragging this note
                                </div>
                            </div>
                        )}
                        {isResizing(action) && (
                            <div className="absolute -top-24">
                                <div
                                    className="text-[10px] px-2 py-0.5 rounded text-white whitespace-nowrap"
                                    style={{
                                        backgroundColor: user.user.color,
                                    }}
                                >
                                    {user.user.name} is resizing this note
                                </div>
                            </div>
                        )}
                        {isEditing(action) && (
                            <div className="absolute -top-6">
                                <div
                                    className="text-[10px] px-2 py-0.5 rounded text-white whitespace-nowrap"
                                    style={{
                                        backgroundColor: user.user.color,
                                    }}
                                >
                                    {user.user.name} editing
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </>
    )
}
