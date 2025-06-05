import { useState, useEffect } from "react"
import { useNotifications } from "../../context/NotificationContext"
import { Bell, Filter, Search, Trash2, MoreHorizontal, ChevronDown } from "lucide-react"
import { formatNotificationTime, getNotificationTypeIcon } from "../../utils/notificationHelpers"

const NotificationsPage = () => {
  const { notifications, unreadCount, markAllAsRead, fetchAllNotifications } = useNotifications()
  const [filteredNotifications, setFilteredNotifications] = useState(notifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [readFilter, setReadFilter] = useState<boolean | null>(null)
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Refresh notifications when component mounts
  useEffect(() => {
    console.log("NotificationsPage: Fetching notifications")
    fetchAllNotifications().catch((err) => {
      console.error("Error in NotificationsPage when fetching notifications:", err)
    })
  }, [])

  // Update filtered notifications when notifications change
  useEffect(() => {
    setFilteredNotifications(notifications)
  }, [notifications])

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

  // Delete notification
  const deleteNotification = (id: string) => {
    // This would call the API to delete the notification
    // For now, just filter it out locally
    setFilteredNotifications(filteredNotifications.filter((notification) => notification._id !== id))
    setSelectedNotifications(selectedNotifications.filter((notificationId) => notificationId !== id))
  }

  // Delete selected notifications
  const deleteSelected = () => {
    // This would call the API to delete the selected notifications
    // For now, just filter them out locally
    setFilteredNotifications(
      filteredNotifications.filter((notification) => !selectedNotifications.includes(notification._id || "")),
    )
    setSelectedNotifications([])
    setSelectAll(false)
  }

  // Toggle notification selection
  const toggleSelect = (id: string) => {
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
      setSelectedNotifications(filteredNotifications.map((notification) => notification._id || ""))
    }
    setSelectAll(!selectAll)
  }

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
              key={notification._id}
              className={`flex items-start gap-4 p-4 rounded-lg border ${
                notification.read ? "bg-white border-gray-200" : "bg-gray-50 border-gray-300"
              }`}
            >
              <div className="flex items-center h-full pt-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                  checked={selectedNotifications.includes(notification._id || "")}
                  onChange={() => toggleSelect(notification._id || "")}
                />
              </div>

              <div className="flex-shrink-0 mt-1">{getNotificationTypeIcon(notification.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className={`text-sm font-medium ${notification.read ? "text-gray-900" : "text-black"}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500">{formatNotificationTime(notification.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>

              <div className="flex items-center gap-2">
                {!notification.read && (
                  <button
                    onClick={() => {
                      // This would call the API to mark as read
                      // For now, just update locally
                      notification.read = true
                      fetchAllNotifications()
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification._id || "")}
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