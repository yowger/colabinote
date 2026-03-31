export type AwarenessUser = {
    name: string
    color: string
}

export type AwarenessCursor = {
    x: number
    y: number
} | null

export type AwarenessStatus = "active" | "idle"

export type AwarenessInteraction = "idle" | "hovering" | "dragging" | "resizing"

export type AwarenessState = {
    user: AwarenessUser
    cursor: AwarenessCursor
    status: AwarenessStatus
    activeNoteId?: string | null
    interaction?: AwarenessInteraction
}
