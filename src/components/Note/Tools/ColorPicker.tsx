import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { ChevronDownIcon } from "lucide-react"

import type { NOTE_COLORS, NoteColor } from "../constants/noteColors"

export default function ColorPicker({
    colors,
    onSelect,
}: {
    colors: typeof NOTE_COLORS
    onSelect: (color: NoteColor) => void
}) {
    return (
        <Popover className="relative">
            <PopoverButton className="p-2 rounded hover:bg-gray-200">
                <ChevronDownIcon className="w-4 h-4" />
            </PopoverButton>

            <PopoverPanel anchor="bottom" className="mt-2 z-10">
                <div className="flex gap-2 p-2 bg-white rounded shadow-lg border">
                    {colors.map(({ name, bg }) => (
                        <button
                            key={name}
                            className="w-6 h-6 rounded-full ring-1 ring-black/10 hover:scale-110 transition"
                            style={{
                                backgroundColor: bg.match(/bg-(\w+)-\d+/)?.[1],
                            }}
                            onClick={() => onSelect(name)}
                        />
                    ))}
                </div>
            </PopoverPanel>
        </Popover>
    )
}
