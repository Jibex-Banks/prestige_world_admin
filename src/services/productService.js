// src/services/productService.js
import api from './api';

export const productService = {
  // Get all products
  getAllProducts: async () => {
    return await api.get('/products');
  },

  // Get single product
  getProduct: async (id) => {
    return await api.get(`/product/${id}`);
  },

  // Create product
  createProduct: async (productData) => {
    return await api.post('/addProduct', productData);
  },

  // Update product
  updateProduct: async (id, productData) => {
    return await api.put(`/updateProduct/${id}`, productData);
  },

  // Delete product
  deleteProduct: async (id) => {
    return await api.delete(`/deleteProduct/${id}`);
  },

  // Get Image url
  imageUrl: async ()=>{
    return await api.get("/uploadUrl");
  },

  // Upload product image
  uploadImage: async (file) => {
    return await api.uploadFile('/upload', file);
  },

  // Search products
  searchProducts: async (query) => {
    return await api.get(`/products/search?q=${query}`);
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    return await api.get(`/products/category/${category}`);
  },

  // Update stock
  updateStock: async (id, stock) => {
    return await api.put(`/products/${id}/stock`, { stock });
  },
};
