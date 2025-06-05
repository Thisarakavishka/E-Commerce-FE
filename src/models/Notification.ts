export interface Notification {
    _id?: string
    title: string
    message: string
    timestamp: Date
    read: boolean
    type: string
    userId: string
    relatedId?: string // For linking to orders, products, etc.
}

// Types of notifications
export const NotificationType = {
    ORDER: "order",
    PAYMENT: "payment",
    SHIPPING: "shipping",
    INVENTORY: "inventory",
    CUSTOMER: "customer",
    REVIEW: "review",
    SYSTEM: "system",
}
