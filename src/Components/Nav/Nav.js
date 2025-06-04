import React from 'react';
import './Nav.css';

export default function Nav({ setActiveTab, activeTab }) {
  const handleLogout = () => {
    // Add your logout logic here
    if (true) {
      // Clear any stored authentication tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirect to login page or reload
      window.location.href = '/'; // or window.location.reload();
    }
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
          <span>Docs</span>
        </li>
      </ul>

      {/* Logout section at the bottom */}
      <div className="nav-footer">
        <button 
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <span className="logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}