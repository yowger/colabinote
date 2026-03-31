import { useEffect } from "react"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"

const name = Date.now().toString()
const color = "#" + Math.floor(Math.random() * 16777215).toString(16)

export function usePresenceUser() {
    const { provider } = useHocuspocusContext()

    useEffect(() => {
        function handleStorageChange() {
            const awareness = provider?.awareness
            if (!awareness) return

            const currentState = provider?.awareness.getLocalState()
            if (!currentState?.user) {
                provider?.awareness.setLocalStateField("user", { name, color })
            }
        }

        handleStorageChange()
    }, [provider])
}
