import { useHocuspocusContext } from "../../../hooks/useHocuspocusContext"
import type { AwarenessInteraction } from "../types/awareness"

export function usePresenceActions() {
    const { provider } = useHocuspocusContext()

    const setActiveNoteId = (noteId: string | null) => {
        provider?.awareness?.setLocalStateField("activeNoteId", noteId)
    }

    const setInteraction = (interaction: AwarenessInteraction) => {
        provider?.awareness?.setLocalStateField("interaction", interaction)
    }

    return { setActiveNoteId, setInteraction }
}
