// src/components/admin/Header.jsx
import React from 'react';
import { Menu, Search } from 'lucide-react';

const Header = ({ toggleSidebar, searchTerm, setSearchTerm }) => {
  return (
    <header className="header">
      <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <Menu size={24} />
      </button>
      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search products, orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="header-actions">
        <div className="user-profile">
          <div className="user-avatar">AD</div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;