import axios from "axios";

const API_URL = import.meta.env.VITE_CATEGORY_API_URL || "http://localhost:5001/api/category";

export const fetchCategories = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories", error);
        return [];
    }
};

export const fetchActiveCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/active`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories", error);
        return [];
    }
};

export const fetchCategoryById = async (id: string, token: string) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching category with ID ${id}`, error);
        throw error;
    }
};

export const createCategory = async (categoryData: { name: string; description?: string }, token: string) => {
    try {
        const response = await axios.post(API_URL, categoryData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating category", error);
        throw error;
    }
};

export const updateCategory = async (id: string, categoryData: { name: string; description?: string }, token: string) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, categoryData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating category with ID ${id}`, error);
        throw error;
    }
};

export const toggleCategoryStatus = async (id: string, token: string) => {
    try {
        const response = await axios.patch(
            `${API_URL}/${id}/status`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error toggling category status", error);
        throw error;
    }
};

export const deleteCategory = async (id: string, token: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting category", error);
        throw error;
    }
};