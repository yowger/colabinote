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
                data-board-viewport="true"
                {...rest}
                className={clsx(
                    "flex-1 overflow-hidden",
                    isPanning ? "cursor-grabbing" : "cursor-grab",
                    className,
                )}
            >
                {children}
            </div>
        )
    },
)
