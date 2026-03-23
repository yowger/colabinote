export type AwarenessUser = {
    name: string
    color: string
}

export type AwarenessCursor = {
    x: number
    y: number
} | null

export type AwarenessStatus = "active" | "idle"

export type AwarenessState = {
    user: AwarenessUser
    cursor: AwarenessCursor
    status: AwarenessStatus
}
