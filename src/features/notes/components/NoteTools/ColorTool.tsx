import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { PaletteIcon } from "lucide-react"
import clsx from "clsx"

import { NOTE_COLORS } from "../../../../components/Note/types/colors"
import { COLOR_BUTTON_STYLES } from "../../../../components/Note/styles/noteColorStyles"
import { useNotesStore } from "../../stores/useNotesStore"
import PopoverContent from "./PopoverContent"
import ToolbarButton from "./ToolbarButton"
import { DEFAULT_NOTE_COLOR } from "../constants/defaults"
import { useNoteActions } from "../../hooks/useNoteActions"
import { useSingleNoteYjs } from "../../hooks/useSingleNoteYjs"

import { type NoteColor } from "../../../../components/Note/types/colors"
import type { NoteAnchorPosition } from "../../types/ui/notes"

type ColorToolProps = {
    position?: NoteAnchorPosition
}

export default function ColorTool({ position = "right" }: ColorToolProps) {
    const noteId = useNotesStore((store) => store.selectedNoteId)
    const { updateNote } = useNoteActions()
    const note = useSingleNoteYjs(noteId || "")
    const selectedNoteColor = note?.color ?? DEFAULT_NOTE_COLOR

    const handleSelectColor = (color: NoteColor) => {
        if (!noteId) return

        updateNote(noteId, { color })
    }

    return (
        <Popover>
            <PopoverButton as="div">
                <ToolbarButton icon={PaletteIcon} />
            </PopoverButton>

            <PopoverPanel
                anchor={{ to: position, gap: 10 }}
                data-no-pan="true"
                className="z-50"
                onPointerDown={(event) => event.stopPropagation()}
            >
                <PopoverContent>
                    {NOTE_COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => handleSelectColor(color)}
                            className={clsx(
                                "flex items-center justify-center w-5 h-5 rounded-xs ring-black/10 hover:scale-105 transition-transform",
                                COLOR_BUTTON_STYLES[color],
                                selectedNoteColor === color &&
                                    "ring-2 ring-white ring-offset-1",
                            )}
                        />
                    ))}
                </PopoverContent>
            </PopoverPanel>
        </Popover>
    )
}
