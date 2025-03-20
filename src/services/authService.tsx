import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

export const loginUser = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
};

export const fetchUserProfile = async (token: string) => {
    const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
