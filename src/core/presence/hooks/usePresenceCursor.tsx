import { useEffect, useRef } from "react"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"

export function usePresenceCursor() {
    const { provider } = useHocuspocusContext()

    const frame = useRef<number | null>(null)
    const idleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const resetIdle = () => {
        const awareness = provider?.awareness
        if (!awareness) return

        const current = awareness.getLocalState()

        if (current?.status !== "active") {
            awareness.setLocalStateField("status", "active")
        }

        if (idleTimeout.current) {
            clearTimeout(idleTimeout.current)
        }

        idleTimeout.current = setTimeout(() => {
            awareness.setLocalStateField("status", "idle")
        }, 5000)
    }

    const updateCursor = (x: number, y: number) => {
        const awareness = provider?.awareness
        if (!awareness || frame.current !== null) return

        frame.current = requestAnimationFrame(() => {
            const current = awareness.getLocalState()

            if (current?.cursor?.x !== x || current?.cursor?.y !== y) {
                awareness.setLocalStateField("cursor", { x, y })
            }

            frame.current = null
        })

        resetIdle()
    }

    useEffect(() => {
        const awareness = provider?.awareness
        if (!awareness) return

        const handleVisibility = () => {
            if (document.hidden) {
                const current = awareness.getLocalState()

                if (current?.cursor !== null) {
                    awareness.setLocalStateField("cursor", null)
                }

                if (current?.status !== "idle") {
                    awareness.setLocalStateField("status", "idle")
                }
            }
        }

        document.addEventListener("visibilitychange", handleVisibility)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility)
        }
    }, [provider])

    useEffect(() => {
        return () => {
            if (frame.current) {
                cancelAnimationFrame(frame.current)
            }

            if (idleTimeout.current) {
                clearTimeout(idleTimeout.current)
            }
        }
    }, [])

    return { updateCursor }
}
