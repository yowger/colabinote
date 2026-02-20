import { Rnd } from "react-rnd"
import NotesBoard from "./components/Note/NotesBoard"

export default function App() {
    return (
        <div className="">
            <NotesBoard />

            <Rnd
                default={{
                    x: 0,
                    y: 0,
                    width: 150,
                    height: 150,
                }}
                minWidth={150}
                minHeight={150}
                bounds="window"
            >
                <div className="w-full h-full bg-blue-900">Rnd</div>
            </Rnd>
        </div>
    )
}
