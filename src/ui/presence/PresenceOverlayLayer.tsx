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
}

export default function PresenceOverlayLayer({ users, noteRefs }: Props) {
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
                        className="fixed pointer-events-none z-50"
                        style={{
                            top: rect.top,
                            left: rect.left,
                            width: rect.width,
                            height: rect.height,
                            border: `2.5px solid ${user.user.color}`,
                        }}
                    >
                        {isDragging(action) && (
                            <div className="absolute -top-10">
                                <div
                                    className="text-[14px] px-2 py-0.5 rounded text-white whitespace-nowrap"
                                    style={{
                                        backgroundColor: user.user.color,
                                    }}
                                >
                                    {user.user.name} is dragging
                                </div>
                            </div>
                        )}
                        {isResizing(action) && (
                            <div className="absolute -top-10">
                                <div
                                    className="text-[13.75px] px-2 py-0.5 rounded text-white whitespace-nowrap"
                                    style={{
                                        backgroundColor: user.user.color,
                                    }}
                                >
                                    {user.user.name} is resizing
                                </div>
                            </div>
                        )}
                        {isEditing(action) && (
                            <div className="absolute -top-10">
                                <div
                                    className="text-[13.75px] px-2 py-0.5 rounded text-white whitespace-nowrap"
                                    style={{
                                        backgroundColor: user.user.color,
                                    }}
                                >
                                    {user.user.name} is editing
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </>
    )
}
