"use client"

import { createContext, type ReactNode, useState, useContext, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { fetchNotifications, fetchUnreadCount, markAllNotificationsAsRead } from "../services/notificationService"
import { type Notification, NotificationType } from "../models/Notification"

// Sample notifications for testing
const sampleNotifications: Notification[] = [
  {
    _id: "1",
    title: "New Order Received",
    message: "Order #12345 has been placed by john.doe@example.com",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    type: NotificationType.ORDER,
    userId: "admin",
    relatedId: "12345",
  },
  {
    _id: "2",
    title: "Payment Successful",
    message: "Payment of LKR 7,500 has been received for Order #12345",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    type: NotificationType.PAYMENT,
    userId: "admin",
    relatedId: "12345",
  },
  {
    _id: "3",
    title: "Order Shipped",
    message: "Order #12340 has been shipped via Express Delivery",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    type: NotificationType.SHIPPING,
    userId: "admin",
    relatedId: "12340",
  },
  {
    _id: "4",
    title: "Low Stock Alert",
    message: "Product 'Urban Black Hoodie' is running low on stock (3 remaining)",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    type: NotificationType.INVENTORY,
    userId: "admin",
    relatedId: "product-123",
  },
  {
    _id: "5",
    title: "New Customer Registration",
    message: "Jane Smith has created a new account",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
    type: NotificationType.CUSTOMER,
    userId: "admin",
    relatedId: "customer-456",
  },
]

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  fetchAllNotifications: () => Promise<void>
  markAllAsRead: () => Promise<void>
  addSampleNotifications: () => void // Function to add sample notifications
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { token, user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token && user) {
      console.log("-----",user)
      fetchAllNotifications()
    }
  }, [token, user])

  const fetchAllNotifications = async () => {
    if (!token || !user) return

    setLoading(true)
    setError(null)

    try {
      console.log("Fetching notifications for user:", user.id)
      // Fetch notifications with userId
      const notificationsData = await fetchNotifications(token, user.id)
      console.log("Notifications data received:", notificationsData)
      setNotifications(notificationsData)

      // Fetch unread count with userId
      console.log("Fetching unread count for user:", user.id)
      const count = await fetchUnreadCount(token, user.id)
      console.log("Unread count received:", count)
      setUnreadCount(count)
    } catch (err) {
      setError("Failed to fetch notifications")
      console.error("Error fetching notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = async () => {
    if (!token || !user) return

    try {
      // Mark all as read with userId
      await markAllNotificationsAsRead(token, user.id)

      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      )
      setUnreadCount(0)
    } catch (err) {
      console.error("Error marking notifications as read:", err)
    }
  }

  const addSampleNotifications = () => {
    // If we have a user, update the sample notifications to use the current user's ID
    const userNotifications = user
      ? sampleNotifications.map((notification) => ({
          ...notification,
          userId: user.id,
        }))
      : sampleNotifications

    setNotifications(userNotifications)
    const unreadCount = userNotifications.filter((notification) => !notification.read).length
    setUnreadCount(unreadCount)
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchAllNotifications,
        markAllAsRead,
        addSampleNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}