import { useMiniMap } from "../hooks/useMiniMap"

export interface MiniMapItem {
    x: number
    y: number
    width: number
    height: number
}

type MiniMapProps = {
    viewportRef: React.RefObject<HTMLDivElement | null>
    boardWidth: number
    boardHeight: number
    width: number
    height: number
    items: MiniMapItem[]
}

export function MiniMap({
    viewportRef,
    boardWidth,
    boardHeight,
    width,
    height,
    items,
}: MiniMapProps) {
    const { scaleX, scaleY, viewportRect, miniMapHandlers } = useMiniMap({
        viewportRef,
        boardWidth,
        boardHeight,
        miniWidth: width,
        miniHeight: height,
    })

    return (
        <div
            {...miniMapHandlers}
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
                style={viewportRect}
            />
        </div>
    )
}
