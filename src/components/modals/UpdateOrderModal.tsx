import { useState, useEffect } from "react"
import { fetchOrderById, updateOrderStatus } from "../../services/orderService"
import { X, CheckCircle, Clock, XCircle } from "lucide-react"

interface UpdateOrderModalProps {
    orderId: string
    closeModal: () => void
    reloadOrders: () => void
}

const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({ orderId, closeModal, reloadOrders }) => {
    const [order, setOrder] = useState<any | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token") || ""
                const fetchedOrder = await fetchOrderById(orderId, token)
                setOrder(fetchedOrder)
            } catch (err) {
                setError("Failed to load order details.")
            } finally {
                setLoading(false)
            }
        }

        if (orderId) loadOrder()
    }, [orderId])

    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
        }
    }

    const handleStatusChange = async (newStatus: string) => {
        if (order) {
            try {
                setUpdating(true)
                const token = localStorage.getItem("token") || ""
                await updateOrderStatus(orderId, newStatus, token)
                reloadOrders()
                closeModal()
            } catch (error) {
                setUpdating(false)
                setError("Failed to update order status.")
            }
        }
    }

    // Render status badge based on order status
    const renderStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return (
                    <div className="flex items-center gap-1.5 bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completed</span>
                    </div>
                )
            case "pending":
                return (
                    <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 py-1 px-3 rounded-full text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
                    </div>
                )
            case "canceled":
                return (
                    <div className="flex items-center gap-1.5 bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        <span>Canceled</span>
                    </div>
                )
            default:
                return (
                    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 py-1 px-3 rounded-full text-xs font-medium">
                        <span>{status}</span>
                    </div>
                )
        }
    }

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-[500px] max-h-[90vh] flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Error</h2>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</div>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!order) return null

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Update Order Status</h2>
                        <p className="text-sm text-gray-500">#{order._id.substring(0, 8)}</p>
                    </div>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Current Status:</span>
                            {renderStatusBadge(order.status)}
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Customer:</span>
                            <span className="text-gray-900">{order.user?.email}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Total Amount:</span>
                            <span className="text-gray-900 font-medium">LKR {order.totalAmount.toFixed(2)}</span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Change Status To:</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {order.status !== "completed" && (
                                    <button
                                        onClick={() => handleStatusChange("completed")}
                                        disabled={updating}
                                        className="flex items-center justify-center gap-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Mark as Completed</span>
                                    </button>
                                )}

                                {order.status !== "pending" && (
                                    <button
                                        onClick={() => handleStatusChange("pending")}
                                        disabled={updating}
                                        className="flex items-center justify-center gap-2 p-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors"
                                    >
                                        <Clock className="w-4 h-4" />
                                        <span>Mark as Pending</span>
                                    </button>
                                )}

                                {order.status !== "canceled" && (
                                    <button
                                        onClick={() => handleStatusChange("canceled")}
                                        disabled={updating}
                                        className="flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        <span>Mark as Canceled</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {updating && (
                            <div className="flex justify-center items-center py-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateOrderModal