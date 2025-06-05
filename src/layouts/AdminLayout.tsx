import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const AdminLayout = () => {
    const [isMobile, setIsMobile] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            setSidebarCollapsed(mobile)
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)

        return () => {
            window.removeEventListener("resize", checkScreenSize)
        }
    }, [])

    useEffect(() => {
        const handleSidebarToggle = (e: CustomEvent) => {
            setSidebarCollapsed(e.detail.collapsed)
        }

        window.addEventListener("sidebarToggle" as any, handleSidebarToggle)

        return () => {
            window.removeEventListener("sidebarToggle" as any, handleSidebarToggle)
        }
    }, [])

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar />
            <div
                className={`flex flex-col flex-1 transition-all duration-300 ${isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"}`}
            >
                <Header />
                <main className="flex-1 overflow-auto p-4 md:p-6 pt-20 mt-15">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout