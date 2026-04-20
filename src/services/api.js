// api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  },
});

export const getProducts = async () => {
  try {
    const response = await api.get("/api/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error.response?.data || error.message || error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error.response?.data || error.message || error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addToCart = async ({ produkId, kuantitas }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      "/api/cart/add",
      { produkId, kuantitas },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error.response?.data || error.message || error;
  }
};

export const updateCartItem = async ({ itemId, kuantitas }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(
      `/api/cart/update/${itemId}`,
      { kuantitas },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error.response?.data || error.message || error;
  }
};

export const removeCartItem = async ({ itemId }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/api/cart/remove/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error.response?.data || error.message || error;
  }
};

export const checkCheckoutDate = async ({ tanggal_pengiriman }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      "/api/orders/checkout",
      { tanggal_pengiriman },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error checking checkout date:", error);
    throw error.response?.data || error.message || error;
  }
};

export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    const isFormData = productData instanceof FormData;
    const response = await api.post("/api/products", productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(`/api/products/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};

export default api;
