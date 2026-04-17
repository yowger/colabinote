import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { PaletteIcon } from "lucide-react"
import clsx from "clsx"

import { useNoteUiStateStore } from "../../features/interactions/stores/useNoteUiStateStore"
import PopoverContent from "./PopoverContent"
import ToolbarButton from "./ToolbarButton"
import { DEFAULT_NOTE_COLOR } from "../../core/notes/constants/defaults"
import { useNoteActions } from "../../core/yjs/notes/useNoteActions"
import { useSingleNoteYjs } from "../../core/yjs/notes/useSingleNoteYjs"
import { noteColorStyles } from "../../core/notes/styles/noteColorStyles"

import type { NoteAnchorPosition } from "../../core/notes/types/notesUi"
import type { NoteColor } from "../../core/notes/styles/noteColorStyles"

type ColorToolProps = {
    position?: NoteAnchorPosition
}

export default function ColorTool({ position = "right" }: ColorToolProps) {
    const noteId = useNoteUiStateStore((store) => store.selectedNoteId)
    const { updateNote } = useNoteActions()
    const note = useSingleNoteYjs(noteId || "")
    const selectedNoteColor = note?.color ?? DEFAULT_NOTE_COLOR

    const handleSelectColor = (color: NoteColor) => {
        if (!noteId) return
        updateNote(noteId, { color })
    }

    const colors = Object.keys(noteColorStyles) as NoteColor[]

    return (
        <Popover>
            <PopoverButton as="div">
                <ToolbarButton icon={PaletteIcon} />
            </PopoverButton>

            <PopoverPanel
                anchor={{ to: position, gap: 12 }}
                data-no-pan="true"
                className="z-50 bg-bg-soft p-1 rounded-md shadow-sm backdrop-blur"
                onPointerDown={(event) => event.stopPropagation()}
            >
                <PopoverContent className="bg-transparent border-0 shadow-none">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => handleSelectColor(color)}
                            className={clsx(
                                "w-5 h-5 rounded-xs hover:scale-110 transition",
                                noteColorStyles[color].button,
                                selectedNoteColor === color &&
                                    "ring-1 ring-offset-1 ring-offset-bg",
                            )}
                        />
                    ))}
                </PopoverContent>
            </PopoverPanel>
        </Popover>
    )
}
