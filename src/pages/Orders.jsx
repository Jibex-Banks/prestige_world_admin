// src/pages/Orders.jsx
import React from 'react';
import { Eye, Edit } from 'lucide-react';

const mockOrders = [
  { id: '#ORD-1001', customer: 'John Doe', amount: 249.99, status: 'Delivered', date: '2024-11-07' },
  { id: '#ORD-1002', customer: 'Jane Smith', amount: 189.50, status: 'Processing', date: '2024-11-07' },
  { id: '#ORD-1003', customer: 'Mike Johnson', amount: 399.99, status: 'Shipped', date: '2024-11-06' },
  { id: '#ORD-1004', customer: 'Sarah Williams', amount: 159.00, status: 'Pending', date: '2024-11-06' },
  { id: '#ORD-1005', customer: 'Tom Brown', amount: 299.99, status: 'Processing', date: '2024-11-05' }
];

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
            {mockOrders.map(order => (
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

export default Orders;