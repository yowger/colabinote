import clsx from "clsx"
import type { LucideIcon } from "lucide-react"

type ToolbarButtonProps = {
    icon: LucideIcon
    className?: string
}

export default function ToolbarButton({
    icon: Icon,
    className,
}: ToolbarButtonProps) {
    return (
        <button
            className={clsx(
                "flex items-center justify-center p-1.5 rounded hover:bg-neutral-700 transition",
                className,
            )}
        >
            <Icon className="w-4 h-4" />
        </button>
    )
}
