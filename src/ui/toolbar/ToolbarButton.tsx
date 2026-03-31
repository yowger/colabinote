import clsx from "clsx"
import type { LucideIcon } from "lucide-react"
import type { ButtonHTMLAttributes } from "react"

type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: LucideIcon
    className?: string
}

export default function ToolbarButton({
    icon: Icon,
    className,
    ...props
}: ToolbarButtonProps) {
    return (
        <button
            {...props}
            className={clsx(
                "flex items-center justify-center p-1.5 rounded transition",
                "hover:bg-neutral-700",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                className,
            )}
        >
            <Icon className="w-4 h-4" />
        </button>
    )
}
