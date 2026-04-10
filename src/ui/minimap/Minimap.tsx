import clsx from "clsx"
import { useMiniMap } from "../../features/minimap/hooks/useMiniMap"
import type { NoteColor } from "../../components/Note/constants/noteColors"

export interface MiniMapItem {
    x: number
    y: number
    width: number
    height: number
    color: NoteColor
}

type MiniMapProps = {
    className?: string
    viewportRef: React.RefObject<HTMLDivElement | null>
    boardWidth: number
    boardHeight: number
    width: number
    height: number
    items: MiniMapItem[]
}

const MINI_MAP_COLOR: Record<NoteColor, string> = {
    white: "bg-slate-400",
    yellow: "bg-yellow-400",
    blue: "bg-blue-400",
    green: "bg-green-400",
    pink: "bg-pink-400",
    purple: "bg-purple-400",
}

export function MiniMap({
    className,
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
            className={clsx(
                "bg-slate-200 border border-slate-300 rounded-md",
                className,
            )}
            style={{ width, height }}
        >
            {items.map((item, i) => (
                <div
                    key={i}
                    className={clsx(
                        "absolute",
                        MINI_MAP_COLOR[item.color as NoteColor],
                    )}
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
