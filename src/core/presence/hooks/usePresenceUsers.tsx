import { useEffect, useState } from "react"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"

import type { PresenceAction, PresenceState } from "../types/presence"

export function usePresenceUsers() {
    const { provider } = useHocuspocusContext()
    const [users, setUsers] = useState<
        (PresenceState & { clientId: number })[]
    >([])

    useEffect(() => {
        if (!provider?.awareness) return

        const awareness = provider.awareness

        const update = () => {
            const states = Array.from(awareness.getStates().entries())
                .map(([clientId, state]) => ({
                    clientId,
                    ...(state as Partial<PresenceState>),
                }))
                .filter((u): u is PresenceState & { clientId: number } => {
                    return !!u.user
                })

            setUsers(states)
        }

        awareness.on("change", update)
        update()

        return () => {
            awareness.off("change", update)
        }
    }, [provider])

    return users
}

export function isNoteAction(action: PresenceAction) {
    return (
        action?.type === "dragging-note" ||
        action?.type === "editing-note" ||
        action?.type === "resizing-note"
    )
}

export function isDragging(action: PresenceAction) {
    return action?.type === "dragging-note"
}

export function isResizing(action: PresenceAction) {
    return action?.type === "resizing-note"
}

export function isEditing(action: PresenceAction) {
    return action?.type === "editing-note"
}
