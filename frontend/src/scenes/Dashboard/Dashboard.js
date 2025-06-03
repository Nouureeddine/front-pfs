

// src/scenes/Dashboard/Dashboard.js
import React from 'react';
import './Dashboard.css';
import Header from '../../Components/Header/Header';
import StatsGrid from '../../Components/StatsGrid/StatsGrid';
import RecentAudits from '../../Components/RecentAudits/RecentAudits';
import { stats, recentAudits } from './data/mockData';

const Dashboard = () => (
  <div className="dashboard-content">
    <Header />
    <StatsGrid stats={stats} />
    <RecentAudits recentAudits={recentAudits} />
  </div>
);

export default Dashboard;

