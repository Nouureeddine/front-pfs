import React from 'react';
import './Nav.css';

export default function Nav({ setActiveTab, activeTab }) {
  
  // Logout function
  const handleLogout = () => {
    // Clear authentication tokens/data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // You can also make API call to logout endpoint if needed
    // try {
    //   await fetch('/api/auth/logout', { 
    //     method: 'POST',
    //     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    //   });
    // } catch (error) {
    //   console.error('Logout error:', error);
    // }
    
    // Redirect to login page
    window.location.href = '/login'; // or use your router navigation
    // If using React Router: navigate('/login');
  };

  return (
    <nav className="vertical-nav">
      <div className="nav-header">
        <h1 className="nav-title">AuditCloud</h1>
        <p className="nav-welcome">Welcome Back, Admin!</p>
      </div>
      
      <ul className="nav-menu">
        <li
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span>Launch a new Audit</span>
        </li>
        <li
          className={`nav-item ${activeTab === 'recentAudits' ? 'active' : ''}`}
          onClick={() => setActiveTab('recentAudits')}
        >
          <span>Audits History</span>
        </li>
        <li
          className={`nav-item ${activeTab === 'rulesMg' ? 'active' : ''}`}
          onClick={() => setActiveTab('rulesMg')}
        >
          <span>Rules Management</span>
        </li>
        <li
          className={`nav-item ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <span>Triggered by Pipelines</span>
        </li>
        <li
          className={`nav-item ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <span>Docs</span>
        </li>
      </ul>
      
      {/* Logout Button */}
      <div className="nav-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}