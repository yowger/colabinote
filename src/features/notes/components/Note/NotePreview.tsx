import clsx from "clsx"

type NoteDragPreviewProps = {
    width: number
    height: number
    color?: string
}

export default function NoteDragPreview({
    width,
    height,
    color,
}: NoteDragPreviewProps) {
    return (
        <div
            style={{
                width,
                height,
                background: color ?? "yellow",
            }}
            className={clsx(
                "pointer-events-none",
                "rounded-md shadow-xl",
                "opacity-90 scale-[1.02]",
                "flex flex-col overflow-hidden",
            )}
        >
            <div className="p-2 bg-black/20 text-xs font-medium">Note</div>

            <div className="flex-1 bg-black/10" />
        </div>
    )
}
