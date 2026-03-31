import { useEffect, useRef } from "react"

import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"

export function usePresenceCursor() {
    const { provider } = useHocuspocusContext()

    const frame = useRef<number | null>(null)
    const idleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const resetIdle = () => {
        if (!provider?.awareness) return

        provider.awareness.setLocalStateField("status", "active")

        if (idleTimeout.current) {
            clearTimeout(idleTimeout.current)
        }

        idleTimeout.current = setTimeout(() => {
            provider.awareness?.setLocalStateField("status", "idle")
        }, 5000)
    }

    const updateCursor = (x: number, y: number) => {
        if (!provider?.awareness || frame.current !== null) return

        frame.current = requestAnimationFrame(() => {
            provider.awareness?.setLocalStateField("cursor", { x, y })
            frame.current = null
        })

        resetIdle()
    }

    useEffect(() => {
        if (!provider?.awareness) return

        const handleVisibility = () => {
            if (document.hidden) {
                provider.awareness?.setLocalStateField("cursor", null)
                provider.awareness?.setLocalStateField("status", "idle")
            }
        }

        document.addEventListener("visibilitychange", handleVisibility)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility)
        }
    }, [provider])

    useEffect(() => {
        return () => {
            if (frame.current) cancelAnimationFrame(frame.current)
            if (idleTimeout.current) clearTimeout(idleTimeout.current)
        }
    }, [])

    return { updateCursor }
}
