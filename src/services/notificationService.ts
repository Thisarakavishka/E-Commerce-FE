import axios from "axios"

const API_URL = import.meta.env.VITE_NOTIFICATION_API_URL || "http://localhost:5001/api/notifications"

export const fetchNotifications = async (token: string, userId: string) => {
  try {
    const response = await axios.get(`${API_URL}?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching notifications", error)
    return []
  }
}

export const fetchNotificationById = async (id: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching notification with ID ${id}`, error)
    throw error
  }
}

export const createNotification = async (data: Partial<Notification>, token: string) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error("Error creating notification", error)
    throw error
  }
}

export const markAllNotificationsAsRead = async (token: string, userId: string) => {
  try {
    await axios.post(
      `${API_URL}/mark-as-read`,
      { userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  } catch (error) {
    console.error("Error marking notifications as read", error)
    throw error
  }
}

export const fetchUnreadCount = async (token: string, userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/unread-count?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.unreadCount
  } catch (error) {
    console.error("Error fetching unread count", error)
    return 0
  }
}

export const updateNotification = async (id: string, data: Partial<Notification>, token: string) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    console.error(`Error updating notification with ID ${id}`, error)
    throw error
  }
}

export const deleteNotification = async (id: string, token: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (error) {
    console.error(`Error deleting notification with ID ${id}`, error)
    throw error
  }
}