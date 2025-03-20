import { Link, useLocation } from "react-router-dom";
import { BsGrid1X2, BsPeople, BsFileText, BsBox, BsBell, BsGear, BsQuestionCircle, BsClipboard } from "react-icons/bs";

const Sidebar = () => {
    const location = useLocation();

    const navLinks = [
        { icon: BsGrid1X2, text: "Dashboard", link: "/admin/dashboard" },
        { icon: BsPeople, text: "Customers", link: "/admin/customers" },
        { icon: BsFileText, text: "Reports", link: "/admin/reports" },
    ];

    const stockLinks = [
        { icon: BsClipboard, text: "Orders", link: "/admin/orders" },
        { icon: BsBox, text: "Products", link: "/admin/products" },
        { icon: BsBox, text: "Category", link: "/admin/category" },
    ];

    const settingsLinks = [
        { icon: BsGear, text: "Preferences", link: "/admin/preferences" },
        { icon: BsQuestionCircle, text: "Help", link: "/admin/help" },
    ];

    return (
        <aside className="w-60 h-screen bg-black text-white p-4 fixed left-0 top-0 z-10 flex flex-col">

            <h2 className="text-xs text-gray-400 mb-2 mt-[50px]">GENERAL</h2>
            <ul className="space-y-2">
                {navLinks.map((item, index) => {
                    const isActive = location.pathname === item.link;
                    return (
                        <li key={index}>
                            <Link to={item.link}
                                className="flex items-center gap-3 p-2 text-white rounded-md transition-all duration-200"
                                style={{
                                    backgroundColor: isActive ? "rgba(156, 163, 175, 0.5)" : "transparent",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(156, 163, 175, 0.3)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isActive ? "rgba(156, 163, 175, 0.5)" : "transparent")}
                            >
                                <item.icon className="text-xl" />
                                {item.text}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <h2 className="text-xs text-gray-400 mt-10 mb-2">STOCK & ORDERS</h2>
            <ul className="space-y-2">
                {stockLinks.map((item, index) => {
                    const isActive = location.pathname === item.link;
                    return (
                        <li key={index}>
                            <Link to={item.link}
                                className="flex items-center gap-3 p-2 text-white rounded-md transition-all duration-200"
                                style={{
                                    backgroundColor: isActive ? "rgba(75, 85, 99, 0.5)" : "transparent",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(75, 85, 99, 0.3)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isActive ? "rgba(75, 85, 99, 0.5)" : "transparent")}
                            >
                                <item.icon className="text-xl" />
                                {item.text}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <h2 className="text-xs text-gray-400 mt-10 mb-2">COMMUNICATION</h2>
            <ul>
                <li>
                    <Link to="/admin/notifications"
                        className="flex items-center justify-between p-2 text-white rounded-md transition-all duration-200"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(75, 85, 99, 0.3)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                        <div className="flex items-center gap-3">
                            <BsBell className="text-xl" />
                            Notification
                        </div>
                        <span className="bg-gray-500 text-white text-xs rounded-full px-2 py-0.5">14</span>
                    </Link>
                </li>
            </ul>

            <h2 className="text-xs text-gray-400 mt-10 mb-2">SETTINGS</h2>
            <ul className="space-y-2">
                {settingsLinks.map((item, index) => {
                    const isActive = location.pathname === item.link;
                    return (
                        <li key={index}>
                            <Link to={item.link}
                                className="flex items-center gap-3 p-2 text-white rounded-md transition-all duration-200"
                                style={{
                                    backgroundColor: isActive ? "rgba(55, 65, 81, 0.5)" : "transparent",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(55, 65, 81, 0.3)")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isActive ? "rgba(55, 65, 81, 0.5)" : "transparent")}
                            >
                                <item.icon className="text-xl" />
                                {item.text}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default Sidebar;
