import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchOrdersForUser } from "../../services/orderService";
import { Order } from "../../models/Order";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserOrders = async () => {
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const data = await fetchOrdersForUser(token);
                setOrders(data);
            } catch (err) {
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        loadUserOrders();
    }, [token, navigate]);

    const renderOrderStatus = (status: string) => {
        switch (status) {
            case "completed":
                return <span className="bg-green-500 text-white py-1 px-3 rounded">Completed</span>;
            case "canceled":
                return <span className="bg-red-500 text-white py-1 px-3 rounded">Canceled</span>;
            case "pending":
                return <span className="bg-yellow-500 text-white py-1 px-3 rounded">Pending</span>;
            default:
                return <span className="bg-gray-500 text-white py-1 px-3 rounded">Unknown</span>;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear the token
        navigate("/customer/login"); // Redirect to login page
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar toggleCart={() => { }} cartItemCount={0} />

            <div className="container mx-auto px-4 py-8 mt-16">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-xl text-gray-600">Loading orders...</div>
                ) : error ? (
                    <div className="text-center text-xl text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {orders.length === 0 ? (
                            <div className="col-span-3 text-center text-xl text-gray-600">No orders found.</div>
                        ) : (
                            orders.map((order) => (
                                <div key={order._id} className="bg-white shadow-xl rounded-lg p-6 hover:shadow-2xl transition duration-300">
                                    <h3 className="text-xl font-semibold text-gray-800">Order #{order._id}</h3>
                                    <div className="text-sm text-gray-500">Total: ${order.totalAmount}</div>
                                    <div className="text-sm text-gray-500">Payment: {order.paymentMethod}</div>
                                    <div className="mt-2">{renderOrderStatus(order.status)}</div>

                                    <div className="mt-4">
                                        <h4 className="text-lg font-medium text-gray-700">Items:</h4>
                                        <ul>
                                            {order.items.map((item, index) => (
                                                <li key={index} className="flex items-center justify-between text-gray-600 py-2">
                                                    <img
                                                        src={item.product.image} // Assuming 'image' exists
                                                        alt={item.product.name}
                                                        className="w-12 h-12 object-cover rounded-md"
                                                    />
                                                    <span className="flex-1 ml-4">{item.product.name}</span>
                                                    <span className="text-sm">Qty: {item.quantity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default UserProfile;
