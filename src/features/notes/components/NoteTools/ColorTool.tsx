import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { PaletteIcon } from "lucide-react"

import {
    NOTE_COLORS,
    type NoteColor,
} from "../../../../components/Note/types/colors"
import { COLOR_BUTTON_STYLES } from "../../../../components/Note/styles/noteColorStyles"
import { useNoteActions } from "../../hooks/useNoteActions"

type ColorToolProps = {
    noteId: string
}

export default function ColorTool({ noteId }: ColorToolProps) {
    const { changeColor } = useNoteActions()

    const handleSelectColor = (color: NoteColor) => {
        changeColor(noteId, color)
    }

    return (
        <Popover>
            <PopoverButton className="p-2 rounded hover:bg-gray-200">
                <PaletteIcon className="w-4 h-4" />
            </PopoverButton>

            <PopoverPanel
                data-no-pan="true"
                anchor="bottom"
                className="mt-2 z-10"
            >
                <div className="flex gap-2 p-2 bg-white rounded shadow-lg border">
                    {NOTE_COLORS.map((color) => (
                        <button
                            key={color}
                            className={`w-6 h-6 rounded-full ring-1 ring-black/10 hover:scale-110 transition ${COLOR_BUTTON_STYLES[color]}`}
                            onClick={(event) => {
                                event.stopPropagation()

                                handleSelectColor(color)
                            }}
                        />
                    ))}
                </div>
            </PopoverPanel>
        </Popover>
    )
}
