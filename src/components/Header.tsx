import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { formatUserRole } from "../utils/formatRole"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { Link } from "react-router-dom"

const Header = () => {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!user) return null

  const userInitial = user.firstName.charAt(0).toUpperCase()

  // Format current date
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const formattedDay = today.toLocaleDateString("en-GB", { weekday: "long" })

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 fixed top-0 right-0 flex justify-between items-center px-4 md:px-6 z-10 shadow-sm">
      <div></div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Welcome message - hide on small screens */}
        <div className="hidden md:block text-sm leading-tight py-1">
          <p className="font-semibold text-[13px]">
            Welcome, {user.firstName} {user.lastName}
          </p>
          <p className="font-medium text-gray-600 text-[11px]">
            {formattedDate} | {formattedDay}
          </p>
        </div>

        {/* User profile */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg py-1 px-2 transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-black text-white flex justify-center items-center rounded-full font-bold text-sm">
              {userInitial}
            </div>
            <div className="text-sm leading-tight hidden sm:block">
              <p className="font-semibold text-[13px]">
                {user.firstName} {user.lastName.slice(0, 3)}..
              </p>
              <p className="font-medium text-gray-600 text-[11px]">{formatUserRole(user.role)}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
          </button>

          {/* User dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-semibold text-sm">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <ul>
                <li>
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </li>
                <li className="border-t border-gray-100 mt-1">
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header