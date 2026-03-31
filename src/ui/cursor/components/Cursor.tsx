type CursorProps = {
    x: number
    y: number
    color: string
    name: string
    status: "active" | "idle"
}

export function Cursor({ x, y, color, name, status }: CursorProps) {
    const isIdle = status === "idle"

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translate(-2px, -2px)",
                pointerEvents: "none",
                opacity: isIdle ? 0.5 : 1,
                transition: "opacity 0.2s ease",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
            }}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                style={{ display: "block" }}
            >
                <path
                    d="M0 0 L0 24 L6 18 L10 24 L12 23 L8 17 L14 17 Z"
                    fill={color}
                />
            </svg>

            <div
                style={{
                    position: "absolute",
                    top: 16,
                    left: 8,
                    background: color,
                    color: "white",
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                }}
            >
                {name}
            </div>
        </div>
    )
}
