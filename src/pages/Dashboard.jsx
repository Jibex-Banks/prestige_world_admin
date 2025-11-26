// src/pages/admin/Dashboard.jsx
import React from 'react';
import { DollarSign, ShoppingCart, Package, Users, Eye, Edit } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from '../Components/MetricCard';

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

export default Dashboard;