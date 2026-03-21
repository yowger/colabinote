import { useEffect, useState } from "react"

import { useHocuspocusContext } from "./useHocuspocusContext"
import type { AwarenessState } from "../features/notes/types/awareness"

export function useAwarenessUsers() {
    const { provider } = useHocuspocusContext()
    const [users, setUsers] = useState<
        (AwarenessState & { clientId: number })[]
    >([])

    useEffect(() => {
        if (!provider?.awareness) return

        const awareness = provider.awareness

        const update = () => {
            const states = Array.from(awareness.getStates().entries()).map(
                ([clientId, state]) => ({
                    clientId,
                    ...(state as AwarenessState),
                }),
            )

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
