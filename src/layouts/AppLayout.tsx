import NotesBoard from "../features/notes/components/NotesBoard"
import RoomsSidebar from "../features/rooms/components/Sidebar"
import Header from "../components/Header"

export default function AppLayout() {
    return (
        <div className="flex flex-col h-screen">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <RoomsSidebar />

                <NotesBoard />
            </div>
        </div>
    )
}
