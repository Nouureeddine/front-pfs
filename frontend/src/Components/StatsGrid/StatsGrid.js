// src/scenes/Dashboard/components/StatsGrid.js
import React from 'react';

const StatsGrid = ({ stats }) => (
  <section className="stats-grid">
    {stats.map((stat, index) => (
      <div key={index} className="stat-card">
        <h3>{stat.title}</h3>
        <div className="stat-value">{stat.value}</div>
        <div className={`stat-change ${stat.trend}`}>
          {stat.change} {stat.trend === 'up' ? '↑' : '↓'}
        </div>
      </div>
    ))}
  </section>
);

export default StatsGrid;
