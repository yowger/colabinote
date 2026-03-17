import AppLayout from "./layouts/AppLayout"
import { HocuspocusProviderWrapper } from "./providers/hocuspocusProvider"

export default function App() {
    const url = "ws://localhost:1234"
    const roomName = "test"

    return (
        <HocuspocusProviderWrapper url={url} roomName={roomName}>
            <AppLayout />
        </HocuspocusProviderWrapper>
    )
}
