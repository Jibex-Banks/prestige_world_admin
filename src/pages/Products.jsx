// src/pages/Products.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { productService } from '../services/productService';


const Products = () => {
  const [storeProducts, setStoreProducts] = useState([]);

  // Api fetch
  const fetchProducts = async () => {
    const ProductsData = await productService.getAllProducts();
    if (ProductsData != null) {
      setStoreProducts(ProductsData);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const navigate = useNavigate();
  const { searchTerm } = useOutletContext();

  const filteredProducts = storeProducts.filter(product =>
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
                <span className="product-price">₦{product.price}</span>
                <span className={`stock-badge ${product.stock < 10 ? 'low' : ''}`}>
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