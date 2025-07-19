import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050';

// ✅ Register
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error.response?.data || error.message);
        throw error;
    }
};

// ✅ Login
export const login = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, userData);
        return response.data;
    } catch (error) {
        console.error('Error during login:', error.response?.data || error.message);
        throw error;
    }
};
