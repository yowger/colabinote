export type PresenceUser = {
    id: string
    name: string
    color: string
}

export type PresenceCursor = {
    x: number
    y: number
} | null

export type PresenceStatus = "active" | "idle"

export type PresenceAction =
    | { type: "dragging-note"; noteId: string }
    | { type: "editing-note"; noteId: string }
    | { type: "panning" }
    | null

export type PresenceState = {
    user: PresenceUser
    cursor: PresenceCursor
    status: PresenceStatus
    action: PresenceAction
}
