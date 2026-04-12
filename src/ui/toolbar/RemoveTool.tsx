import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { CheckIcon, Trash2Icon, XIcon } from "lucide-react"

import { useNoteUiStateStore } from "../../features/interactions/stores/useNoteUiStateStore"
import PopoverContent from "./PopoverContent"
import ToolbarButton from "./ToolbarButton"
import MenuIconButton from "./MenuIconButton"
import { useNoteActions } from "../../core/yjs/notes/useNoteActions"

import type { NoteAnchorPosition } from "../../core/notes/types/notesUi"

type RemoveToolProps = {
    position?: NoteAnchorPosition
}

export default function RemoveTool({ position = "right" }: RemoveToolProps) {
    const noteId = useNoteUiStateStore((store) => store.selectedNoteId)
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
                        anchor={{ to: position, gap: 12 }}
                        data-no-pan="true"
                        className="z-50 bg-bg-soft p-1 rounded-md shadow-sm backdrop-blur "
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <PopoverContent className="bg-transparent border-0 shadow-none">
                            <div className="flex items-center px-1">
                                <span className="text-sm mr-5 text-text">
                                    Delete note?
                                </span>

                                <MenuIconButton
                                    icon={CheckIcon}
                                    onClick={() => {
                                        handleRemoveNote()
                                        close()
                                    }}
                                    className="mr-1 text-text-muted"
                                />

                                <MenuIconButton
                                    icon={XIcon}
                                    onClick={() => close()}
                                />
                            </div>
                        </PopoverContent>
                    </PopoverPanel>
                </>
            )}
        </Popover>
    )
}
