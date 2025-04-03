import axios from "axios";

const API = axios.create({ 
    baseURL: "http://localhost:5000",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor for potential future authentication
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getInventory = () => API.get("/inventory");
export const addProduct = (data) => API.post("/inventory/add", data);
export const updateProduct = (id, data) => API.put(`/inventory/update/${id}`, data);
export const deleteProduct = (id) => API.delete(`/inventory/delete/${id}`);