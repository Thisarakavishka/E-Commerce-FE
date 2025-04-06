import React from "react";
import { HiTrash, HiMinusCircle, HiPlusCircle } from "react-icons/hi";
import { Product } from "../models/Product";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface CartProps {
    cartItems: (Product & { quantity: number })[];
    cartOpen: boolean;
    toggleCart: () => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeItem: (productId: string) => void;
}


const Cart: React.FC<CartProps> = ({ cartItems, cartOpen, toggleCart, updateQuantity, removeItem, }) => {

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

    const navigate = useNavigate();
    const { user } = useAuth();

    const handleCheckoutButton = () => {
        if (cartItems.length === 0) return;

        if (user?.role?.toUpperCase() === "CUSTOMER") {
            navigate("/checkout");
        } else {
            navigate("/customer/login");
        }
    };

    return (
        <div
            className={`fixed top-16 right-0 h-[calc(100%-4rem)] w-80 bg-white shadow-lg p-4 overflow-y-auto transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-lg font-bold">My Cart</h2>
                <button onClick={toggleCart} className="text-xl font-bold">
                    ✖
                </button>
            </div>

            {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
            ) : (
                <div className="space-y-4 max-h-[calc(100%-12rem)] overflow-y-auto custom-scrollbar">
                    {cartItems.map((item, index) => {
                        const imageUrl = item.image.startsWith("http")
                            ? item.image
                            : `${baseUrl}/${item.image}`;

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 border-b pb-2"
                            >
                                <img
                                    src={imageUrl}
                                    alt={item.name}
                                    className="w-16 h-16 rounded object-cover"
                                    onError={(e) =>
                                        (e.currentTarget.src = "/placeholder-image.png")
                                    }
                                />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold">{item.name}</h3>
                                    <p className="text-gray-500">LKR {item.price}</p>

                                    <div className="flex items-center mt-1">
                                        <button
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={() =>
                                                updateQuantity(item._id, item.quantity - 1)
                                            }
                                            disabled={item.quantity <= 1}
                                        >
                                            <HiMinusCircle className="text-2xl" />
                                        </button>
                                        <span className="mx-2 text-sm font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={() =>
                                                updateQuantity(item._id, item.quantity + 1)
                                            }
                                        >
                                            <HiPlusCircle className="text-2xl" />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeItem(item._id)}
                                    className="text-red-500 hover:text-red-600 ml-2"
                                >
                                    <HiTrash className="text-2xl" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-4 border-t pt-4">
                <h3 className="text-lg font-bold">Total: LKR {totalPrice.toFixed(2)}</h3>
                <button
                    onClick={handleCheckoutButton}
                    className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 w-full rounded-md mt-2 ">
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
