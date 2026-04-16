import type { HocuspocusProvider } from "@hocuspocus/provider"
import { createContext, type RefObject } from "react"
import * as Y from "yjs"

export const HocuspocusContext = createContext<
    | {
          provider: RefObject<HocuspocusProvider | null>
          doc: RefObject<Y.Doc | null>
      }
    | undefined
>(undefined)
