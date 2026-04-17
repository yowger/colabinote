import type { HocuspocusProvider } from "@hocuspocus/provider"
import { createContext } from "react"
import * as Y from "yjs"

export const HocuspocusContext = createContext<{
    provider: HocuspocusProvider | null
    doc: Y.Doc | null
}>({ provider: null, doc: null })
