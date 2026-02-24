import { useEffect, useState, useCallback, useRef } from "react"

type UseMiniMapArgs = {
    viewportRef: React.RefObject<HTMLDivElement | null>
    boardWidth: number
    boardHeight: number
    miniWidth: number
    miniHeight: number
}

export function useMiniMap({
    viewportRef,
    boardWidth,
    boardHeight,
    miniWidth,
    miniHeight,
}: UseMiniMapArgs) {
    const scaleX = miniWidth / boardWidth
    const scaleY = miniHeight / boardHeight

    const [viewportRect, setViewportRect] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    })

    const requestAnimationFrameId = useRef<number | null>(null)

    useEffect(() => {
        const viewport = viewportRef.current
        if (!viewport) return

        const update = () => {
            requestAnimationFrameId.current = null

            setViewportRect({
                left: viewport.scrollLeft * scaleX,
                top: viewport.scrollTop * scaleY,
                width: viewport.clientWidth * scaleX,
                height: viewport.clientHeight * scaleY,
            })
        }

        const onScroll = () => {
            if (requestAnimationFrameId.current !== null) return

            requestAnimationFrameId.current = requestAnimationFrame(update)
        }

        update()
        viewport.addEventListener("scroll", onScroll, { passive: true })

        return () => {
            viewport.removeEventListener("scroll", onScroll)
            if (requestAnimationFrameId.current !== null) {
                cancelAnimationFrame(requestAnimationFrameId.current)
            }
        }
    }, [viewportRef, scaleX, scaleY])

    const onMiniMapClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const viewport = viewportRef.current
            if (!viewport) return

            const rect = e.currentTarget.getBoundingClientRect()
            const clickX = e.clientX - rect.left
            const clickY = e.clientY - rect.top

            viewport.scrollLeft = clickX / scaleX - viewport.clientWidth / 2
            viewport.scrollTop = clickY / scaleY - viewport.clientHeight / 2
        },
        [viewportRef, scaleX, scaleY],
    )

    return {
        scaleX,
        scaleY,
        viewportRect,
        onMiniMapClick,
    }
}
