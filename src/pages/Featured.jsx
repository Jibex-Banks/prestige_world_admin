// src/pages/Featured.jsx
import React, { useState } from 'react';
import { Plus, GripVertical, Star, X, Package, ArrowLeft } from 'lucide-react';

const mockFeaturedProducts = [
  { id: 1, name: 'Premium Wireless Headphones', category: 'Electronics', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop', featured: true, order: 1 },
  { id: 2, name: 'Smart Watch Pro', category: 'Electronics', price: 299.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop', featured: true, order: 2 },
  { id: 3, name: 'Designer Sunglasses', category: 'Fashion', price: 149.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop', featured: true, order: 3 }
];

const mockAllProducts = [
  { id: 4, name: 'Running Shoes Elite', category: 'Sports', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop', featured: false },
  { id: 5, name: 'Laptop Backpack', category: 'Accessories', price: 79.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop', featured: false },
  { id: 6, name: 'Wireless Mouse', category: 'Electronics', price: 49.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop', featured: false }
];

const Featured = () => {
  const [view, setView] = useState('list');
  const [featuredProducts, setFeaturedProducts] = useState(mockFeaturedProducts);
  const [allProducts] = useState(mockAllProducts);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleAddFeatured = () => {
    setView('select');
  };

  const handleBack = () => {
    setView('list');
  };

  const handleRemoveFeatured = (id) => {
    if (window.confirm('Remove this product from featured?')) {
      setFeaturedProducts(featuredProducts.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = (product) => {
    const newProduct = { ...product, featured: true, order: featuredProducts.length + 1 };
    setFeaturedProducts([...featuredProducts, newProduct]);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newProducts = [...featuredProducts];
    const draggedProduct = newProducts[draggedItem];
    newProducts.splice(draggedItem, 1);
    newProducts.splice(index, 0, draggedProduct);
    
    setDraggedItem(index);
    setFeaturedProducts(newProducts);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  if (view === 'select') {
    return (
      <div className="featured-select-page">
        <div className="page-header">
          <button className="btn-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back to Featured
          </button>
          <h1 className="page-title">Select Products to Feature</h1>
        </div>

        <div className="products-selection-grid">
          {allProducts.map(product => (
            <div key={product.id} className="selection-card">
              <img src={product.image} alt={product.name} className="selection-image" />
              <div className="selection-info">
                <h4>{product.name}</h4>
                <p className="selection-category">{product.category}</p>
                <span className="selection-price">${product.price}</span>
              </div>
              <button 
                className="btn-add-featured"
                onClick={() => {
                  handleAddProduct(product);
                  handleBack();
                }}
              >
                <Star size={18} />
                Add to Featured
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="featured-page">
      <div className="page-header">
        <h1 className="page-title">Featured Products</h1>
        <button className="btn-primary" onClick={handleAddFeatured}>
          <Plus size={20} />
          Add to Featured
        </button>
      </div>

      <div className="info-card">
        <h3>Manage featured products</h3>
        <p>Select products to showcase on your homepage. Drag to reorder their appearance.</p>
      </div>

      <div className="featured-grid">
        {featuredProducts.map((product, index) => (
          <div
            key={product.id}
            className={`featured-card ${draggedItem === index ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="drag-handle">
              <GripVertical size={20} />
            </div>

            <div className="featured-content">
              <img src={product.image} alt={product.name} className="featured-image" />
              
              <div className="featured-info">
                <div className="featured-badge">
                  <Star size={14} />
                  Featured
                </div>
                <h4>{product.name}</h4>
                <p className="featured-category">{product.category}</p>
                <div className="featured-footer">
                  <span className="featured-price">${product.price}</span>
                  <span className="order-badge">Position: {index + 1}</span>
                </div>
              </div>

              <button 
                className="btn-remove-featured"
                onClick={() => handleRemoveFeatured(product.id)}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {featuredProducts.length === 0 && (
        <div className="empty-state">
          <Package size={64} />
          <h3>No Featured Products</h3>
          <p>Add products to showcase them on your homepage</p>
          <button className="btn-primary" onClick={handleAddFeatured}>
            <Plus size={20} />
            Add Featured Product
          </button>
        </div>
      )}
    </div>
  );
};

export default Featured;