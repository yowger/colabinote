import { useEffect, useState } from "react"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"
import type { PresenceState } from "../types/presence"

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
