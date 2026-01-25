// src/components/carousel/CarouselForm.jsx
import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Save, Image } from 'lucide-react';
import { carouselService } from '../../services/carouselService';
import api from '../../services/api';

const CarouselForm = ({ mode, slide, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    button_text: slide?.button_text || '',
    button_link: slide?.button_link || '',
    image_url: slide?.image_url || '',
    active: slide?.active ?? true
  });
  
  const [imagePreview, setImagePreview] = useState(slide?.image_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      try {
        const response = await api.uploadFile("/uploadImage",file);
        const img_url = await response.public_image_url;
        setFormData(prev => ({ ...prev, image_url: img_url }));
        setErrors(prev => ({ ...prev, image: '' }));
      } catch (error) {
        console.error('Upload error:', error);
        setErrors(prev => ({ ...prev, image: 'Failed to upload image' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.image_url) {
      newErrors.image = 'Slide image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }     
    setIsSubmitting(true);
    
    try {
      //API call
      {mode === "edit" ? await carouselService.updateSlide(slide.id,formData) : await carouselService.createSlide(formData)};
      
      // Call parent save handler
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: 'Failed to save slide. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="carousel-form-page">
      <div className="form-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Carousel
        </button>
        <h1 className="page-title">
          {mode === 'edit' ? 'Edit Carousel Slide' : 'Add Carousel Slide'}
        </h1>
      </div>

      {errors.submit && (
        <div className="error-banner">
          <span>{errors.submit}</span>
        </div>
      )}

      <div className="form-container">
        <div className="form-main">
          <div className="form-section">
            <h2 className="section-title">Slide Content</h2>
            
            <div className="form-field">
              <label className="field-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`field-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g., Summer Sale"
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-field">
              <label className="field-label">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="field-input"
                placeholder="e.g., Up to 50% Off"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Button Text</label>
                <input
                  type="text"
                  name="button_text"
                  value={formData.button_text}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="e.g., Shop Now"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Button Link</label>
                <input
                  type="text"
                  name="button_link"
                  value={formData.button_link}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="e.g., /sale"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span>Active (Show on homepage)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-sidebar">
          <div className="form-section sticky">
            <h2 className="section-title">Slide Image *</h2>
            
            <div className="image-upload-large">
              {imagePreview ? (
                <div className="image-preview-large">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image_url: '' }));
                    }}
                  >
                    <X size={18} />
                  </button>
                  <div className="image-overlay-upload">
                    <label className="change-image">
                      <Upload size={20} />
                      <span>Change Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="upload-area-large">
                  <Image size={48} />
                  <h3>Upload Slide Image</h3>
                  <p>Recommended: 1920x600px</p>
                  <span className="upload-hint">PNG, JPG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            {errors.image && <span className="field-error">{errors.image}</span>}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>
          Cancel
        </button>
        <button 
          type="button" 
          className="btn-primary" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="spinner"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              {mode === 'edit' ? 'Update Slide' : 'Add Slide'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CarouselForm;