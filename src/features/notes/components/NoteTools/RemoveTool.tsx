import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { CheckIcon, Trash2Icon, XIcon } from "lucide-react"

import { useNoteActions } from "../../hooks/useNoteActions"
import { useNotesStore } from "../../stores/useNotesStore"
import PopoverContent from "./PopoverContent"
import ToolbarButton from "./ToolbarButton"
import MenuIconButton from "./MenuIconButton"

export default function RemoveTool() {
    const noteId = useNotesStore((store) => store.selectedNoteId)
    const { removeNote } = useNoteActions()

    const handleRemoveNote = () => {
        if (!noteId) return

        removeNote(noteId)
    }

    return (
        <Popover>
            {({ close }) => (
                <>
                    <PopoverButton as="div">
                        <ToolbarButton icon={Trash2Icon} />
                    </PopoverButton>

                    <PopoverPanel
                        anchor={{ to: "right", gap: 10 }}
                        data-no-pan="true"
                        className="z-20"
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <PopoverContent>
                            <span className="text-sm">Delete note?</span>

                            <MenuIconButton
                                icon={CheckIcon}
                                className="text-red-400"
                                onClick={() => {
                                    handleRemoveNote()
                                    close()
                                }}
                            />

                            <MenuIconButton
                                icon={XIcon}
                                className="text-neutral-400"
                                onClick={() => close()}
                            />
                        </PopoverContent>
                    </PopoverPanel>
                </>
            )}
        </Popover>
    )
}
