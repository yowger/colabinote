import { useEffect, useRef, useState } from "react"
import BoardBackground from "./Background"

const BOARD_WIDTH = 2000
const BOARD_HEIGHT = 2000

export default function Board() {
    const viewportRef = useRef<HTMLDivElement | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    const dragStart = useRef<{
        x: number
        y: number
        scrollLeft: number
        scrollTop: number
    }>({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 })

    const startDrag = (mouseEvent: React.MouseEvent<HTMLDivElement>) => {
        const viewport = viewportRef.current
        if (!viewport) return

        setIsDragging(true)
        dragStart.current = {
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
            scrollLeft: viewport.scrollLeft,
            scrollTop: viewport.scrollTop,
        }
    }

    const dragMove = (mouseEvent: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return
        const viewport = viewportRef.current
        if (!viewport) return

        const deltaX = mouseEvent.clientX - dragStart.current.x
        const deltaY = mouseEvent.clientY - dragStart.current.y

        viewport.scrollLeft = dragStart.current.scrollLeft - deltaX
        viewport.scrollTop = dragStart.current.scrollTop - deltaY
    }

    const endDrag = () => setIsDragging(false)
    const enterBoard = () => setIsHovering(true)
    const exitBoard = () => setIsHovering(false)

    const getCursorClass = () => {
        if (isDragging) return "cursor-grabbing"
        if (isHovering) return "cursor-grab"
        return "cursor-default"
    }

    useEffect(() => {
        const centerViewport = () => {
            const viewport = viewportRef.current
            if (!viewport) return
            viewport.scrollLeft = BOARD_WIDTH / 2 - viewport.clientWidth / 2
            viewport.scrollTop = BOARD_HEIGHT / 2 - viewport.clientHeight / 2
        }

        centerViewport()
    }, [])

    return (
        <div
            ref={viewportRef}
            className={`w-screen h-screen overflow-auto ${getCursorClass()}`}
            onMouseDown={startDrag}
            onMouseMove={dragMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onMouseEnter={enterBoard}
            onMouseOut={exitBoard}
        >
            <div
                className="relative bg-gray-50"
                style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
            >
                <BoardBackground gridSize={224} lineWidth={2} />
                <div className="relative  z-10">notes</div>
            </div>
        </div>
    )
}
