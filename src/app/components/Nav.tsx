import { Roboto } from "next/font/google"
export default function Nav() {
    return (
        <nav className={`w-full p-6 bg-[#121212] shadow-slate-400`}>
            <div className="w-full flex sm:justify-start justify-center">
                <h1 className="text-2xl">FlipGame</h1>
            </div>
        </nav>
    )
}