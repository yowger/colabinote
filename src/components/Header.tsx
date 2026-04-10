import {
    Menu as HeadlessMenu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react"
import { Menu as MenuIcon } from "lucide-react"

export default function Header() {
    return (
        <div className="flex bg-slate-100 border-slate-200 border-b h-16 shrink-0 px-4 py-2 items-center">
            <button className="hover:bg-slate-200 p-4 rounded-full transition cursor-pointer">
                <MenuIcon size={20} />
            </button>

            <h2 className="px-4 py-4 text-xl font-medium tracking-widest font-manrope uppercase">
                ColabiNote
            </h2>

            <div className="ml-auto flex items-center gap-4">
                <HeadlessMenu as="div" className="relative">
                    <MenuButton className="w-10 h-10 rounded-full bg-slate-300 hover:bg-slate-400 transition cursor-pointer" />

                    <MenuItems
                        anchor="bottom end"
                        className="
                            mt-2 w-40
                            rounded-xl bg-white shadow-md border border-slate-200
                            focus:outline-none z-50
                        "
                    >
                        <div className="py-1 text-sm">
                            <MenuItem>
                                {() => (
                                    <button
                                        onClick={() => {}}
                                        className={`
                                            w-full text-left px-4 py-2 rounded-md hover:bg-slate-100 transition`}
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
