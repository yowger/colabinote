import { usePresence } from "../../../hooks/usePresence"

type BoardCanvasProps = {
    width: number
    height: number
    children: React.ReactNode
}

export function BoardCanvas({ width, height, children }: BoardCanvasProps) {
    const { updateCursor } = usePresence()

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        updateCursor(x, y)
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            className="relative bg-[url('/images/bg.png')] bg-repeat"
            style={{ width, height }}
        >
            {children}
        </div>
    )
}
