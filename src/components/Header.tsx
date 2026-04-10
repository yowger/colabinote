import { Menu } from "lucide-react"

export default function Header() {
    return (
        <div className="flex bg-slate-100 border-slate-200 border-b h-16 shrink-0 px-4 py-2 items-center">
            <button className="hover:bg-slate-200 p-4 rounded-full transition cursor-pointer">
                <Menu size={20} />
            </button>

            <h2 className="px-4 py-4 text-xl font-medium tracking-widest font-manrope uppercase ">
                ColabiNote
            </h2>

            <div className="ml-auto flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
            </div>
        </div>
    )
}
