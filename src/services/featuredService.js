// src/services/featuredService.js
import api from './api';

export const featuredService = {
  // Get all featured products
  getFeaturedProducts: async () => {
    return await api.get('/featured');
  },

  // Add product to featured
  addToFeatured: async (productId) => {
    return await api.post('/admin/featured', { productId });
  },

  // Remove from featured
  removeFromFeatured: async (productId) => {
    return await api.delete(`/admin/featured/${productId}`);
  },

  // Update featured order
  updateFeaturedOrder: async (products) => {
    return await api.post('/admin/featured/reorder', { products });
  },
};