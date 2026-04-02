import type { PresenceState } from "../../../core/presence/types/presence"
import { Cursor } from "./Cursor"

type CursorUser = PresenceState & { clientId: number }

type CursorsLayerProps = {
    users: CursorUser[]
}

export default function CursorsLayer({ users }: CursorsLayerProps) {
    return (
        <>
            {users.map((user) => {
                if (!user.cursor || !user.user) return null

                return (
                    <Cursor
                        key={user.clientId}
                        x={user.cursor.x}
                        y={user.cursor.y}
                        color={user.user.color}
                        name={user.user.name}
                        status={user.status}
                    />
                )
            })}
        </>
    )
}
