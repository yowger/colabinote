import { HocuspocusContext } from "../../../contexts/hocuspocusContext"
import { useRoom } from "../hooks/useRooms"

export function HocuspocusProviderWrapper({
    children,
    roomName,
}: {
    children: React.ReactNode
    roomName: string | null
}) {
    const { provider, doc } = useRoom(roomName)

    return (
        <HocuspocusContext.Provider value={{ provider, doc }}>
            {children}
        </HocuspocusContext.Provider>
    )
}
