// src/services/orderService.js
import api from './api';

export const orderService = {
  // Get all orders
  getAllOrders: async () => {
    return await api.get('/orders');
  },

  // Get single order
  getOrder: async (id) => {
    return await api.get(`/orders/${id}`);
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    return await api.put(`/orders/${id}/status`, { status });
  },

  // Get orders by status
  getOrdersByStatus: async (status) => {
    return await api.get(`/orders/status/${status}`);
  },

  // Get order statistics
  getOrderStats: async () => {
    return await api.get('/orders/stats');
  },

  // Search orders
  searchOrders: async (query) => {
    return await api.get(`/orders/search?q=${query}`);
  },
};