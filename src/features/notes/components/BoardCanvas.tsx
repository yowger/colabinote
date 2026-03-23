import { usePresence } from "../../presence/hooks/usePresence"

type BoardCanvasProps = {
    width: number
    height: number
    children: React.ReactNode
}

const name = Date.now().toString()
const color = "#" + Math.floor(Math.random() * 16777215).toString(16)

export function BoardCanvas({ width, height, children }: BoardCanvasProps) {
    const { updateCursor } = usePresence({ name, color })

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
