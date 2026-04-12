import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import AppLayout from "./ui/layouts/AppLayout"
import { HocuspocusProviderWrapper } from "./providers/hocuspocusProvider"
import { queryClient } from "./core/api/queryClient"

export default function App() {
    const url = "ws://localhost:1234"
    const roomName = "test"

    return (
        <QueryClientProvider client={queryClient}>
            <HocuspocusProviderWrapper url={url} roomName={roomName}>
                <AppLayout />
            </HocuspocusProviderWrapper>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
