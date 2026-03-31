import NotesBoard from "../board/NotesBoard"
import Header from "../../components/Header"
import BoardsSidebar from "../../features/boards/components/BoardsSidebar"

export default function AppLayout() {
    return (
        <div className="flex flex-col h-screen">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <BoardsSidebar />

                <NotesBoard />
            </div>
        </div>
    )
}
