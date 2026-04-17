import clsx from "clsx"

import { useMiniMap } from "../../features/minimap/hooks/useMiniMap"

import { type NoteColor } from "../../core/notes/constants/noteColors"

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
            className={clsx("border border-slate-200 rounded-xs", className)}
            style={{ width, height }}
        >
            {items.map((item, i) => {
                return (
                    <div
                        key={i}
                        className={clsx(
                            "absolute rounded-sm border border-slate-400",
                        )}
                        style={{
                            left: item.x * scaleX,
                            top: item.y * scaleY,
                            width: item.width * scaleX,
                            height: item.height * scaleY,
                        }}
                    />
                )
            })}

            <div
                className="absolute border border-yellow-400 pointer-events-none"
                style={viewportRect}
            />
        </div>
    )
}
