import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
    return (
        <div className="sideBar">
            <div className="links">
                <a href='#'>Dashboard</a>
                <a href='#'>Add Product</a>
                <a href='#'>Products</a>
                <a href='#'>Orders</a>
                <a href='#'>Customers</a>
                <a href='#'>Users</a>
                <a href='#'>Sales</a>
                <a href='#'>Categories</a>
                <a href='#'>Content Management</a>
            </div>
        </div>
    );
}

export default Sidebar;