import { useEffect, useRef } from "react"
import { useHocuspocusContext } from "../../hocuspocus/hooks/useHocuspocusContext"

function generateColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

const name = Date.now().toString()

export function usePresenceUser() {
    const { provider } = useHocuspocusContext()

    const userRef = useRef({
        id: crypto.randomUUID(),
        name: name,
        color: generateColor(),
    })

    useEffect(() => {
        const awareness = provider?.awareness
        if (!awareness) return

        const currentState = awareness.getLocalState()

        if (!currentState?.user) {
            awareness.setLocalStateField("user", userRef.current)
        }

        if (!currentState?.cursor) {
            awareness.setLocalStateField("cursor", null)
        }

        if (!currentState?.status) {
            awareness.setLocalStateField("status", "active")
        }

        if (!currentState?.action) {
            awareness.setLocalStateField("action", null)
        }
    }, [provider])
}
