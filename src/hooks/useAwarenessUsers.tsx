import { useEffect, useState } from "react"

import { useHocuspocusContext } from "./useHocuspocusContext"

export function useAwarenessUsers() {
    const { provider } = useHocuspocusContext()
    const [users, setUsers] = useState<any[]>([])

    useEffect(() => {
        if (!provider || !provider.awareness) return
        const awareness = provider.awareness

        const update = () => {
            if (!awareness) return

            const states = Array.from(awareness.getStates().values())
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
