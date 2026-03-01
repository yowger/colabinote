import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { Trash2Icon } from "lucide-react"
import { useNoteActions } from "../../hooks/useNoteActions"

type DeleteToolProps = {
    noteId: string
}

export default function RemoveTool({ noteId }: DeleteToolProps) {
    const { removeNote } = useNoteActions()

    const handleRemoveNote = (noteId: string) => {
        removeNote(noteId)
    }

    return (
        <Popover>
            {({ close }) => (
                <>
                    <PopoverButton className="p-2 rounded hover:bg-gray-200">
                        <Trash2Icon className="w-4 h-4" />
                    </PopoverButton>

                    <PopoverPanel
                        data-no-pan="true"
                        anchor="bottom"
                        className="mt-2 z-20"
                    >
                        <div className="bg-white p-2 rounded shadow-lg border w-40">
                            <p className="text-sm mb-3">Delete this note?</p>

                            <div className="flex justify-end gap-2">
                                <button
                                    className="text-xs px-2 py-1 rounded bg-gray-100"
                                    onClick={() => close()}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="text-xs px-2 py-1 rounded bg-red-500 text-white"
                                    onClick={() => {
                                        handleRemoveNote(noteId)

                                        close()
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </PopoverPanel>
                </>
            )}
        </Popover>
    )
}
