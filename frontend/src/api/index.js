// frontend/src/index.js

import axios from "axios";

const API = axios.create({ 
    baseURL: "http://localhost:5000/api/inventory", // ✅ Updated baseURL
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token interceptor (optional, if you plan to add auth)
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ✅ Use routes that match backend
export const getInventory = () => API.get("/products");
export const addProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.patch(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
