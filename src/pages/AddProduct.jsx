// src/pages/AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Minus, X, Save, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { productService } from '../services/productService';
import api from '../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    specification: [{ spec_key: '', spec_value: '' }],
    feature: [{ feature: '' }],
    image_url: [{ image_url: '' }]
  });

  const [imagePreview, setImagePreview] = useState('');
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  /* =======================
     FETCH PRODUCT (EDIT)
  ======================== */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        const res = await productService.getProduct(id);
        const product = res.data;

        setFormData({
          ...product,
          price: String(product.price) || 0,
          stock: String(product.stock) ,
          specification: product.specification || [{ spec_key: '', spec_value: '' }],
          feature: product.feature || [{ feature: '' }],
          image_url: product.image_url || [{ image_url: '' }]
        });

        setImagePreview(product.image);
        setAdditionalPreviews(
          product.image_url?.map(img => img.image_url) || []
        );
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  /* =======================
     HANDLERS
  ======================== */
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const uploadImage = async file => {
    const res = await api.uploadFile('/uploadImage', file);
    return res.public_image_url;
  };

  const handleMainImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be under 5MB' }));
      return;
    }

    setImagePreview(URL.createObjectURL(file));

    try {
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: url }));
      setErrors(prev => ({ ...prev, image: '' }));
    } catch {
      setErrors(prev => ({ ...prev, image: 'Image upload failed' }));
    }
  };

  /* =======================
     DYNAMIC FIELDS - SPECIFICATIONS
  ======================== */
  const addSpecification = () =>
    setFormData(prev => ({
      ...prev,
      specification: [...prev.specification, { spec_key: '', spec_value: '' }]
    }));

  const removeSpecification = index =>
    setFormData(prev => ({
      ...prev,
      specification: prev.specification.filter((_, i) => i !== index)
    }));

  const updateSpecification = (index, field, value) =>
    setFormData(prev => ({
      ...prev,
      specification: prev.specification.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    }));

  /* =======================
     DYNAMIC FIELDS - FEATURES
  ======================== */
  const addFeature = () =>
    setFormData(prev => ({
      ...prev,
      feature: [...prev.feature, { feature: '' }]
    }));

  const removeFeature = index =>
    setFormData(prev => ({
      ...prev,
      feature: prev.feature.filter((_, i) => i !== index)
    }));

  const updateFeature = (index, value) =>
    setFormData(prev => ({
      ...prev,
      feature: prev.feature.map((f, i) =>
        i === index ? { feature: value } : f
      )
    }));

  /* =======================
     DYNAMIC FIELDS - IMAGE URLs
  ======================== */
  const addImageUrl = () => {
  setFormData(prev => ({
    ...prev,
    image_url: [...prev.image_url, '']
  }));

  setAdditionalPreviews(prev => [...prev, null]);
};

