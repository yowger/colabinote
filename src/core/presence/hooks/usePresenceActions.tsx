import { useHocuspocusContext } from "../../hocuspocus/hooks/useHocuspocusContext"
import type { PresenceAction } from "../types/presence"

export function usePresenceActions() {
    const { providerRef: provider } = useHocuspocusContext()

    const setAction = (action: PresenceAction) => {
        provider?.awareness?.setLocalStateField("action", action)
    }

    const clearAction = () => {
        provider?.awareness?.setLocalStateField("action", null)
    }

    return { setAction, clearAction }
}
