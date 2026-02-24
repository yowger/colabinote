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
    const isDragging = useRef(false)

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
            if (requestAnimationFrameId.current)
                cancelAnimationFrame(requestAnimationFrameId.current)
        }
    }, [viewportRef, scaleX, scaleY])

    const panToMiniMapPoint = useCallback(
        (clientX: number, clientY: number, target: HTMLDivElement) => {
            const viewport = viewportRef.current
            if (!viewport) return

            const rect = target.getBoundingClientRect()
            const x = clientX - rect.left
            const y = clientY - rect.top

            viewport.scrollLeft = x / scaleX - viewport.clientWidth / 2
            viewport.scrollTop = y / scaleY - viewport.clientHeight / 2
        },
        [viewportRef, scaleX, scaleY],
    )

    const onPointerDown = useCallback(
        (pointerEvent: React.PointerEvent<HTMLDivElement>) => {
            isDragging.current = true
            pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId)
            panToMiniMapPoint(
                pointerEvent.clientX,
                pointerEvent.clientY,
                pointerEvent.currentTarget,
            )
        },
        [panToMiniMapPoint],
    )

    const onPointerMove = useCallback(
        (pointerEvent: React.PointerEvent<HTMLDivElement>) => {
            if (!isDragging.current) return
            panToMiniMapPoint(
                pointerEvent.clientX,
                pointerEvent.clientY,
                pointerEvent.currentTarget,
            )
        },
        [panToMiniMapPoint],
    )

    const onPointerUp = useCallback(
        (pointerEvent: React.PointerEvent<HTMLDivElement>) => {
            isDragging.current = false
            pointerEvent.currentTarget.releasePointerCapture(
                pointerEvent.pointerId,
            )
        },
        [],
    )

    return {
        scaleX,
        scaleY,
        viewportRect,
        miniMapHandlers: {
            onPointerDown,
            onPointerMove,
            onPointerUp,
        },
    }
}