const handleAdditionalImageUpload = async (e, index) => {
  const file = e.target.files[0];
  if (!file) return;

  const preview = URL.createObjectURL(file);

  setAdditionalPreviews(prev => {
    const updated = [...prev];
    updated[index] = preview;
    return updated;
  });

  try {
    const url = await uploadImage(file);
    updateImageUrl(index, url);
  } catch {
    console.error('Failed to upload additional image');
  }
};

  const removeImageUrl = index => {
    setFormData(prev => ({
      ...prev,
      image_url: prev.image_url.filter((_, i) => i !== index)
    }));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index, value) =>
    setFormData(prev => ({
      ...prev,
      image_url: prev.image_url.map((img, i) =>
        i === index ? { image_url: value } : img
      )
    }));

  /* =======================
     VALIDATION
  ======================== */
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name required';
    if (!formData.category) errs.category = 'Category required';
    if (!formData.price || Number(formData.price) <= 0)
      errs.price = 'Invalid price';
    if (formData.stock === '' || Number(formData.stock) < 0)
      errs.stock = 'Invalid stock';
    if (!formData.image) errs.image = 'Main image required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* =======================
     SUBMIT
  ======================== */
  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      specification: formData.specification.filter(
        s => s.spec_key && s.spec_value
      ),
      feature: formData.feature.filter(
        f => f.feature
      ),
      image_url: formData.image_url.filter(
        img => img.image_url
      )
    };

    try {
      if (isEditMode) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save product' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-header">
        <button className="back-button" onClick={() => navigate('/admin/products')}>
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>
        <h1 className="add-product-title">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="add-product-subtitle">
          {isEditMode ? 'Update product details' : 'Fill in the details to create a new product listing'}
        </p>
      </div>

      {showSuccess && (
        <div className="success-banner">
          <div className="success-content">
            <div className="success-icon">✓</div>
            <div>
              <h3>Product {isEditMode ? 'Updated' : 'Added'} Successfully!</h3>
              <p>Your product has been {isEditMode ? 'updated in' : 'added to'} the catalog.</p>
            </div>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-main-grid">
          <div className="form-column">
            {/* Basic Information */}
            <div className="form-card">
              <h2 className="card-title">Basic Information</h2>

              <div className="form-field">
                <label className="field-label">
                  Product Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`field-input ${errors.name ? 'error' : ''}`}
                  placeholder="e.g., Premium Wireless Headphones"
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-field">
                <label className="field-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`field-input ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Select a category</option>
                  <option value="babyproducts">Baby Products</option>
                  <option value="toysngames">Toys & Games</option>
                  <option value="education">Educational Items</option>
                  <option value="clothing">Clothing</option>
                  <option value="others">Others</option>
                </select>
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">
                    Price <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon">₦</span>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`field-input with-icon ${errors.price ? 'error' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && <span className="field-error">{errors.price}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Stock Quantity <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className={`field-input ${errors.stock ? 'error' : ''}`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.stock && <span className="field-error">{errors.stock}</span>}
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="field-textarea"
                  placeholder="Describe your product in detail..."
                  rows="5"
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="form-card">
              <div className="card-header">
                <h2 className="card-title">Specifications</h2>
                <button type="button" className="add-btn" onClick={addSpecification}>
                  <Plus size={16} />
                  Add Spec
                </button>
              </div>

              <div className="dynamic-fields">
                {formData.specification.map((spec, index) => (
                  <div key={index} className="dynamic-field-row">
                    <input
                      type="text"
                      value={spec.spec_key}
                      onChange={e => updateSpecification(index, 'spec_key', e.target.value)}
                      className="field-input small"
                      placeholder="Key (e.g., Brand)"
                    />
                    <input
                      type="text"
                      value={spec.spec_value}
                      onChange={e => updateSpecification(index, 'spec_value', e.target.value)}
                      className="field-input small"
                      placeholder="Value (e.g., Sony)"
                    />
                    {formData.specification.length > 1 && (
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeSpecification(index)}
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="form-card">
              <div className="card-header">
                <h2 className="card-title">Product Features</h2>
                <button type="button" className="add-btn" onClick={addFeature}>
                  <Plus size={16} />
                  Add Feature
                </button>
              </div>

              <div className="dynamic-fields">
                {formData.feature.map((feat, index) => (
                  <div key={index} className="feature-field">
                    <div className="feature-header">
                      <input
                        type="text"
                        value={feat.feature}
                        onChange={e => updateFeature(index, e.target.value)}
                        className="field-input"
                        placeholder="e.g., Adjustable height"
                      />
                      {formData.feature.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeFeature(index)}
                        >
                          <Minus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Images Column */}
          <div className="form-column">
            <div className="form-card sticky">
              <h2 className="card-title">
                Product Images <span className="required">*</span>
              </h2>

              <div className="main-image-upload">
                {imagePreview ? (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setImagePreview('');
                        setFormData(prev => ({ ...prev, image: '' }));
                      }}
                    >
                      <X size={18} />
                    </button>
                    <div className="image-overlay">
                      <label className="change-image">
                        <Upload size={20} />
                        <span>Change Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="upload-area">
                    <ImageIcon size={48} className="upload-icon" />
                    <h3>Upload Main Image</h3>
                    <p>Drag and drop or click to browse</p>
                    <span className="upload-hint">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
              {errors.image && <span className="field-error">{errors.image}</span>}

              {/* Additional Images */}
              <div className="additional-images-section">
                <div className="section-divider">
                  <h3 className="section-subtitle">Additional Images</h3>
                  <button type="button" className="add-btn small" onClick={addImageUrl}>
                    <Plus size={14} />
                    Add Image
                  </button>
                </div>

                <div className="additional-images-grid">
                  {formData.image_url.map((img, index) => (
                    <div key={index} className="additional-image-item">
                      {additionalPreviews[index] ? (
                        <div className="additional-preview">
                          <img src={additionalPreviews[index]} alt={`Additional ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-additional"
                            onClick={() => removeImageUrl(index)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <label className="additional-upload">
                          <Upload size={20} />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAdditionalImageUpload(e, index)}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin/products')}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                {isEditMode ? 'Updating...' : 'Adding Product...'}
              </>
            ) : (
              <>
                <Save size={20} />
                {isEditMode ? 'Update Product' : 'Add Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;