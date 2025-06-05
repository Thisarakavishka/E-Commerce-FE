import axios from "axios";

const API_URL = import.meta.env.VITE_PRODUCT_API_URL || "http://localhost:5001/api/products";

export const fetchProducts = async (token: string) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products", error);
        return [];
    }
};

export const fetchActiveProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/active`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products", error);
        return [];
    }
};

export const fetchProductById = async (id: string, token: string) => {
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

export const createProduct = async (productData: FormData, token: string) => {
    try {
        const response = await axios.post(API_URL, productData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product", error);
        throw error;
    }
};

export const updateProduct = async (id: string, productData: FormData, token: string) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, productData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating product with ID ${id}`, error);
        throw error;
    }
};

export const toggleProductStatus = async (id: string, token: string) => {
    try {
        const response = await axios.patch(
            `${API_URL}/${id}/status`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error toggling product status", error);
        throw error;
    }
};

export const deleteProduct = async (id: string, token: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting product", error);
        throw error;
    }
};
