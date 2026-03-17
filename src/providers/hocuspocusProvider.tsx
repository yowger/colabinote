import { useEffect, useState } from "react"
import { HocuspocusContext } from "../contexts/hocuspocusContext"
import { useHocuspocusProvider } from "../hooks/useHocuspocus"
import type { HocuspocusProvider } from "@hocuspocus/provider"

export function HocuspocusProviderWrapper({
    children,
    roomName,
    url,
}: {
    children: React.ReactNode
    roomName: string
    url: string
}) {
    const hocusfocusProvider = useHocuspocusProvider(url, roomName)

    const [provider, setProvider] = useState<HocuspocusProvider | null>(
        hocusfocusProvider.current,
    )

    useEffect(() => {
        setProvider(hocusfocusProvider.current)
    }, [hocusfocusProvider])

    return (
        <HocuspocusContext.Provider value={{ provider }}>
            {children}
        </HocuspocusContext.Provider>
    )
}
