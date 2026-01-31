type BackgroundProps = {
    gridSize?: number
    gridColor?: string
    lineWidth?: number
    backgroundColor?: string
}

export default function Background({
    gridSize = 32,
    gridColor = "#80808012",
    lineWidth = 1,
    backgroundColor = "#ffffff",
}: BackgroundProps) {
    const backgroundStyle = {
        backgroundColor,
        backgroundImage: `linear-gradient(to right, ${gridColor} ${lineWidth}px, transparent ${lineWidth}px),
                      linear-gradient(to bottom, ${gridColor} ${lineWidth}px, transparent ${lineWidth}px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
    }

    return (
        <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={backgroundStyle}
        />
    )
}
