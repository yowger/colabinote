import { HocuspocusContext } from "../../../contexts/hocuspocusContext"
import { useRoom } from "../hooks/useRooms"

export function HocuspocusProviderWrapper({
    children,
    roomName,
}: {
    children: React.ReactNode
    roomName: string | null
}) {
    const { providerRef, docRef } = useRoom(roomName)

    return (
        <HocuspocusContext.Provider
            value={{ provider: providerRef, doc: docRef }}
        >
            {children}
        </HocuspocusContext.Provider>
    )
}
