// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './Components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import Carousel from './pages/Carousel';
import Featured from './pages/Featured';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import './assets/styles/index.css';


function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes with Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="carousel" element={<Carousel />} />
          <Route path="featured" element={<Featured />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Redirect root to admin */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;