// src/components/admin/Sidebar.jsx
import React from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import adminRoutes from '../routes';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logout clicked');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">Prestige Admin</h2>
        </div>
        <nav className="sidebar-nav">
          {adminRoutes.map(route => {
            const Icon = route.icon;
            return (
              <Link
                key={route.id}
                to={route.path}
                className={`nav-item ${location.pathname === route.path ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{route.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default Sidebar;