import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import AppLayout from "./ui/layouts/AppLayout"
import { HocuspocusProviderWrapper } from "./core/hocuspocus/providers/hocuspocusProvider"
import { queryClient } from "./core/query/queryClient"
import { useRoomStore } from "./core/hocuspocus/store/useRoomStore"

export default function App() {
    // const url = "ws://localhost:1234"
    const roomName = useRoomStore((store) => store.roomId)

    return (
        <QueryClientProvider client={queryClient}>
            <HocuspocusProviderWrapper roomName={roomName}>
                <AppLayout />
            </HocuspocusProviderWrapper>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
