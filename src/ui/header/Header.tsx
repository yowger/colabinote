import {
    Menu as HeadlessMenu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react"
import { Menu as MenuIcon } from "lucide-react"

export default function Header() {
    return (
        <div className="flex bg-bg-soft border-b border-border h-16 shrink-0 px-4 py-2 items-center">
            <button className="hover:bg-bg p-3 rounded-lg transition cursor-pointer">
                <MenuIcon size={20} className="text-text-muted" />
            </button>

            <h2 className="px-4 text-xl font-medium tracking-widest font-manrope uppercase text-text">
                ColabiNote
            </h2>

            <div className="ml-auto flex items-center gap-4">
                <HeadlessMenu as="div" className="relative">
                    <MenuButton className="w-10 h-10 rounded-full bg-bg border border-border hover:bg-bg transition cursor-pointer" />

                    <MenuItems
                        anchor="bottom end"
                        className="
                            mt-2 w-44
                            rounded-xl bg-bg-soft shadow-md border border-border
                            focus:outline-none z-50
                        "
                    >
                        <div className="px-4 py-3 border-b border-border">
                            <div className="text-sm font-medium text-text">
                                Roger Pantil
                            </div>
                            <div className="text-xs text-text-muted truncate">
                                roger@gmail.com
                            </div>
                        </div>

                        <div className="py-1 text-sm text-text">
                            <MenuItem>
                                {() => (
                                    <button
                                        onClick={() => {}}
                                        className="
                                            w-full text-left px-4 py-2 rounded-md
                                            hover:bg-bg
                                            transition
                                        "
                                    >
                                        Logout
                                    </button>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </HeadlessMenu>
            </div>
        </div>
    )
}
