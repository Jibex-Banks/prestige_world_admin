// src/services/carouselService.js
import api from './api';

export const carouselService = {
  // Get all carousel slides
  getAllSlides: async () => {
    return await api.get('/carousels');
  },

  // Get single slide
  getSlide: async (id) => {
    return await api.get(`/carousel/${id}`);
  },

  // Create slide
  createSlide: async (slideData) => {
    return await api.post('/carousel', slideData);
  },

  // Update slide
  updateSlide: async (id, slideData) => {
    return await api.put(`/carousel/${id}`, slideData);
  },

  // Delete slide
  deleteSlide: async (id) => {
    return await api.delete(`/carousel/${id}`);
  },

  // Update slide order
  updateSlideOrder: async (slides) => {
    return await api.post('/carousel/reorder', { slides });
  },

  // Toggle slide active status
  toggleSlideActive: async (id) => {
    return await api.put(`/carousel/${id}/toggle`);
  },
};