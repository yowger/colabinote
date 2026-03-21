import { useEffect, useRef } from "react"
import { useHocuspocusContext } from "./useHocuspocusContext"

export function usePresence() {
    const { provider } = useHocuspocusContext()
    const frame = useRef<number | null>(null)

    useEffect(() => {
        if (!provider || !provider.awareness) return

        provider.awareness.setLocalState({
            user: {
                name: "Roger",
                color: "#ff5733",
            },
            cursor: null,
        })
    }, [provider])

    const updateCursor = (x: number, y: number) => {
        if (!provider || frame.current) return

        frame.current = requestAnimationFrame(() => {
            if (!provider.awareness) return

            provider.awareness.setLocalStateField("cursor", { x, y })
            frame.current = null
        })
    }

    return { updateCursor }
}
