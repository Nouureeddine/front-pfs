// src/scenes/Dashboard/components/RecentAudits.js
import './RecentAudits.css'
import React, { useState, useMemo } from 'react';

const AuditModal = ({ audit, onClose }) => {
  if (!audit) return null;

  const getStatusEmoji = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '✅';
      case 'in progress': return '🔄';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  const getSeverityEmoji = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '🟡';
      default: return '📋';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-full" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✖</button>

        <div className="modal-header">
          <h1>📊 {audit.name}</h1>
          <p><strong>📅 Date:</strong> {audit.date}</p>
          <span className={`status-badge ${audit.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {getStatusEmoji(audit.status)} {audit.status}
          </span>
          <div className="score-section">
            <p><strong>🎯 Score:</strong> {audit.score ?? 'N/A'}{audit.score ? '%' : ''}</p>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ 
                  width: `${audit.score || 0}%`,
                  backgroundColor: audit.score >= 80 ? '#4caf50' : audit.score >= 60 ? '#ff9800' : '#f44336'
                }} 
              />
            </div>
          </div>
        </div>

        <div className="modal-section">
          <h2>📋 Summary</h2>
          <div className="info-grid">
            <p><strong>👤 Owner:</strong> {audit.owner ?? 'Unassigned'}</p>
            <p><strong>⏱️ Duration:</strong> {audit.duration ?? 'N/A'}</p>
            <p><strong>🏷️ Tags:</strong> {(audit.tags ?? []).join(', ') || 'None'}</p>
            <p><strong>📝 Notes:</strong> {audit.notes ?? 'No notes provided.'}</p>
          </div>
        </div>

        <div className="modal-section">
          <h2>🔍 Findings ({audit.findings?.length || 0})</h2>
          {audit.findings && audit.findings.length > 0 ? (
            audit.findings.map((finding, idx) => (
              <div key={idx} className={`finding-box ${finding.severity.toLowerCase()}`}>
                <p><strong>{getSeverityEmoji(finding.severity)} Issue:</strong> {finding.issue}</p>
                <p><strong>📊 Severity:</strong> {finding.severity}</p>
                <p><strong>📄 Description:</strong> {finding.description ?? 'No description'}</p>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>✅ No findings recorded - Great job!</p>
            </div>
          )}
        </div>

        <div className="modal-section">
          <h2>🔧 Remediation Steps</h2>
          {audit.remediation && audit.remediation.length > 0 ? (
            audit.remediation.map((step, idx) => (
              <div key={idx} className="remediation-step">
                <p><strong>⚡ Action:</strong> {step.action}</p>
                <p><strong>📌 Status:</strong> {step.status}</p>
                <p><strong>👨‍💼 Assigned To:</strong> {step.assignee ?? 'Unassigned'}</p>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>📝 No remediation steps available.</p>
            </div>
          )}
        </div>

        <div className="modal-section">
          <h2>📊 Metadata</h2>
          <div className="metadata-grid">
            <p><strong>👨‍💻 Created By:</strong> {audit.createdBy ?? 'Unknown'}</p>
            <p><strong>🔄 Last Updated:</strong> {audit.updatedAt ?? 'Unknown'}</p>
            <p><strong>🆔 Audit ID:</strong> <code>{audit.id}</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentAudits = ({ recentAudits = [] }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAudit, setSelectedAudit] = useState(null);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(recentAudits.map(audit => audit.status));
    return ['All', ...Array.from(statuses)];
  }, [recentAudits]);

  const filteredAudits = useMemo(() => {
    if (statusFilter === 'All') return recentAudits;
    return recentAudits.filter(audit => audit.status === statusFilter);
  }, [statusFilter, recentAudits]);

  const getStatusEmoji = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '✅';
      case 'in progress': return '🔄';
      case 'pending': return '⏳';
      default: return '📋';
    }
  };

  const renderStatusBadge = (status) => {
    const className = `status-badge ${status.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <span className={className}>
        {getStatusEmoji(status)} {status}
      </span>
    );
  };

  const renderActions = (audit) => (
    <div className="actions">
      <button 
        className="btn-icon view-btn" 
        aria-label={`View audit ${audit.name}`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedAudit(audit);
        }}
      >
        👁️
      </button>
      <button 
        className="btn-icon edit-btn" 
        aria-label={`Edit audit ${audit.name}`}
        onClick={(e) => e.stopPropagation()}
      >
        ✏️
      </button>
    </div>
  );

  return (
    <section className="recent-audits">
      <div className="header-row">
        <h2>📊 Recent Audits ({filteredAudits.length})</h2>
        <div className="filter">
          <label htmlFor="statusFilter">🔍 Filter by status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>
                {status === 'All' ? '📋 All' : `${getStatusEmoji(status)} ${status}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredAudits.length === 0 ? (
        <div className="no-audits">
          <p>🔍 No audits found for selected status.</p>
          <p>Try adjusting your filter or create a new audit.</p>
        </div>
      ) : (
        <div className="audit-table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>📋 Audit Name</th>
                <th>📅 Date</th>
                <th>📌 Status</th>
                <th>⚡ Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map((audit) => (
                <tr 
                  key={audit.id} 
                  onClick={() => setSelectedAudit(audit)} 
                  className="clickable-row"
                >
                  <td>
                    <div className="audit-name">
                      <span className="name">{audit.name}</span>
                      {audit.score && (
                        <span className="score-indicator">
                          🎯 {audit.score}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{audit.date}</td>
                  <td>{renderStatusBadge(audit.status)}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {renderActions(audit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAudit && (
        <AuditModal
          audit={selectedAudit}
          onClose={() => setSelectedAudit(null)}
        />
      )}
    </section>
  );
};

export default RecentAudits;