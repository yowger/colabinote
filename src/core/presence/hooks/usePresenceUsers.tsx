import { useEffect, useState } from "react"

import { useHocuspocusContext } from "../../hocuspocus/hooks/useHocuspocusContext"

import type { PresenceAction, PresenceState } from "../types/presence"

type UsePresenceOptions = {
    excludeSelf?: boolean
}

export function usePresenceUsers({
    excludeSelf = false,
}: UsePresenceOptions = {}) {
    const { providerRef: provider } = useHocuspocusContext()
    const [users, setUsers] = useState<
        (PresenceState & { clientId: number })[]
    >([])

    useEffect(() => {
        if (!provider?.awareness) return

        const awareness = provider.awareness

        const update = () => {
            const myClientId = awareness.clientID

            const states = Array.from(awareness.getStates().entries())
                .map(([clientId, state]) => ({
                    clientId,
                    ...(state as Partial<PresenceState>),
                }))
                .filter(
                    (user): user is PresenceState & { clientId: number } => {
                        return !!user.user
                    },
                )
                .filter((user) => {
                    if (!excludeSelf) return true
                    return user.clientId !== myClientId
                })

            setUsers(states)
        }

        awareness.on("change", update)
        update()

        return () => {
            awareness.off("change", update)
        }
    }, [provider, excludeSelf])

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
