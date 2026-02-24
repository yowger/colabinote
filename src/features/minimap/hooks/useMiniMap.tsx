import { useEffect, useState, useCallback } from "react"

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

    useEffect(() => {
        const viewport = viewportRef.current
        if (!viewport) return

        const update = () => {
            setViewportRect({
                left: viewport.scrollLeft * scaleX,
                top: viewport.scrollTop * scaleY,
                width: viewport.clientWidth * scaleX,
                height: viewport.clientHeight * scaleY,
            })
        }

        update()
        viewport.addEventListener("scroll", update)

        return () => {
            viewport.removeEventListener("scroll", update)
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
