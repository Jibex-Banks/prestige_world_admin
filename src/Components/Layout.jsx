// src/components/admin/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="admin-container">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        <div className="content-area">
          <Outlet context={{ searchTerm }} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;