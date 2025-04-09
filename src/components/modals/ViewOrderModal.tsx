import { useState, useEffect } from "react"
import { fetchOrderById } from "../../services/orderService"
import { X, CheckCircle, Clock, XCircle, Package, Calendar, CreditCard, User, Mail } from "lucide-react"

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"

interface ViewOrderModalProps {
    orderId: string
    closeModal: () => void
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ orderId, closeModal }) => {
    const [order, setOrder] = useState<any | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token") || ""
                const data = await fetchOrderById(orderId, token)
                setOrder(data)
            } catch (err) {
                setError("Failed to load order details.")
            } finally {
                setLoading(false)
            }
        }

        if (orderId) {
            loadOrder()
        }
    }, [orderId])

    // Handle backdrop click to close modal
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal()
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
                <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-[600px] max-h-[90vh] flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-xl shadow-lg w-[90%] max-w-[600px]">
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

    // Calculate subtotal (without shipping and tax)
    const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const shipping = order.shippingCost || 0
    const tax = order.taxAmount || order.totalAmount - subtotal - shipping

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[700px] max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                        <p className="text-sm text-gray-500">#{order._id.substring(0, 8)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {renderStatusBadge(order.status)}
                        <button
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Order Info */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Customer Information</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{order.user.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{order.user.email}</span>
                                </div>
                            </div>
                        </div>

                        {order.shippingAddress && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Shipping Address</h3>
                                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                                    <p className="font-medium">{order.shippingAddress.name || order.user.name}</p>
                                    {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
                                    {order.shippingAddress.city && (
                                        <p>
                                            {order.shippingAddress.city}
                                            {order.shippingAddress.state && `, ${order.shippingAddress.state}`}{" "}
                                            {order.shippingAddress.postalCode}
                                        </p>
                                    )}
                                    {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                                    {order.shippingAddress.phone && (
                                        <p className="mt-1 text-gray-600">Phone: {order.shippingAddress.phone}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Order Information</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{order.paymentMethod || "Credit Card"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-900">{order.items.length} items</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(order.deliveryMethod || order.estimatedDelivery) && (
                        <div className="px-6 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Delivery Information</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                {order.deliveryMethod && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Method:</span>
                                        <span className="text-gray-900 font-medium">{order.deliveryMethod}</span>
                                    </div>
                                )}
                                {order.estimatedDelivery && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Estimated Delivery:</span>
                                        <span className="text-gray-900 font-medium">
                                            {new Date(order.estimatedDelivery).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}
                                {order.trackingNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tracking Number:</span>
                                        <span className="text-gray-900 font-medium">{order.trackingNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div className="px-6 pb-4">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Order Items</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4 max-h-[300px] overflow-y-auto">
                            {order.items.map((item: any, index: number) => {
                                const imageUrl = item.product.image ? `${baseUrl}/${item.product.image}` : "/images/placeholder.png"
                                return (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                <img
                                                    src={imageUrl || "/placeholder.svg"}
                                                    alt={item.product.name}
                                                    onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <span className="block font-medium text-gray-900">{item.product.name}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-gray-500">
                                                        LKR {item.price.toFixed(2)} × {item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-medium text-gray-900">LKR {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {order.notes && (
                        <div className="px-6 pb-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Order Notes</h3>
                            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 italic">"{order.notes}"</div>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="p-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900">LKR {subtotal.toFixed(2)}</span>
                            </div>
                            {shipping > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-gray-900">LKR {shipping.toFixed(2)}</span>
                                </div>
                            )}
                            {tax > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">LKR {tax.toFixed(2)}</span>
                                </div>
                            )}
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="flex items-center text-green-600">
                                        <span>Discount</span>
                                        {order.discountPercentage && (
                                            <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                                                {order.discountPercentage}% OFF
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-green-600">- LKR {order.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            {order.couponCode && (
                                <div className="flex justify-between">
                                    <span className="flex items-center text-blue-600">
                                        <span>Coupon ({order.couponCode})</span>
                                    </span>
                                    <span className="text-blue-600">- LKR {(order.couponDiscount || 0).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-3 border-t border-gray-200 mt-2">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-bold text-gray-900">LKR {order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewOrderModal
