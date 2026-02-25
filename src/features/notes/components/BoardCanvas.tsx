type BoardCanvasProps = {
    width: number
    height: number
    children: React.ReactNode
}

export function BoardCanvas({ width, height, children }: BoardCanvasProps) {
    return (
        <div className="relative bg-red-900" style={{ width, height }}>
            {children}
        </div>
    )
}
