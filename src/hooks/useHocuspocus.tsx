import { useEffect, useRef } from "react"
import { HocuspocusProvider } from "@hocuspocus/provider"
import * as Y from "yjs"

export function useHocuspocusProvider(url: string, roomName: string) {
    const providerRef = useRef<HocuspocusProvider | null>(null)

    useEffect(() => {
        const ydoc = new Y.Doc()
        const provider = new HocuspocusProvider({
            url,
            name: roomName,
            document: ydoc,
        })

        provider.on("connect", () => console.log("connected"))
        provider.on("disconnect", () => console.log("disconnected"))

        providerRef.current = provider

        return () => {
            provider.disconnect()
            provider.document.destroy()
        }
    }, [url, roomName])

    return providerRef
}
