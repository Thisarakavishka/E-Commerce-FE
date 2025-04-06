import React, { useState, useEffect } from "react";
import { fetchOrderById } from "../../services/orderService";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

interface ViewOrderModalProps {
    orderId: string;
    closeModal: () => void;
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ orderId, closeModal }) => {
    const [order, setOrder] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const token = localStorage.getItem("token") || "";
                const data = await fetchOrderById(orderId, token);
                setOrder(data);
            } catch (err) {
                setError("Failed to load order details.");
            }
        };

        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    if (error) return <div className="text-red-500 text-center">{error}</div>;

    if (!order) return <div className="text-gray-500 text-center">Loading...</div>;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-[380px] sm:w-[500px] md:w-[600px] shadow-lg relative overflow-hidden">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-gray-800"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <p className="text-gray-600">Customer:</p>
                        <p className="text-gray-800 font-semibold">{order.user.name}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-600">Email:</p>
                        <p className="text-gray-800">{order.user.email}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-600">Payment Method:</p>
                        <p className="text-gray-800">{order.paymentMethod}</p>
                    </div>

                    <div className="flex justify-between font-bold mt-4 border-t border-gray-400 pt-2">
                        <span>Total</span>
                        <span className="text-lg">LKR {order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Scrollable Order Items */}
                <div className="max-h-[300px] overflow-y-auto mt-4">
                    {order.items.map((item: any, index: number) => {
                        const imageUrl = item.product.image
                            ? `${baseUrl}/${item.product.image}`
                            : '/images/placeholder.png';
                        return (
                            <div key={index} className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={imageUrl}
                                        alt={item.product.name}
                                        onError={(e) => (e.currentTarget.src = '/images/placeholder.png')}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <span className="block font-semibold">{item.product.name}</span>
                                        <span className="text-sm opacity-80">x {item.quantity}</span>
                                    </div>
                                </div>
                                <span className="font-semibold">
                                    LKR {item.price * item.quantity}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ViewOrderModal;
