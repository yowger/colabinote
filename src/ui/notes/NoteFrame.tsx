import { forwardRef } from "react"
import type { HTMLAttributes } from "react"
import clsx from "clsx"

type NoteFrameProps = HTMLAttributes<HTMLDivElement>

const NoteFrame = forwardRef<HTMLDivElement, NoteFrameProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                {...props}
                className={clsx(
                    "shadow-md rounded-xs flex flex-col h-full w-full",
                    className,
                )}
            >
                {children}
            </div>
        )
    },
)

NoteFrame.displayName = "NoteFrame"

export default NoteFrame
