import React, { useState } from 'react';
import { ArrowLeft, Upload, Plus, Minus, X, Save, Image as ImageIcon, AlertCircle } from 'lucide-react';
import './Product.css';

const AddProductComponent = ({ onBack, onSuccess }) => {
  const [uploadUrl, setUploadUrl] = useState(''); // Set this from backend
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    original_price: '',
    stock: '',
    image: '',
    description: '',
    specification: [{ key: '', value: '' }],
    feature: [{ title: '', description: '' }],
    image_url: [{ url: '' }]
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle main image upload
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      try {
        const response = await fetch(uploadUrl || '/api/upload', {
          method: 'POST',
          body: formDataUpload
        });
        const data = await response.json();
        setFormData(prev => ({ ...prev, image: data.url || data.path }));
        setErrors(prev => ({ ...prev, image: '' }));
      } catch (error) {
        console.error('Upload error:', error);
        setErrors(prev => ({ ...prev, image: 'Failed to upload image' }));
      }
    }
  };

  // Handle additional image uploads
  const handleAdditionalImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...additionalPreviews];
        newPreviews[index] = reader.result;
        setAdditionalPreviews(newPreviews);
      };
      reader.readAsDataURL(file);

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      try {
        const response = await fetch(uploadUrl || '/api/upload', {
          method: 'POST',
          body: formDataUpload
        });
        const data = await response.json();
        updateImageUrl(index, data.url || data.path);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  // Specification handlers
  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specification: [...prev.specification, { key: '', value: '' }]
    }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specification: prev.specification.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      specification: prev.specification.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  // Feature handlers
  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      feature: [...prev.feature, { title: '', description: '' }]
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      feature: prev.feature.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      feature: prev.feature.map((feat, i) =>
        i === index ? { ...feat, [field]: value } : feat
      )
    }));
  };

  // Image URL handlers
  const addImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      image_url: [...prev.image_url, { url: '' }]
    }));
    setAdditionalPreviews(prev => [...prev, '']);
  };

  const removeImageUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      image_url: prev.image_url.filter((_, i) => i !== index)
    }));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const updateImageUrl = (index, value) => {
    setFormData(prev => ({
      ...prev,
      image_url: prev.image_url.map((img, i) =>
        i === index ? { url: value } : img
      )
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.original_price || formData.original_price <= 0) newErrors.original_price = 'Valid original price is required';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.image) newErrors.image = 'Main product image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.text();
        console.log('Success:', result);
        setShowSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setShowSuccess(false);
          if (onSuccess) onSuccess();
          if (onBack) onBack();
        }, 2000);
      } else {
        setErrors({ submit: 'Failed to add product. Please try again.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-container">
      {/* Header */}
      <div className="add-product-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>
        <h1 className="add-product-title">Add New Product</h1>
        <p className="add-product-subtitle">Fill in the details to create a new product listing</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="success-banner">
          <div className="success-content">
            <div className="success-icon">✓</div>
            <div>
              <h3>Product Added Successfully!</h3>
              <p>Your product has been added to the catalog.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{errors.submit}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="add-product-form">
        {/* Main Content Grid */}
        <div className="form-main-grid">
          {/* Left Column - Basic Info */}
          <div className="form-column">
            {/* Basic Information Section */}
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
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home & Living</option>
                  <option value="Sports">Sports & Outdoors</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Beauty">Beauty & Personal Care</option>
                  <option value="Books">Books & Media</option>
                  <option value="Toys">Toys & Games</option>
                </select>
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">
                    Original Price <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon">$</span>
                    <input
                      type="number"
                      step="0.01"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleChange}
                      className={`field-input with-icon ${errors.original_price ? 'error' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.original_price && <span className="field-error">{errors.original_price}</span>}
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Sale Price <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="input-icon">$</span>
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
                <span className="field-hint">Provide a detailed description of the product features and benefits</span>
              </div>
            </div>

            {/* Specifications Section */}
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
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                      className="field-input small"
                      placeholder="Key (e.g., Brand)"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, 'value', e.target.value)}
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

            {/* Features Section */}
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
                        value={feat.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        className="field-input"
                        placeholder="Feature title"
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
                    <textarea
                      value={feat.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      className="field-textarea small"
                      placeholder="Feature description"
                      rows="2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="form-column">
            {/* Main Image Section */}
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
                      <input
                        type="url"
                        value={img.url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="field-input tiny"
                        placeholder="Or paste URL"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onBack}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Adding Product...
              </>
            ) : (
              <>
                <Save size={20} />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductComponent;