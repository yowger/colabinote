import { forwardRef } from "react"
import { usePresenceCursor } from "../../presence/hooks/usePresenceCursor"

type BoardCanvasProps = {
    width: number
    height: number
    children: React.ReactNode
}

export const BoardCanvas = forwardRef<HTMLDivElement, BoardCanvasProps>(
    ({ width, height, children }, ref) => {
        const { updateCursor } = usePresenceCursor()

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect()

            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            updateCursor(x, y)
        }

        return (
            <div
                ref={ref} 
                onMouseMove={handleMouseMove}
                className="relative bg-[url('/images/bg.png')] bg-repeat"
                style={{ width, height }}
            >
                {children}
            </div>
        )
    },
)
