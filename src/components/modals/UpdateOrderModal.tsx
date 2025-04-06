import React, { useState, useEffect } from "react";
import { fetchOrderById, updateOrderStatus } from "../../services/orderService";

interface UpdateOrderModalProps {
    orderId: string;
    closeModal: () => void;
    reloadOrders: () => void;
}

const UpdateOrderModal: React.FC<UpdateOrderModalProps> = ({ orderId, closeModal, reloadOrders }) => {
    const [order, setOrder] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token") || "";
                const fetchedOrder = await fetchOrderById(orderId, token);
                setOrder(fetchedOrder);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                setError("Failed to load order details.");
            }
        };

        if (orderId) loadOrder();
    }, [orderId]);

    const handleStatusChange = async () => {
        if (order) {
            const newStatus = order.status === "pending" ? "completed" : "pending";
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token") || "";
                await updateOrderStatus(orderId, newStatus, token);
                reloadOrders();
                closeModal();
            } catch (error) {
                setIsLoading(false);
                setError("Failed to update order status.");
            }
        }
    };

    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (isLoading) return <div className="text-center">Loading...</div>;
    if (!order) return null;

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-3xl w-[450px] shadow-2xl relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 text-2xl hover:text-gray-700"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Change Order Status</h2>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600 font-medium">Order ID:</p>
                        <p className="text-gray-800">{order._id}</p>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-gray-600 font-medium">User Email:</p>
                        <p className="text-gray-800">{order.user?.email}</p>
                    </div>

                    {/* Status Section with Badge */}
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600 font-medium">Status:</p>
                        <span
                            className={`px-3 py-1 rounded-full text-white font-semibold ${order.status === "pending" ? "bg-red-500" : "bg-green-500"}`}
                        >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </div>

                    {/* Button to update status */}
                    <div className="mt-6">
                        {order.status === "pending" ? (
                            <button
                                onClick={handleStatusChange}
                                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating..." : "Mark as Completed"}
                            </button>
                        ) : (
                            <p className="text-center text-gray-600">Status cannot be changed</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateOrderModal;
