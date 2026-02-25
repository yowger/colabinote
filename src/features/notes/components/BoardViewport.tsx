import clsx from "clsx"
import { forwardRef } from "react"

type BoardViewportProps = React.HTMLAttributes<HTMLDivElement> & {
    isPanning: boolean
}

export const BoardViewport = forwardRef<HTMLDivElement, BoardViewportProps>(
    function BoardViewport({ isPanning, className, children, ...rest }, ref) {
        return (
            <div
                ref={ref}
                {...rest}
                className={clsx(
                    "flex-1 overflow-hidden bg-neutral-900 touch-none",
                    isPanning ? "cursor-grabbing" : "cursor-grab",
                    className,
                )}
            >
                {children}
            </div>
        )
    },
)
