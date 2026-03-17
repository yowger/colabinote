import type { HocuspocusProvider } from "@hocuspocus/provider"
import { createContext } from "react"

export const HocuspocusContext = createContext<{
    provider: HocuspocusProvider | null
}>({ provider: null })
