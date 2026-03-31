import { forwardRef } from "react"

import { usePresenceCursor } from "../../core/presence/hooks/usePresenceCursor"

type BoardCanvasProps = {
    width: number
    height: number
    children: React.ReactNode
}

export const BoardCanvas = forwardRef<HTMLDivElement, BoardCanvasProps>(
    ({ width, height, children }, ref) => {
        const { updateCursor } = usePresenceCursor()

        const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect()

            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            updateCursor(x, y)
        }

        return (
            <div
                ref={ref}
                onPointerMove={handlePointerMove}
                className="relative bg-[url('/images/bg.png')] bg-repeat"
                style={{ width, height }}
            >
                {children}
            </div>
        )
    },
)
