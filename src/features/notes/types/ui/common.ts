import type { ReactNode } from "react"

export type PopoverProps = {
    open: boolean
    onOpenChange(open: boolean): void
    children: ReactNode
}
