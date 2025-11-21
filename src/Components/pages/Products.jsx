import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Menu, X, Package, ShoppingCart, Users, DollarSign, TrendingUp, Eye, Edit, Trash2, Plus, Search, Filter, ChevronDown, LogOut, Home, Image, Star, Settings } from 'lucide-react';
import AddProductComponent from './AddProduct';
import { useNavigate } from 'react-router-dom';
// import './admin-styles.css';

// Mock Data
const mockSalesData = [
  { date: 'Mon', revenue: 4200 },
  { date: 'Tue', revenue: 3800 },
  { date: 'Wed', revenue: 5100 },
  { date: 'Thu', revenue: 4600 },
  { date: 'Fri', revenue: 6200 },
  { date: 'Sat', revenue: 7500 },
  { date: 'Sun', revenue: 6800 }
];

const mockCategoryData = [
  { name: 'Electronics', value: 450, color: '#8A2BE2' },
  { name: 'Fashion', value: 320, color: '#FF66B2' },
  { name: 'Home', value: 180, color: '#FFD700' },
  { name: 'Sports', value: 150, color: '#20B2AA' }
];

const mockTopProducts = [
  { id: 1, name: 'Premium Wireless Headphones', sales: 156, revenue: 31200, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
  { id: 2, name: 'Smart Watch Pro', sales: 142, revenue: 28400, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' },
  { id: 3, name: 'Designer Sunglasses', sales: 98, revenue: 19600, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop' },
  { id: 4, name: 'Running Shoes Elite', sales: 87, revenue: 17400, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' }
];

const mockRecentOrders = [
  { id: '#ORD-1001', customer: 'John Doe', amount: 249.99, status: 'Delivered', date: '2024-11-07' },
  { id: '#ORD-1002', customer: 'Jane Smith', amount: 189.50, status: 'Processing', date: '2024-11-07' },
  { id: '#ORD-1003', customer: 'Mike Johnson', amount: 399.99, status: 'Shipped', date: '2024-11-06' },
  { id: '#ORD-1004', customer: 'Sarah Williams', amount: 159.00, status: 'Pending', date: '2024-11-06' },
  { id: '#ORD-1005', customer: 'Tom Brown', amount: 299.99, status: 'Processing', date: '2024-11-05' }
];

const mockProducts = [
  { id: 1, name: 'Premium Wireless Headphones', category: 'Electronics', price: 199.99, stock: 45, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
  { id: 2, name: 'Smart Watch Pro', category: 'Electronics', price: 299.99, stock: 32, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' },
  { id: 3, name: 'Designer Sunglasses', category: 'Fashion', price: 149.99, stock: 67, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop' },
  { id: 4, name: 'Running Shoes Elite', category: 'Sports', price: 129.99, stock: 28, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop' },
  { id: 5, name: 'Laptop Backpack', category: 'Accessories', price: 79.99, stock: 54, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop' }
];



// Main App Component
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="admin-container">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="content-area">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'products' && <Products searchTerm={searchTerm} />}
          {currentPage === 'orders' && <Orders />}
          {currentPage === 'carousel' && <CarouselManager />}
          {currentPage === 'featured' && <FeaturedProducts />}
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen, currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'carousel', icon: Image, label: 'Carousel' },
    { id: 'featured', icon: Star, label: 'Featured' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">Prestige Admin</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};

// Header Component
const Header = ({ toggleSidebar, searchTerm, setSearchTerm }) => {
  return (
    <header className="header">
      <button className="menu-btn" onClick={toggleSidebar}>
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

// Dashboard Component
const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard Overview</h1>
      
      {/* Metrics Cards */}
      <div className="metrics-grid">
        <MetricCard
          icon={DollarSign}
          title="Total Revenue"
          value="$48,562"
          change="+12.5%"
          positive={true}
        />
        <MetricCard
          icon={ShoppingCart}
          title="Total Orders"
          value="1,247"
          change="+8.2%"
          positive={true}
        />
        <MetricCard
          icon={Package}
          title="Total Products"
          value="342"
          change="+5"
          positive={true}
        />
        <MetricCard
          icon={Users}
          title="Total Customers"
          value="8,234"
          change="+15.3%"
          positive={true}
        />
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card revenue-chart">
          <div className="chart-header">
            <h3>Revenue Trend</h3>
            <select className="chart-select">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 12 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
              <YAxis stroke="var(--color-text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-card-bg)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card category-chart">
          <div className="chart-header">
            <h3>Sales by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {mockCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="data-tables">
        <div className="table-card">
          <h3>Top Products</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Sales</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {mockTopProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <img src={product.image} alt={product.name} />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.sales}</td>
                  <td>${product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <h3>Recent Orders</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>${order.amount}</td>
                  <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, title, value, change, positive }) => {
  return (
    <div className="metric-card">
      <div className="metric-icon">
        <Icon size={24} />
      </div>
      <div className="metric-content">
        <p className="metric-title">{title}</p>
        <h2 className="metric-value">{value}</h2>
        <span className={`metric-change ${positive ? 'positive' : 'negative'}`}>
          <TrendingUp size={16} />
          {change}
        </span>
      </div>
    </div>
  );
};

// Products Component
const Products = ({ searchTerm }) => {  
  const navigate = new useNavigate();
  
  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title">Products Management</h1>
        <button className="btn-primary" onClick={() => navigate('/add-product')}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <div className="product-details">
                <span className="product-price">${product.price}</span>
                <span className={`stock-badge ${product.stock < 30 ? 'low' : ''}`}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="product-actions">
                <button className="btn-icon"><Eye size={18} /></button>
                <button className="btn-icon"><Edit size={18} /></button>
                <button className="btn-icon danger"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Orders Component
const Orders = () => {
  return (
    <div className="orders-page">
      <h1 className="page-title">Orders Management</h1>
      
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRecentOrders.map(order => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong></td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>${order.amount}</td>
                <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon"><Eye size={18} /></button>
                    <button className="btn-icon"><Edit size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Carousel Manager Component
const CarouselManager = () => {
  return (
    <div className="carousel-page">
      <div className="page-header">
        <h1 className="page-title">Carousel Management</h1>
        <button className="btn-primary">
          <Plus size={20} />
          Add Slide
        </button>
      </div>
      <div className="info-card">
        <h3>Manage your homepage carousel slides</h3>
        <p>Upload images (recommended: 1920x600px), add text overlays, and arrange the order.</p>
      </div>
    </div>
  );
};

// Featured Products Component
const FeaturedProducts = () => {
  return (
    <div className="featured-page">
      <div className="page-header">
        <h1 className="page-title">Featured Products</h1>
        <button className="btn-primary">
          <Plus size={20} />
          Add to Featured
        </button>
      </div>
      <div className="info-card">
        <h3>Manage featured products</h3>
        <p>Select products to showcase on your homepage. Drag to reorder.</p>
      </div>
    </div>
  );
};


export default AdminDashboard;