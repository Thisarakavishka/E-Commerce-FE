import axios from "axios";

const API_URL = import.meta.env.VITE_USER_API_URL || "http://localhost:5001/api/users";

export const fetchCustomers = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/customers`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching Customers", error);
        return [];
    }
};

export const fetchCustomerById = async (id: string, token: string) => {
    try {
        const response = await axios.get(`${API_URL}/customers/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching customer with ID ${id}`, error);
        throw error;
    }
};
