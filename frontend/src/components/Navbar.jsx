import { Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { Link, useLocation } from "react-router-dom"

function Navbar() {
  const { dark, toggleDark } = useTheme()
  const location = useLocation()

  if (location.pathname === "/processing") return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">

      <Link to="/" className="text-sm font-bold text-gray-800 dark:text-white tracking-tight">
        AI Resume Checker
      </Link>

      <button
        onClick={toggleDark}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-200 dark:border-slate-600 shadow-sm hover:scale-110 transition"
        title="Toggle dark mode"
      >
        {dark
          ? <Sun size={16} className="text-amber-400" />
          : <Moon size={16} className="text-slate-600" />
        }
      </button>

    </div>
  )
}

export default Navbar