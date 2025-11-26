// src/components/admin/MetricCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ icon: Icon, title, value, change, positive = true }) => {
  return (
    <div className="metric-card">
      <div className="metric-icon">
        <Icon size={24} />
      </div>
      <div className="metric-content">
        <p className="metric-title">{title}</p>
        <h2 className="metric-value">{value}</h2>
        <span className={`metric-change ${positive ? 'positive' : 'negative'}`}>
          {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change}
        </span>
      </div>
    </div>
  );
};

export default MetricCard;