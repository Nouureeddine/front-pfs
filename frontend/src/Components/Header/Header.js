import React, { useState } from 'react';
import StaticAuditScene from '../../scenes/Audit/StaticAudit';
import DynamicAuditScene from '../../scenes/Audit/DynamicAudit';
import StatsGrid from '../StatsGrid/StatsGrid'; // ✅ Make sure this path is correct
import './Header.css';

// 🎯 AuditCloud Logo Component
const AuditCloudLogo = ({ size = "small" }) => {
  const dimensions = size === "large" ? { width: 200, height: 60 } : { width: 150, height: 45 };
  
  return (
    <div className="header-logo-container">
      <svg width={dimensions.width} height={dimensions.height} viewBox="0 0 200 60">
        {/* Cloud shape */}
        <path
          d="M45 25c0-8.284-6.716-15-15-15-6.34 0-11.756 3.933-13.97 9.472C14.78 18.832 13.18 18.5 11.5 18.5 6.806 18.5 3 22.306 3 27s3.806 8.5 8.5 8.5h33c5.523 0 10-4.477 10-10s-4.477-10-10-10z"
          fill="#3498db"
          opacity="0.8"
        />
        
        {/* Checkmark inside cloud */}
        <path
          d="M20 27l4 4 8-8"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Magnifying glass */}
        <circle
          cx="42"
          cy="22"
          r="4"
          stroke="#2980b9"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="45"
          y1="25"
          x2="47"
          y2="27"
          stroke="#2980b9"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Text */}
        <text x="65" y="25" fontSize="18" fontWeight="700" fill="#2c3e50" fontFamily="system-ui, -apple-system, sans-serif">
          Audit
        </text>
        <text x="65" y="42" fontSize="18" fontWeight="400" fill="#3498db" fontFamily="system-ui, -apple-system, sans-serif">
          Cloud
        </text>
        
        {/* Decorative dots */}
        <circle cx="170" cy="15" r="2" fill="#3498db" opacity="0.6" />
        <circle cx="180" cy="20" r="1.5" fill="#3498db" opacity="0.4" />
        <circle cx="175" cy="30" r="1" fill="#3498db" opacity="0.3" />
      </svg>
    </div>
  );
};

// ✅ Mock data – replace with real audits/stats from context or props
const allAudits = [
  {
    id: '001',
    name: 'AWS Compliance 🛡️',
    date: '2023-05-15',
    status: 'Completed',
    score: 92,
    findings: 2,
  },
  {
    id: '002',
    name: 'GDPR Review 📋',
    date: '2023-05-18',
    status: 'In Progress',
    score: 74,
    findings: 5,
  },
  {
    id: '003',
    name: 'ISO 27001 🔒',
    date: '2023-05-20',
    status: 'Pending',
    score: null,
    findings: 0,
  },
];

// ✅ Example stats with emojis
const auditStats = [
  { title: 'Total Audits 📊', value: allAudits.length, change: '+2', trend: 'up' },
  { title: 'Completed Audits ✅', value: allAudits.filter(a => a.status === 'Completed').length, change: '+1', trend: 'up' },
  { title: 'Pending Audits ⏳', value: allAudits.filter(a => a.status === 'Pending').length, change: '0', trend: 'down' },
  {
    title: 'Average Score 🎯',
    value: (() => {
      const scores = allAudits.map(a => a.score).filter(Boolean);
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 'N/A';
      return typeof avg === 'number' ? `${avg}%` : avg;
    })(),
    change: '+5%',
    trend: 'up',
  },
];

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [auditType, setAuditType] = useState('static');
  const [showAuditScene, setShowAuditScene] = useState(false);

  const closeAuditModal = () => {
    setIsModalOpen(false);
    setShowAuditScene(false);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
  };

  const handleBeginAudit = () => {
    setShowAuditScene(true);
  };

  const handleExport = (format) => {
    // TODO: Replace with real export logic
    alert(`Exporting as ${format}... 📤`);
    closeReportModal();
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="header-left">
          <AuditCloudLogo />
          <h1>Dashboard Overview 📈</h1>
        </div>
        <div className="user-actions">
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            🚀 New Audit Now
          </button>
          <button className="btn-secondary" onClick={() => setShowReportModal(true)}>
            📊 Generate Report
          </button>
        </div>
      </header>

      {/* Audit Creation Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeAuditModal}>×</button>

            {!showAuditScene ? (
              <>
                <h2>🎯 Choose Audit Type</h2>
                <select value={auditType} onChange={(e) => setAuditType(e.target.value)}>
                  <option value="static">🔍 Static Audit</option>
                  <option value="dynamic">⚡ Dynamic Audit</option>
                </select>
                <button className="btn-primary" onClick={handleBeginAudit}>
                  ▶️ Proceed
                </button>
              </>
            ) : (
              <>
                {auditType === 'static' && <StaticAuditScene onClose={closeAuditModal} />}
                {auditType === 'dynamic' && <DynamicAuditScene onClose={closeAuditModal} />}
              </>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeReportModal}>×</button>
            <h2>📋 Audit Report Summary</h2>

            <table className="report-summary-table">
              <thead>
                <tr>
                  <th>#️⃣</th>
                  <th>📊 Metric</th>
                  <th>📈 Value</th>
                  <th>📉 Change</th>
                </tr>
              </thead>
              <tbody>
                {auditStats.map((stat, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{stat.title}</td>
                    <td>{stat.value}</td>
                    <td style={{ color: stat.trend === 'up' ? '#16a34a' : '#dc2626' }}>
                      {stat.change} {stat.trend === 'up' ? '📈' : '📉'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✅ Audits Table */}
            <div className="audit-table-wrapper">
              <h3>🗂️ Recent Audits</h3>
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>🏷️ Name</th>
                    <th>📅 Date</th>
                    <th>📌 Status</th>
                    <th>🎯 Score</th>
                    <th>🔍 Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {allAudits.map((audit) => (
                    <tr key={audit.id}>
                      <td>{audit.name}</td>
                      <td>{audit.date}</td>
                      <td>
                        <span className={`status-badge ${audit.status.toLowerCase().replace(' ', '-')}`}>
                          {audit.status === 'Completed' && '✅ '}
                          {audit.status === 'In Progress' && '🔄 '}
                          {audit.status === 'Pending' && '⏳ '}
                          {audit.status}
                        </span>
                      </td>
                      <td>{audit.score ? `${audit.score}% 🎯` : 'N/A'}</td>
                      <td>{audit.findings} {audit.findings > 0 ? '⚠️' : '✅'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Export Options */}
            <div style={{ marginTop: '1.5rem' }}>
              <p><strong>📤 Export As:</strong></p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button className="btn-secondary" onClick={() => handleExport('PDF')}>
                  📄 PDF
                </button>
                <button className="btn-secondary" onClick={() => handleExport('CSV')}>
                  📊 CSV
                </button>
                <button className="btn-secondary" onClick={() => handleExport('JSON')}>
                  🔧 JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;