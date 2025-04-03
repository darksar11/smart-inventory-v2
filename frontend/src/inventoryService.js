import axios from 'axios';

const API_URL = '/api/inventory';

// Get all products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get inventory summary
export const getInventorySummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/summary`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    throw error;
  }
};

// Get a single product
export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.patch(`${API_URL}/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

// Update product thresholds
export const updateProductThresholds = async (id, thresholdData) => {
  try {
    const response = await axios.patch(`${API_URL}/products/${id}/thresholds`, thresholdData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product thresholds ${id}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};