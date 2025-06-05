import { NotificationType } from "../models/Notification.js"

// Helper function to create a notification for a new order
export const createOrderNotification = (orderId: string, customerEmail: string) => {
    return {
        title: "New Order Received",
        message: `Order #${orderId} has been placed by ${customerEmail}`,
        type: NotificationType.ORDER,
        relatedId: orderId,
    }
}

// Helper function to create a notification for a payment
export const createPaymentNotification = (orderId: string, amount: number) => {
    return {
        title: "Payment Successful",
        message: `Payment of LKR ${amount.toLocaleString()} has been received for Order #${orderId}`,
        type: NotificationType.PAYMENT,
        relatedId: orderId,
    }
}

// Helper function to create a notification for a shipped order
export const createShippingNotification = (orderId: string, shippingMethod: string) => {
    return {
        title: "Order Shipped",
        message: `Order #${orderId} has been shipped via ${shippingMethod}`,
        type: NotificationType.SHIPPING,
        relatedId: orderId,
    }
}

// Helper function to create a notification for low stock
export const createLowStockNotification = (productName: string, remainingStock: number) => {
    return {
        title: "Low Stock Alert",
        message: `Product '${productName}' is running low on stock (${remainingStock} remaining)`,
        type: NotificationType.INVENTORY,
        relatedId: productName,
    }
}

// Helper function to create a notification for a new customer
export const createCustomerNotification = (customerName: string) => {
    return {
        title: "New Customer Registration",
        message: `${customerName} has created a new account`,
        type: NotificationType.CUSTOMER,
        relatedId: customerName,
    }
}

// Helper function to format notification timestamp
export const formatNotificationTime = (timestamp: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000)

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

// Helper function to get notification icon based on type
export const getNotificationTypeIcon = (type: string) => {
    return type
}
