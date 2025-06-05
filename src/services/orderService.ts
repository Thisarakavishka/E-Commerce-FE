import axios from "axios";

const API_URL = import.meta.env.VITE_ORDER_API_URL || "http://localhost:5001/api/orders";

export const fetchOrders = async (token: string) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching Orders", error);
        return [];
    }
};

export const fetchOrdersForUser = async (token: string) => {
    try {
        const response = await axios.get(
            `${API_URL}/userOrders`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error) {
        console.error("Error fetching Orders", error);
        return [];
    }
};

export const fetchOrderById = async (id: string, token: string) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with ID ${id}`, error);
        throw error;
    }
};

export const updateOrderStatus = async (id: string, newStatus: string, token: string) => {
    try {
        const response = await axios.patch(
            `${API_URL}/${id}/status`,
            { status: newStatus },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(`Error updating order status for ID ${id}`, error);
        throw error;
    }
};

export const placeOrder = async (cartItems: { _id: string, quantity: number }[], token: string) => {
    try {
        const response = await axios.post(
            API_URL,
            { cartItems },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error placing order", error);
        throw error;
    }
};

export const cancelOrder = async (id: string, token: string): Promise<void> => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${id}/cancel`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            throw new Error("Failed to cancel order")
        }

        return await response.json()
    } catch (error) {
        console.error("Error canceling order:", error)
        throw error
    }
};