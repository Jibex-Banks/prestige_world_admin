// src/utils/validators.js
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePrice = (price) => {
  return !isNaN(price) && parseFloat(price) > 0;
};

export const validateStock = (stock) => {
  return !isNaN(stock) && parseInt(stock) >= 0;
};

export const validateImageSize = (file, maxSize = 5 * 1024 * 1024) => {
  return file.size <= maxSize;
};

export const validateImageType = (file) => {
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return acceptedTypes.includes(file.type);
};

export const validateProduct = (product) => {
  const errors = {};

  if (!product.name?.trim()) {
    errors.name = 'Product name is required';
  }

  if (!product.category) {
    errors.category = 'Category is required';
  }

  if (!validatePrice(product.price)) {
    errors.price = 'Valid price is required';
  }

  if (!validatePrice(product.original_price)) {
    errors.original_price = 'Valid original price is required';
  }

  if (!validateStock(product.stock)) {
    errors.stock = 'Valid stock quantity is required';
  }

  if (!product.image) {
    errors.image = 'Main product image is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};