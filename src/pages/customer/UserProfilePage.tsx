import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { fetchOrdersForUser, cancelOrder } from "../../services/orderService"
import type { Order } from "../../models/Order"
import { ShoppingBag, LogOut, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"

const UserProfile = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed" | "canceled">("all")
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    const userName = localStorage.getItem("userName") || "Customer"

    useEffect(() => {
        const loadUserOrders = async () => {
            if (!token) {
                navigate("/customer/login")
                return
            }

            try {
                setLoading(true)
                const data = await fetchOrdersForUser(token)
                setOrders(data)
            } catch (err) {
                setError("Failed to load orders.")
            } finally {
                setLoading(false)
            }
        }

        loadUserOrders()
    }, [token, navigate])

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userName")
        localStorage.removeItem("userRole")
        navigate("/customer/login")
    }

    const handleCancelOrder = async () => {
        if (!cancellingOrderId || !token) return

        try {
            setLoading(true)
            await cancelOrder(cancellingOrderId, token)

            // Update the order status locally
            setOrders((prevOrders) =>
                prevOrders.map((order) => (order._id === cancellingOrderId ? { ...order, status: "canceled" } : order)),
            )

            setShowConfirmation(false)
            setCancellingOrderId(null)
        } catch (err) {
            setError("Failed to cancel order. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const initiateCancel = (orderId: string) => {
        setCancellingOrderId(orderId)
        setShowConfirmation(true)
    }

    const toggleOrderExpand = (orderId: string) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null)
        } else {
            setExpandedOrder(orderId)
        }
    }

    const renderOrderStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return (
                    <div className="flex items-center gap-1.5 bg-green-100 text-green-700 py-1 px-3 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                    </div>
                )
            case "canceled":
                return (
                    <div className="flex items-center gap-1.5 bg-red-100 text-red-700 py-1 px-3 rounded-full text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        <span>Canceled</span>
                    </div>
                )
            case "pending":
                return (
                    <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 py-1 px-3 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        <span>Pending</span>
                    </div>
                )
            default:
                return (
                    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 py-1 px-3 rounded-full text-sm font-medium">
                        <span>Unknown</span>
                    </div>
                )
        }
    }

    const filteredOrders = orders.filter((order) => {
        if (activeTab === "all") return true
        return order.status.toLowerCase() === activeTab
    })

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar toggleCart={() => { }} cartItemCount={0} />

            <main className="flex-grow container mx-auto px-4 py-8 mt-16">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
                            <p className="text-gray-500 mt-1">Manage your orders and account details</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <ShoppingBag className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">Your Orders</h2>
                    </div>

                    {/* Order Tabs */}
                    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "all" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            All Orders
                        </button>
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "pending" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setActiveTab("completed")}
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "completed" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setActiveTab("canceled")}
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === "canceled" ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Canceled
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">{error}</div>
                    ) : (
                        <>
                            {filteredOrders.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                                    <p className="text-gray-500 mt-1">
                                        {activeTab === "all"
                                            ? "You haven't placed any orders yet."
                                            : `You don't have any ${activeTab} orders.`}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {filteredOrders.map((order) => (
                                        <div
                                            key={order._id}
                                            className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                                        >
                                            {/* Order Header */}
                                            <div
                                                className="bg-gray-50 p-4 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center cursor-pointer"
                                                onClick={() => toggleOrderExpand(order._id)}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-sm font-medium text-gray-900">Order #{order._id.substring(0, 8)}</h3>
                                                        {renderOrderStatus(order.status)}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {order.createdAt ? formatDate(order.createdAt) : "Date not available"}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium">LKR {order.totalAmount.toFixed(2)}</p>
                                                        <p className="text-xs text-gray-500">{order.items.length} items</p>
                                                    </div>

                                                    {order.status.toLowerCase() === "pending" && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                initiateCancel(order._id)
                                                            }}
                                                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}

                                                    {expandedOrder === order._id ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Details (Expanded) */}
                                            {expandedOrder === order._id && (
                                                <div className="p-4 border-t border-gray-200">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Order Items</h4>
                                                    <div className="space-y-3">
                                                        {order.items.map((item, index) => {
                                                            const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
                                                            const imageUrl = item.product.image?.startsWith("http")
                                                                ? item.product.image
                                                                : `${baseUrl}/${item.product.image}`

                                                            return (
                                                                <div key={index} className="flex items-center gap-3">
                                                                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                                        <img
                                                                            src={imageUrl || "/placeholder.svg"}
                                                                            alt={item.product.name}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h5 className="text-sm font-medium text-gray-900 line-clamp-1">
                                                                            {item.product.name}
                                                                        </h5>
                                                                        <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-sm font-medium">
                                                                            LKR {(item.product.price * item.quantity).toFixed(2)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Payment Method</span>
                                                            <span className="font-medium">{order.paymentMethod || "Credit Card"}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm mt-1">
                                                            <span className="text-gray-600">Order Date</span>
                                                            <span className="font-medium">
                                                                {order.createdAt ? formatDate(order.createdAt) : "Not available"}
                                                            </span>
                                                        </div>
                                                        {/* {order.status.toLowerCase() === "completed" && order.completedAt && (
                              <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Completed Date</span>
                                <span className="font-medium">{formatDate(order.completedAt)}</span>
                              </div>
                            )}
                            {order.status.toLowerCase() === "canceled" && order.canceledAt && (
                              <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Canceled Date</span>
                                <span className="font-medium">{formatDate(order.canceledAt)}</span>
                              </div>
                            )} */}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold">Cancel Order</h3>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowConfirmation(false)
                                    setCancellingOrderId(null)
                                }}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                No, Keep Order
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Yes, Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserProfile

