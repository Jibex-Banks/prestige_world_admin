// src/pages/Products.jsx
import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { productService } from '../services/productService';


const Products = () => {

  
  const [mockProducts,setMockProducts ]= useState([
    { id: 1, name: 'Premium Wireless Headphones', category: 'Electronics', price: 199.99, stock: 45, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
    { id: 2, name: 'Smart Watch Pro', category: 'Electronics', price: 299.99, stock: 32, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' },
    { id: 3, name: 'Designer Sunglasses', category: 'Fashion', price: 149.99, stock: 67, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop' },
    { id: 4, name: 'Running Shoes Elite', category: 'Sports', price: 129.99, stock: 28, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' },
    { id: 5, name: 'Laptop Backpack', category: 'Accessories', price: 79.99, stock: 54, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop' }
  ]);

  const getProducts = productService.getAllProducts();

  if(getProducts.data >= 1 || getProducts.data != null){
    setMockProducts(getProducts.data);
  }

  const navigate = useNavigate();
  const { searchTerm } = useOutletContext();

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product:', id);
      // Implement delete logic
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">Products Management</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/products/add')}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <div className="product-details">
                <span className="product-price">${product.price}</span>
                <span className={`stock-badge ${product.stock < 30 ? 'low' : ''}`}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="product-actions">
                <button className="btn-icon" title="View">
                  <Eye size={18} />
                </button>
                <button 
                  className="btn-icon" 
                  title="Edit"
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                >
                  <Edit size={18} />
                </button>
                <button 
                  className="btn-icon danger" 
                  title="Delete"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;