// src/pages/Carousel.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, GripVertical, Eye, Edit, Trash2 } from 'lucide-react';
import CarouselForm from '../Components/carousel/CarouselForm';
import { carouselService } from '../services/carouselService';

// const mockCarouselSlides = [
//   { id: 1, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop', title: 'Summer Sale', subtitle: 'Up to 50% Off', buttonText: 'Shop Now', buttonLink: '/sale', order: 1, active: true },
//   { id: 2, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop', title: 'New Arrivals', subtitle: 'Check out the latest products', buttonText: 'Explore', buttonLink: '/new', order: 2, active: true },
//   { id: 3, image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&h=600&fit=crop', title: 'Premium Collection', subtitle: 'Luxury items for you', buttonText: 'View Collection', buttonLink: '/premium', order: 3, active: false }
// ];

const Carousel = () => {
  const [view, setView] = useState('list');
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Api fetch
  const fetchCarousels = async () =>{
    const CarouselsData = await carouselService.getAllSlides();
    setSlides(CarouselsData.data);
    console.log(CarouselsData.data);
  }

  useEffect(()=>{
    fetchCarousels();
  },[]);

  const handleAdd = () => {
    setSelectedSlide(null);
    setView('add');
  };

  const handleEdit = (slide) => {
    setSelectedSlide(slide);
    setView('edit');
  };

  const handleBack = () => {
    setView('list');
    setSelectedSlide(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try{
        await carouselService.deleteSlide(id);
        fetchCarousels();
      }
      catch(err){
        console.log(err);
      }
    }
  };

  const handleToggleActive = (id) => {
    carouselService.toggleSlideActive();
    fetchCarousels();
    // setSlides(slides.map(s => s.id === id ? { ...s, active: !s.active } : s));    
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newSlides = [...slides];
    const draggedSlide = newSlides[draggedItem];
    newSlides.splice(draggedItem, 1);
    newSlides.splice(index, 0, draggedSlide);
    
    setDraggedItem(index);
    setSlides(newSlides);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSaveSlide = (slideData) => {
    fetchCarousels();
    handleBack();
  };

  if (view === 'add' || view === 'edit') {
    return <CarouselForm mode={view} slide={selectedSlide} onBack={handleBack} onSave={handleSaveSlide} />;
  }

  return (
    <div className="carousel-page">
      <div className="page-header">
        <h1 className="page-title">Carousel Management</h1>
        <button className="btn-primary" onClick={handleAdd}>
          <Plus size={20} />
          Add Slide
        </button>
      </div>

      <div className="info-card">
        <h3>Manage your homepage carousel slides</h3>
        <p>Upload images (recommended: 1920x600px), add text overlays, and arrange the order by dragging.</p>
      </div>

      <div className="carousel-grid">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-card ${draggedItem === index ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="drag-handle">
              <GripVertical size={20} />
            </div>
            
            <div className="carousel-preview">
              <img src={slide.image} alt={slide.title} />
              <div className="carousel-overlay">
                <div className="overlay-content">
                  <h3>{slide.title}</h3>
                  <p>{slide.subtitle}</p>
                  <span className="overlay-button">{slide.buttonText}</span>
                </div>
              </div>
            </div>

            <div className="carousel-info">
              <div className="carousel-details">
                <h4>{slide.title}</h4>
                <p className="carousel-subtitle">{slide.subtitle}</p>
                <div className="carousel-meta">
                  <span className="order-badge">Order: {slide.order}</span>
                  <span className={`status-badge ${slide.active ? 'active' : 'inactive'}`}>
                    {slide.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="carousel-actions">
                <button 
                  className={`btn-icon ${slide.active ? 'active' : ''}`}
                  onClick={() => handleToggleActive(slide.id)}
                  title={slide.active ? 'Deactivate' : 'Activate'}
                >
                  <Eye size={18} />
                </button>
                <button className="btn-icon" onClick={() => handleEdit(slide)}>
                  <Edit size={18} />
                </button>
                <button className="btn-icon danger" onClick={() => handleDelete(slide.id)}>
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

export default Carousel;