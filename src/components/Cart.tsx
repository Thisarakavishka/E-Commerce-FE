import type React from "react"
import { X, Trash2, Plus, Minus, ShoppingBag, Tag } from 'lucide-react'
import type { Product } from "../models/Product"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface CartProps {
    cartItems: (Product & { quantity: number })[]
    cartOpen: boolean
    toggleCart: () => void
    updateQuantity: (productId: string, quantity: number) => void
    removeItem: (productId: string) => void
}

const Cart: React.FC<CartProps> = ({ cartItems, cartOpen, toggleCart, updateQuantity, removeItem }) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
    const navigate = useNavigate()
    const { user } = useAuth()

    // Calculate subtotal (original prices × quantities)
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Calculate total discount amount
    const totalDiscount = cartItems.reduce((sum, item) => {
        return sum + ((item.discountPrice || 0) * item.quantity)
    }, 0)

    // Calculate final total (subtotal - total discount)
    const finalTotal = subtotal - totalDiscount

    const handleCheckoutButton = () => {
        if (cartItems.length === 0) return

        if (user?.role?.toUpperCase() === "CUSTOMER") {
            navigate("/checkout")
        } else {
            navigate("/customer/login")
        }
    }

    return (
        <>
            {/* Overlay */}
            {cartOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={toggleCart}
                />
            )}

            {/* Cart panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transition-transform duration-500 ease-in-out ${cartOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            <h2 className="text-lg font-bold">My Cart</h2>
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                            </span>
                        </div>
                        <button
                            onClick={toggleCart}
                            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close cart"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Cart items */}
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-grow p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Your cart is empty</p>
                            <p className="text-gray-400 text-sm mt-1">Add items to get started</p>
                            <button onClick={toggleCart} className="mt-6 text-sm font-medium text-black hover:underline">
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="flex-grow overflow-y-auto custom-scrollbar p-4">
                            <div className="space-y-4">
                                {cartItems.map((item) => {
                                    const imageUrl = item.image?.startsWith("http") ? item.image : `${baseUrl}/${item.image}`
                                    const hasDiscount = item.discountPrice && item.discountPrice > 0
                                    const finalPrice = hasDiscount ? item.price - item.discountPrice : item.price
                                    const discountPercentage = hasDiscount
                                        ? Math.round((item.discountPrice / item.price) * 100)
                                        : 0

                                    return (
                                        <div
                                            key={item._id}
                                            className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                                        >
                                            {/* Product image */}
                                            <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-50 flex-shrink-0 relative">
                                                <img
                                                    src={imageUrl || "/placeholder.svg"}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
                                                />
                                                {hasDiscount && (
                                                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 flex items-center">
                                                        <Tag className="w-3 h-3 mr-0.5" />
                                                        {discountPercentage}% OFF
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeItem(item._id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors ml-1 p-1"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <p className="text-gray-500 text-xs mt-0.5">{item.category?.name || "Category"}</p>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div>
                                                        {hasDiscount ? (
                                                            <div className="flex flex-col">
                                                                <p className="text-xs text-gray-500 line-through">LKR {item.price.toFixed(2)}</p>
                                                                <p className="font-medium text-red-600">LKR {finalPrice.toFixed(2)}</p>
                                                            </div>
                                                        ) : (
                                                            <p className="font-medium">LKR {item.price.toFixed(2)}</p>
                                                        )}
                                                    </div>

                                                    {/* Quantity controls */}
                                                    <div className="flex items-center border border-gray-200 rounded-md">
                                                        <button
                                                            className="p-1 text-gray-500 hover:text-black disabled:opacity-50"
                                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            aria-label="Decrease quantity"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="px-2 py-1 text-sm font-medium min-w-[28px] text-center">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            className="p-1 text-gray-500 hover:text-black"
                                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                            aria-label="Increase quantity"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Item total */}
                                                <div className="flex justify-end mt-1">
                                                    <p className="text-xs text-gray-500">
                                                        Total: LKR {(finalPrice * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Footer with total and checkout */}
                    <div className="border-t border-gray-100 p-4 bg-white">
                        {cartItems.length > 0 && (
                            <>
                                {/* Summary */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>LKR {subtotal.toFixed(2)}</span>
                                    </div>

                                    {totalDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Discount</span>
                                            <span className="text-red-600">- LKR {totalDiscount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>

                                    <div className="border-t border-gray-100 pt-2 mt-2">
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span>LKR {finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            onClick={handleCheckoutButton}
                            disabled={cartItems.length === 0}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${cartItems.length === 0
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-black hover:bg-gray-800 text-white"
                                }`}
                        >
                            {cartItems.length === 0 ? "Cart is Empty" : "Proceed to Checkout"}
                        </button>

                        {cartItems.length > 0 && (
                            <button
                                onClick={toggleCart}
                                className="w-full text-center mt-3 text-sm font-medium text-gray-600 hover:text-black"
                            >
                                Continue Shopping
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart
