import { useState, useEffect } from "react"
import { Bell, CheckCircle, Clock, XCircle, Filter, Search, Trash2, MoreHorizontal, ChevronDown } from "lucide-react"

// Mock notification data
const mockNotifications = [
    {
        id: 1,
        title: "New Order Received",
        message: "Order #12345 has been placed by john.doe@example.com",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        type: "order",
    },
    {
        id: 2,
        title: "Payment Successful",
        message: "Payment of LKR 7,500 has been received for Order #12345",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        type: "payment",
    },
    {
        id: 3,
        title: "Order Shipped",
        message: "Order #12340 has been shipped via Express Delivery",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
        type: "shipping",
    },
    {
        id: 4,
        title: "Low Stock Alert",
        message: "Product 'Urban Black Hoodie' is running low on stock (3 remaining)",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        type: "inventory",
    },
    {
        id: 5,
        title: "New Customer Registration",
        message: "Jane Smith has created a new account",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        type: "customer",
    },
    {
        id: 6,
        title: "Product Review",
        message: "New 5-star review for 'Signature Logo T-Shirt'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        read: true,
        type: "review",
    },
    {
        id: 7,
        title: "Order Canceled",
        message: "Order #12335 has been canceled by the customer",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
        read: true,
        type: "order",
    },
    {
        id: 8,
        title: "System Update",
        message: "The system will undergo maintenance on Sunday at 2:00 AM",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        read: true,
        type: "system",
    },
]

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState(mockNotifications)
    const [filteredNotifications, setFilteredNotifications] = useState(mockNotifications)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string | null>(null)
    const [readFilter, setReadFilter] = useState<boolean | null>(null)
    const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
    const [selectAll, setSelectAll] = useState(false)

    // Filter notifications based on search term, type filter, and read filter
    useEffect(() => {
        let result = [...notifications]

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim()
            result = result.filter(
                (notification) =>
                    notification.title.toLowerCase().includes(term) || notification.message.toLowerCase().includes(term),
            )
        }

        // Apply type filter
        if (typeFilter) {
            result = result.filter((notification) => notification.type === typeFilter)
        }

        // Apply read filter
        if (readFilter !== null) {
            result = result.filter((notification) => notification.read === readFilter)
        }

        setFilteredNotifications(result)
    }, [notifications, searchTerm, typeFilter, readFilter])

    // Handle search input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    // Mark notification as read
    const markAsRead = (id: number) => {
        setNotifications(
            notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
        )
    }

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    }

    // Delete notification
    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter((notification) => notification.id !== id))
        setSelectedNotifications(selectedNotifications.filter((notificationId) => notificationId !== id))
    }

    // Delete selected notifications
    const deleteSelected = () => {
        setNotifications(notifications.filter((notification) => !selectedNotifications.includes(notification.id)))
        setSelectedNotifications([])
        setSelectAll(false)
    }

    // Toggle notification selection
    const toggleSelect = (id: number) => {
        if (selectedNotifications.includes(id)) {
            setSelectedNotifications(selectedNotifications.filter((notificationId) => notificationId !== id))
        } else {
            setSelectedNotifications([...selectedNotifications, id])
        }
    }

    // Toggle select all
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedNotifications([])
        } else {
            setSelectedNotifications(filteredNotifications.map((notification) => notification.id))
        }
        setSelectAll(!selectAll)
    }

    // Format timestamp
    const formatTimestamp = (timestamp: Date) => {
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000)

        if (diffInSeconds < 60) {
            return "Just now"
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60)
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600)
            return `${hours} hour${hours > 1 ? "s" : ""} ago`
        } else {
            const days = Math.floor(diffInSeconds / 86400)
            return days === 1 ? "Yesterday" : `${days} days ago`
        }
    }

    // Get notification icon based on type
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "order":
                return <Bell className="w-5 h-5 text-blue-500" />
            case "payment":
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case "shipping":
                return <Clock className="w-5 h-5 text-purple-500" />
            case "inventory":
                return <XCircle className="w-5 h-5 text-red-500" />
            case "customer":
                return <Bell className="w-5 h-5 text-yellow-500" />
            case "review":
                return <Bell className="w-5 h-5 text-pink-500" />
            case "system":
                return <Bell className="w-5 h-5 text-gray-500" />
            default:
                return <Bell className="w-5 h-5 text-gray-500" />
        }
    }

    // Count unread notifications
    const unreadCount = notifications.filter((notification) => !notification.read).length

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 mt-1">Manage your notifications {unreadCount > 0 && `(${unreadCount} unread)`}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="relative">
                        <select
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                            value={typeFilter || ""}
                            onChange={(e) => setTypeFilter(e.target.value || null)}
                        >
                            <option value="">All Types</option>
                            <option value="order">Orders</option>
                            <option value="payment">Payments</option>
                            <option value="shipping">Shipping</option>
                            <option value="inventory">Inventory</option>
                            <option value="customer">Customers</option>
                            <option value="review">Reviews</option>
                            <option value="system">System</option>
                        </select>
                        <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                            value={readFilter === null ? "" : readFilter ? "read" : "unread"}
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    setReadFilter(null)
                                } else {
                                    setReadFilter(e.target.value === "read")
                                }
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="read">Read</option>
                            <option value="unread">Unread</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="select-all"
                        className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                    />
                    <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                        Select All
                    </label>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={markAllAsRead}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        disabled={unreadCount === 0}
                    >
                        Mark All as Read
                    </button>
                    <button
                        onClick={deleteSelected}
                        className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                        disabled={selectedNotifications.length === 0}
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Selected
                    </button>
                </div>
            </div>

            {/* Notifications list */}
            <div className="space-y-3 mt-6">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">No notifications found</h3>
                        <p className="text-gray-500 mt-1">
                            {searchTerm || typeFilter || readFilter !== null ? "Try adjusting your filters" : "You're all caught up!"}
                        </p>
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border ${notification.read ? "bg-white border-gray-200" : "bg-gray-50 border-gray-300"
                                }`}
                        >
                            <div className="flex items-center h-full pt-1">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                                    checked={selectedNotifications.includes(notification.id)}
                                    onChange={() => toggleSelect(notification.id)}
                                />
                            </div>

                            <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                    <h3 className={`text-sm font-medium ${notification.read ? "text-gray-900" : "text-black"}`}>
                                        {notification.title}
                                    </h3>
                                    <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                {!notification.read && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        Mark as read
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                    title="Delete notification"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="relative group">
                                    <button className="text-gray-400 hover:text-gray-600 p-1" title="More options">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 hidden group-hover:block">
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            View Details
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Archive
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default NotificationsPage