// src/utils/constants.js
export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports & Outdoors',
  'Accessories',
  'Beauty & Personal Care',
  'Books & Media',
  'Toys & Games',
];

export const ORDER_STATUSES = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const IMAGE_UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
};

export const ROUTES = {
  DASHBOARD: '/admin/dashboard',
  PRODUCTS: '/admin/products',
  PRODUCT_ADD: '/admin/products/add',
  PRODUCT_EDIT: '/admin/products/edit',
  ORDERS: '/admin/orders',
  CAROUSEL: '/admin/carousel',
  FEATURED: '/admin/featured',
  SETTINGS: '/admin/settings',
};