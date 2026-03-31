import clsx from "clsx"
import type { LucideIcon } from "lucide-react"

type MenuIconButtonProps = {
    icon: LucideIcon
    className?: string
    onClick?: () => void
}

export default function MenuIconButton({
    icon: Icon,
    className,
    onClick,
}: MenuIconButtonProps) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "p-1 rounded hover:bg-neutral-700 transition flex items-center justify-center",
                className,
            )}
        >
            <Icon className="w-4 h-4" />
        </button>
    )
}
