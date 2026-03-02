type BoardCanvasProps = {
    width: number
    height: number
    children: React.ReactNode
}

export function BoardCanvas({ width, height, children }: BoardCanvasProps) {
    return (
        <div className="relative bg-[url('/images/bg.png')] bg-repeat" style={{ width, height }}>
            {children}
        </div>
    )
}
