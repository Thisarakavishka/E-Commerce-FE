import React, { useEffect, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { fetchOrders } from "../../services/orderService";
import ViewOrderModal from "../../components/modals/ViewOrderModal";
import UpdateOrderModal from "../../components/modals/UpdateOrderModal";  // Import UpdateOrderModal
import { Order } from "../../models/Order";

const Orders = () => {
    const token = localStorage.getItem("token");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for Update Modal
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const loadOrders = async () => {
        if (token) {
            try {
                const data = await fetchOrders(token);
                setOrders(data);
                setFilteredOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        } else {
            console.error("No token found");
        }
    };

    useEffect(() => {
        loadOrders();
    }, [token]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase().trim();
        setSearchTerm(term);

        if (!term) {
            setFilteredOrders(orders);
            return;
        }

        const filtered = orders.filter((order) =>
            order._id.toLowerCase().includes(term) ||
            (order.user?.email?.toLowerCase().includes(term) ?? false)
        );

        setFilteredOrders(filtered);
    };

    const openViewModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => setIsViewModalOpen(false);

    const openUpdateModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => setIsUpdateModalOpen(false);

    return (
        <div className="p-2">
            <h3 className="text-sm text-gray-500 px-2">All Orders</h3>
            <hr className="my-2 border-gray-200" />
            <div className="flex justify-between items-center mt-3 px-2">
                <div className="flex items-baseline gap-2">
                    <h1 className="text-2xl font-bold text-black">Orders</h1>
                    <span className="text-gray-600 text-2xl">{orders.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search Orders"
                        className="p-2 border px-5 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 w-80"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="mt-4 px-1">
                <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="p-3 text-left text-xs font-semibold">#</th>
                            <th className="p-3 text-left text-xs font-semibold">Name</th>
                            <th className="p-3 text-center text-xs font-semibold">Items</th>
                            <th className="p-3 text-center text-xs font-semibold">Total</th>
                            <th className="p-3 text-center text-xs font-semibold">Status</th>
                            <th className="p-3 text-center text-xs font-semibold">Method</th>
                            <th className="p-3 text-center text-xs font-semibold">Date</th>
                            <th className="p-3 text-center text-xs font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order, index) => (
                            <tr key={order._id} className="hover:bg-gray-100 transition duration-150">
                                <td className="p-3 text-sm">{index + 1}</td>
                                <td className="p-3 text-sm">{order.user?.email}</td>
                                <td className="p-3 text-sm text-center">{order.items.length}</td>
                                <td className="p-3 text-sm text-center">{order.totalAmount}</td>
                                <td className={`p-3 text-sm text-center ${order.status === "pending" ? "cursor-pointer" : "cursor-not-allowed"}`}>
                                    <span
                                        className={`px-2 py-1 rounded-full text-white font-medium ${order.status === "pending" ? "bg-red-500" : "bg-green-500"}`}
                                        onClick={() => order.status === "pending" && openUpdateModal(order._id)} // Open update modal on click
                                    >
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td className="p-3 text-sm text-center">{order.paymentMethod}</td>
                                <td className="p-3 text-sm text-center">{new Date(order.createdAt).toISOString().split('T')[0]}</td>
                                <td className="p-3 text-center text-lg space-x-3">
                                    <button onClick={() => openViewModal(order._id)}>
                                        <BsEyeFill />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Order Modal */}
            {isViewModalOpen && selectedOrderId && (
                <ViewOrderModal
                    orderId={selectedOrderId}
                    closeModal={closeViewModal}
                />
            )}

            {/* Update Order Modal */}
            {isUpdateModalOpen && selectedOrderId && (
                <UpdateOrderModal
                    orderId={selectedOrderId}
                    closeModal={closeUpdateModal}
                    reloadOrders={loadOrders} // Pass reloadOrders to update the orders list
                />
            )}
        </div>
    );
};

export default Orders;
