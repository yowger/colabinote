import { forwardRef } from "react"
import clsx from "clsx"

type FloatingToolbarProps = {
    style?: React.CSSProperties
    className?: string
    children?: React.ReactNode
}

const FloatingToolbar = forwardRef<HTMLDivElement, FloatingToolbarProps>(
    ({ style, className, children }, ref) => {
        return (
            <div
                data-no-pan="true"
                ref={ref}
                style={style}
                className={clsx(
                    "bg-neutral-200 rounded-sm p-1 z-100",
                    className,
                )}
            >
                {children}
            </div>
        )
    },
)

FloatingToolbar.displayName = "FloatingToolbar"

export default FloatingToolbar
