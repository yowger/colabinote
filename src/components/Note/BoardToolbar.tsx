import { useNotesStore } from "../../hooks/useNotesStore"

export default function BoardToolbar() {
    const { addNote } = useNotesStore()

    return (
        <div>
            <button
                onClick={() =>
                    addNote({
                        id: Date.now().toLocaleString(),
                        x: 20,
                        y: 20,
                        width: 150,
                        height: 150,
                        content: "",
                        updatedAt: Date.now(),
                    })
                }
            >
                Add Note
            </button>
        </div>
    )
}
