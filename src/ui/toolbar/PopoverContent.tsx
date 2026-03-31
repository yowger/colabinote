import clsx from "clsx"

type PopoverContentProps = {
    className?: string
    children?: React.ReactNode
}

export default function PopoverContent({
    className,
    children,
}: PopoverContentProps) {
    return (
        <div
            className={clsx(
                "flex gap-1.5 p-1.5 bg-neutral-800 text-white rounded-md shadow-lg border border-neutral-700",
                className,
            )}
        >
            {children}
        </div>
    )
}
