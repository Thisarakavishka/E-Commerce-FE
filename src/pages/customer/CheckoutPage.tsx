import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { placeOrder } from "../../services/orderService"
import { CreditCard, ShoppingBag, ChevronLeft, CheckCircle, Lock, Calendar, CreditCardIcon } from "lucide-react"

interface CartItem {
    _id: number
    name: string
    price: number
    quantity: number
    image: string
    discountPrice?: number
    category?: {
        name: string
    }
}

const Checkout = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiry: "", cvv: "", name: "" })
    const [loading, setLoading] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()
    const token = localStorage.getItem("token") || ""

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
        setCartItems(savedCart)
    }, [])

    // Calculate subtotal (original prices × quantities)
    const subtotal = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity
    }, 0)

    // Calculate total discount amount
    const totalDiscount = cartItems.reduce((total, item) => {
        return total + (item.discountPrice || 0) * item.quantity
    }, 0)

    // Calculate final total (subtotal - total discount)
    const finalTotal = subtotal - totalDiscount

    const handleCompleteOrderClick = async () => {
        // Basic validation
        // if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        //     setError("Please fill in all payment details")
        //     return
        // }

        setLoading(true)
        setError("")

        try {
            const formattedCartItems = cartItems.map((item) => {
                return {
                    _id: item._id ? item._id.toString() : "",
                    quantity: item.quantity,
                }
            })

            const orderData = await placeOrder(formattedCartItems, token)
            console.log("Order placed successfully", orderData)

            setOrderComplete(true)
            setCartItems([])
            localStorage.removeItem("cart")

            // Redirect after 3 seconds
            setTimeout(() => {
                navigate("/customer/profile")
            }, 3000)
        } catch (error: any) {
            console.error("Error completing order", error)
            setError(error.message || "Failed to place order. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        // Format card number with spaces
        if (name === "cardNumber") {
            const formatted = value
                .replace(/\s/g, "")
                .replace(/(\d{4})/g, "$1 ")
                .trim()
            setCardDetails((prev) => ({ ...prev, [name]: formatted }))
            return
        }

        // Format expiry date with slash
        if (name === "expiry") {
            const cleaned = value.replace(/\D/g, "")
            let formatted = cleaned
            if (cleaned.length > 2) {
                formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
            }
            setCardDetails((prev) => ({ ...prev, [name]: formatted }))
            return
        }

        setCardDetails((prev) => ({ ...prev, [name]: value }))
    }

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 mb-6">
                        Your order has been placed successfully. You will be redirected to your profile page shortly.
                    </p>
                    <button
                        onClick={() => navigate("/customer/profile")}
                        className="w-full py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        View Order History
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-black transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Shopping
                    </button>

                    <h1 className="text-3xl font-bold mt-4 text-center">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side: Payment Form */}
                    <div className="bg-white rounded-2xl shadow-md p-6 order-2 lg:order-1">
                        <div className="flex items-center gap-2 mb-6">
                            <CreditCard className="w-5 h-5" />
                            <h2 className="text-xl font-bold">Payment Details</h2>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
                                    Cardholder Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={cardDetails.name}
                                    onChange={handleCardChange}
                                    placeholder="John Smith"
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 block">
                                    Card Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        value={cardDetails.cardNumber}
                                        onChange={handleCardChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 pl-10"
                                        required
                                    />
                                    <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="expiry" className="text-sm font-medium text-gray-700 block">
                                        Expiry Date
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="expiry"
                                            name="expiry"
                                            value={cardDetails.expiry}
                                            onChange={handleCardChange}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 pl-10"
                                            required
                                        />
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="cvv" className="text-sm font-medium text-gray-700 block">
                                        CVV
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="cvv"
                                            name="cvv"
                                            value={cardDetails.cvv}
                                            onChange={handleCardChange}
                                            placeholder="123"
                                            maxLength={3}
                                            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 pl-10"
                                            required
                                        />
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={handleCompleteOrderClick}
                                    disabled={loading}
                                    className="w-full bg-black text-white p-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>Complete Order</>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                                <Lock className="w-3 h-3" />
                                <p>Payments are secure and encrypted</p>
                            </div>
                        </form>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="bg-white rounded-2xl shadow-md p-6 order-1 lg:order-2">
                        <div className="flex items-center gap-2 mb-6">
                            <ShoppingBag className="w-5 h-5" />
                            <h2 className="text-xl font-bold">Order Summary</h2>
                            <span className="ml-auto bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                            </span>
                        </div>

                        <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map((item, index) => {
                                const hasDiscount = item.discountPrice && item.discountPrice > 0
                                const finalPrice = hasDiscount ? item.price - item.discountPrice : item.price
                                const imageUrl = item.image.startsWith("http")
                                    ? item.image
                                    : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"}/${item.image}`

                                return (
                                    <div key={index} className="flex py-4 first:pt-0">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={imageUrl || "/placeholder.svg"}
                                                alt={item.name}
                                                onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3 className="line-clamp-1">{item.name}</h3>
                                                    <p className="ml-4">LKR {(finalPrice * item.quantity).toFixed(2)}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">{item.category?.name || "Category"}</p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center">
                                                    <p className="text-gray-500">Qty {item.quantity}</p>

                                                    {hasDiscount && (
                                                        <span className="ml-2 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                                                            {Math.round((item.discountPrice / item.price) * 100)}% OFF
                                                        </span>
                                                    )}
                                                </div>

                                                {hasDiscount && (
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500 line-through">LKR {item.price.toFixed(2)}</p>
                                                        <p className="text-xs text-gray-900">LKR {finalPrice.toFixed(2)} each</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span>LKR {subtotal.toFixed(2)}</span>
                            </div>

                            {totalDiscount > 0 && (
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="text-red-600">- LKR {totalDiscount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Shipping</span>
                                <span>Free</span>
                            </div>

                            <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-100">
                                <span>Total</span>
                                <span>LKR {finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h3>
                            <p className="text-sm text-gray-600">Standard shipping (3-5 business days)</p>
                            <button className="text-sm text-black font-medium mt-2 hover:underline">Add shipping address</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout