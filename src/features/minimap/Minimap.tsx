import { useEffect, useState } from "react"

export interface MiniMapItem {
    x: number
    y: number
    width: number
    height: number
}

interface MiniMapProps {
    viewportRef: React.RefObject<HTMLDivElement>
    boardWidth: number
    boardHeight: number
    width: number
    height: number
    items?: MiniMapItem[]
}

export function MiniMap({
    viewportRef,
    boardWidth,
    boardHeight,
    width,
    height,
    items = [],
}: MiniMapProps) {
    const scaleX = width / boardWidth
    const scaleY = height / boardHeight

    const [viewportRect, setViewportRect] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })

    useEffect(() => {
        const updateViewport = () => {
            const viewport = viewportRef.current
            if (!viewport) return

            setViewportRect({
                x: viewport.scrollLeft * scaleX,
                y: viewport.scrollTop * scaleY,
                width: viewport.clientWidth * scaleX,
                height: viewport.clientHeight * scaleY,
            })
        }

        updateViewport()

        const viewport = viewportRef.current
        viewport?.addEventListener("scroll", updateViewport)

        return () => {
            viewport?.removeEventListener("scroll", updateViewport)
        }
    }, [viewportRef, scaleX, scaleY])

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const viewport = viewportRef.current
        if (!viewport) return

        const rect = e.currentTarget.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const clickY = e.clientY - rect.top

        viewport.scrollLeft = clickX / scaleX - viewport.clientWidth / 2
        viewport.scrollTop = clickY / scaleY - viewport.clientHeight / 2
    }

    return (
        <div
            onClick={onClick}
            className="relative bg-gray-800 border border-gray-600"
            style={{ width, height }}
        >
            {items.map((item, i) => (
                <div
                    key={i}
                    className="absolute bg-blue-400"
                    style={{
                        left: item.x * scaleX,
                        top: item.y * scaleY,
                        width: item.width * scaleX,
                        height: item.height * scaleY,
                    }}
                />
            ))}

            <div
                className="absolute border border-yellow-400 pointer-events-none"
                style={{
                    left: viewportRect.x,
                    top: viewportRect.y,
                    width: viewportRect.width,
                    height: viewportRect.height,
                }}
            />
        </div>
    )
}
