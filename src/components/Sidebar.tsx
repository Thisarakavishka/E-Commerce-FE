import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutGrid, Users, FileText, ShoppingBag, Package, Folder, Bell, Settings, HelpCircle, ChevronLeft, ChevronRight, LogOut, } from "lucide-react"

type NavLinkType = {
    icon: React.ElementType
    text: string
    link: string
    badge?: number
}

const Sidebar = () => {
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    // Check if screen is mobile
    useEffect(() => {
        const checkScreenSize = () => {
            const isMobileView = window.innerWidth < 1024
            setIsMobile(isMobileView)
            if (isMobileView && !mobileOpen) {
                setCollapsed(true)
            }
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)

        return () => {
            window.removeEventListener("resize", checkScreenSize)
        }
    }, [mobileOpen])

    // Dispatch event when sidebar is toggled
    useEffect(() => {
        // Create and dispatch custom event when collapsed state changes
        const event = new CustomEvent("sidebarToggle", {
            detail: { collapsed },
        })
        window.dispatchEvent(event)
    }, [collapsed])

    // Toggle mobile sidebar
    const toggleMobileSidebar = () => {
        setMobileOpen(!mobileOpen)
    }

    // Toggle sidebar collapse
    const toggleSidebar = () => {
        setCollapsed(!collapsed)
    }

    const navLinks: NavLinkType[] = [
        { icon: LayoutGrid, text: "Dashboard", link: "/admin/dashboard" },
        { icon: Users, text: "Customers", link: "/admin/customers" },
        { icon: FileText, text: "Reports", link: "/admin/reports" },
    ]

    const stockLinks: NavLinkType[] = [
        { icon: ShoppingBag, text: "Orders", link: "/admin/orders" },
        { icon: Package, text: "Products", link: "/admin/products" },
        { icon: Folder, text: "Category", link: "/admin/category" },
    ]

    const communicationLinks: NavLinkType[] = [
        { icon: Bell, text: "Notifications", link: "/admin/notifications", badge: 14 },
    ]

    const settingsLinks: NavLinkType[] = [
        { icon: Settings, text: "Preferences", link: "/admin/preferences" },
        { icon: HelpCircle, text: "Help", link: "/admin/help" },
    ]

    const renderNavLinks = (links: NavLinkType[], title: string, showDivider?: boolean) => (
        <div className="mb-6">
            {/* Show title only when not collapsed or on mobile with open sidebar */}
            {(!collapsed || (isMobile && mobileOpen)) && (
                <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-4">{title}</h2>
            )}

            {/* Show divider when collapsed and not on mobile */}
            {collapsed && !isMobile && showDivider && <hr className="border-gray-700 my-4 mx-2" />}

            <ul className="space-y-1">
                {links.map((item, index) => {
                    const isActive = location.pathname === item.link
                    return (
                        <li key={index}>
                            <Link
                                to={item.link}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative
                  ${isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/50 hover:text-white"}
                  ${collapsed && !isMobile ? "justify-center" : ""}
                `}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />

                                {(!collapsed || (isMobile && mobileOpen)) && <span className="text-sm font-medium">{item.text}</span>}

                                {(!collapsed || (isMobile && mobileOpen)) && item.badge && (
                                    <span className="ml-auto bg-gray-700 text-white text-xs rounded-full px-2 py-0.5">{item.badge}</span>
                                )}

                                {/* Tooltip for collapsed state - only show on desktop */}
                                {collapsed && !isMobile && (
                                    <div className="absolute left-full ml-2 rounded-md px-2 py-1 bg-gray-800 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        {item.text}
                                        {item.badge && ` (${item.badge})`}
                                    </div>
                                )}

                                {/* Badge for collapsed state - only show on desktop */}
                                {collapsed && !isMobile && item.badge && (
                                    <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                        {item.badge > 9 ? "9+" : item.badge}
                                    </div>
                                )}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )

    // Mobile sidebar toggle button
    const MobileToggle = () => (
        <button
            onClick={toggleMobileSidebar}
            className="lg:hidden fixed bottom-4 left-4 z-50 bg-black text-white p-3 rounded-full shadow-lg"
            aria-label="Toggle sidebar"
        >
            {mobileOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
    )

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && mobileOpen && (
                <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`bg-black text-white fixed top-0 left-0 h-screen z-30 transition-all duration-300 flex flex-col
          ${collapsed && !isMobile ? "w-16" : "w-64"}
          ${isMobile ? (mobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        `}
            >
                {/* Logo */}
                <div
                    className={`flex items-center justify-center h-16 border-b border-gray-800 ${collapsed && !isMobile ? "px-2" : "px-4"}`}
                >
                    <h1 className="text-xl font-bold tracking-wider" style={{ fontFamily: "'Anton', sans-serif" }}>
                        {collapsed && !isMobile ? "B" : "BATMAN"}
                    </h1>
                </div>

                {/* Toggle button (desktop only) */}
                <button
                    onClick={toggleSidebar}
                    className="hidden lg:flex absolute -right-3 top-20 bg-gray-800 text-white p-1 rounded-full shadow-md"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-2">
                    {renderNavLinks(navLinks, "General", true)}
                    {renderNavLinks(stockLinks, "Stock & Orders", true)}
                    {renderNavLinks(communicationLinks, "Communication", true)}
                    {renderNavLinks(settingsLinks, "Settings", true)}
                </div>

                {/* Logout button */}
                <div className="p-4 border-t border-gray-800">
                    <Link
                        to="/logout"
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-red-400 hover:bg-red-900/20 hover:text-red-300 group relative
              ${collapsed && !isMobile ? "justify-center" : ""}`}
                        aria-label="Logout"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />

                        {(!collapsed || (isMobile && mobileOpen)) && <span className="text-sm font-medium">Logout</span>}

                        {collapsed && !isMobile && (
                            <div className="absolute left-full ml-2 rounded-md px-2 py-1 bg-gray-800 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                Logout
                            </div>
                        )}
                    </Link>
                </div>
            </aside>

            <MobileToggle />
        </>
    )
}

export default Sidebar