import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../services/orderService";

interface CartItem {
    _id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    discountPrice?: number;
}

const Checkout = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiry: "", cvv: "" });
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(savedCart);
    }, []);

    const subtotal = cartItems.reduce((total, item) => {
        const discountedPrice = item.price - (item.discountPrice || 0);
        return total + discountedPrice * item.quantity;
    }, 0);

    const totalDiscount = cartItems.reduce((total, item) => {
        return total + ((item.discountPrice || 0) * item.quantity);
    }, 0);

    const finalTotal = subtotal;

    const handleCompleteOrderClick = async () => {
        try {
            const formattedCartItems = cartItems.map(item => {
                return {
                    _id: item._id ? item._id.toString() : "",
                    quantity: item.quantity
                };
            });

            const orderData = await placeOrder(formattedCartItems, token);
            console.log("Order placed successfully", orderData);

            setCartItems([]);
            localStorage.removeItem("cart");
            navigate("/customer/profile");

        } catch (error) {
            console.error("Error completing order", error);
        }
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardDetails((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex justify-center">
            <div className="w-full max-w-6xl bg-black border-gray-400 border p-6 rounded-lg shadow-lg flex divide-x divide-gray-400">

                {/* Left Side: Payment Form */}
                <div className="w-1/2 pr-6">
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-light" style={{ fontFamily: "Anton SC" }}>BATMAN</h1>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Payment Details</h1>

                    <form className="space-y-4">
                        <input
                            type="text"
                            name="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={handleCardChange}
                            placeholder="Card Number"
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none"
                            required
                        />
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="expiry"
                                value={cardDetails.expiry}
                                onChange={handleCardChange}
                                placeholder="MM/YY"
                                className="w-1/2 p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none"
                                required
                            />
                            <input
                                type="text"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleCardChange}
                                placeholder="CVV"
                                className="w-1/2 p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleCompleteOrderClick}
                            className="w-full bg-white text-black p-3 rounded font-bold hover:bg-gray-200"
                        >
                            Complete Order
                        </button>
                    </form>
                </div>

                {/* Right Side: Order Summary */}
                <div className="w-1/2 pl-6">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    {cartItems.map((item, index) => {
                        const discountedPrice = item.price - (item.discountPrice || 0);

                        const imageUrl = item.image.startsWith("http") ? item.image : `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"}/${item.image}`;

                        return (
                            <div key={index} className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={imageUrl}
                                        alt={item.name}
                                        onError={(e) => (e.currentTarget.src = '/images/placeholder.png')}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <span className="block font-semibold">{item.name}</span>
                                        <span className="text-sm opacity-80">x {item.quantity}</span>
                                        {item.discountPrice ? (
                                            <>
                                                <div className="flex gap-2">
                                                    <span className="line-through text-red-400 text-sm">
                                                        LKR {item.price.toFixed(2)}
                                                    </span>
                                                    <span className="text-green-400 text-sm">
                                                        LKR {discountedPrice.toFixed(2)}
                                                    </span>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                                <span className="font-semibold">LKR {(discountedPrice * item.quantity).toFixed(2)}</span>
                            </div>
                        );
                    })}
                    <div className="mt-4 border-t border-gray-400 pt-2">
                        <div className="flex justify-between text-lg">
                            <span>Subtotal</span>
                            <span>LKR {subtotal.toFixed(2)}</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className="flex justify-between text-lg text-green-400">
                                <span>Total Discount</span>
                                <span>- LKR {totalDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xl font-bold mt-2">
                            <span>Total</span>
                            <span>LKR {finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
