import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { formatUserRole } from "../utils/formatRole"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { Link } from "react-router-dom"

interface HeaderProps {
    notifications?: number
}

const Header: React.FC<HeaderProps> = ({ notifications = 14 }) => {
    const { user, logout } = useAuth()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const notificationRef = useRef<HTMLDivElement>(null)
    const userMenuRef = useRef<HTMLDivElement>(null)

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false)
            }
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

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5 text-gray-700" />
                        {notifications > 0 && (
                            <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {notifications > 9 ? "9+" : notifications}
                            </span>
                        )}
                    </button>

                    {/* Notifications dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <h3 className="font-semibold text-sm">Notifications</h3>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                        <p className="text-sm font-medium">New order received</p>
                                        <p className="text-xs text-gray-500 mt-1">Order #{(10000 + i).toString()} has been placed</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {i + 1} hour{i !== 0 ? "s" : ""} ago
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100">
                                <Link to="/admin/notifications" className="text-xs text-center block text-blue-600 hover:text-blue-800">
                                    View all notifications
                                </Link>
                            </div>
                        </div>
                    )}
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