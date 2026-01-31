import { useRef } from "react"

const BOARD_SIZE = 4000

export default function Board() {
    const viewportRef = useRef<HTMLDivElement | null>(null)

    return (
        <div ref={viewportRef}>
            <div
                className="relative bg-gray-50"
                style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
            >
                notes
            </div>
        </div>
    )
}
