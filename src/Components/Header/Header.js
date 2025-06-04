import React, { useState } from 'react';
import StatsGrid from '../StatsGrid/StatsGrid'; // ✅ Make sure this path is correct
import './Header.css';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Use named import for clarity
import 'jspdf-autotable'; // Side-effect import to extend jsPDF

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

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [file, setFile] = useState(null); // State for the uploaded .json file
  const [loading, setLoading] = useState(false); // State for loading feedback
  const [recentAudits, setRecentAudits] = useState([]); // State for recent audits

  const closeAuditModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setLoading(false);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setRecentAudits([]); // Reset recent audits on close
  };

  const runAudit = async () => {
    if (!file) {
      alert('Please upload a .json plan file to proceed.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('plan', file);

    try {
      const response = await axios.post('https://auditservice.agreeableplant-e53e6c49.westus2.azurecontainerapps.io/api/audit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-user': 'reda', // Include user ID if required
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include token if required
        },
      });
      console.log('Audit response:', response.data);
      alert('Audit run successfully! Check the reports section for results.');
      closeAuditModal();
    } catch (err) {
      console.error('Audit failed:', err);
      alert(`Failed to run audit: ${err.response?.data?.message || err.message}`);
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://auditservice.agreeableplant-e53e6c49.westus2.azurecontainerapps.io/report', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include token if required
        },
      });
      setRecentAudits(response.data); // Assuming response.data is an array of reports
    } catch (err) {
      console.error('Failed to fetch report:', err);
      alert(`Failed to generate report: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getHighestSeverity = (findings) => {
    if (!findings || findings.length === 0) return 'N/A';
    const severityOrder = { high: 3, medium: 2, low: 1 };
    const highest = findings.reduce((max, finding) => {
      const severity = finding.severity?.toLowerCase();
      return severityOrder[severity] > severityOrder[max] ? severity : max;
    }, 'low');
    return highest.charAt(0).toUpperCase() + highest.slice(1);
  };

  const handleExport = (format) => {
    if (!recentAudits || recentAudits.length === 0) {
      alert('No recent audit data available to export.');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (format === 'PDF') {
      const doc = new jsPDF();
      
      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor('#2c3e50');
      doc.text('AuditCloud Audit Report', 20, 20);
      doc.setFontSize(10);
      doc.setTextColor('#7f8c8d');
      doc.text(`Generated: ${new Date().toLocaleString('en-US', { timeZone: 'UTC', hour12: true })}`, 20, 28);
      doc.setDrawColor('#3498db');
      doc.setLineWidth(0.5);
      doc.line(20, 32, 190, 32);

      // Summary Section
      let y = 40;
      doc.setFontSize(12);
      doc.setTextColor('#2c3e50');
      doc.text('Summary', 20, y);
      y += 10;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#34495e');
      const totalAudits = recentAudits.length;
      const averageScore = recentAudits.reduce((sum, audit) => sum + (audit.score || 0), 0) / totalAudits || 0;
      doc.text(`Total Audits: ${totalAudits}`, 20, y);
      y += 10;
      doc.text(`Average Score: ${averageScore.toFixed(1)}%`, 20, y);
      y += 10;
      doc.setDrawColor('#bdc3c7');
      doc.line(20, y, 190, y);
      y += 10;

      // Recent Audits Table
      doc.setFontSize(12);
      doc.text('Recent Audits', 20, y);
      y += 10;
      doc.autoTable({
        startY: y,
        head: [['#', 'Report Name', 'Score']],
        body: recentAudits.map((audit, index) => [
          index + 1,
          audit.source_file || 'Unnamed Audit',
          `${audit.score || 'N/A'}%`
        ]),
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5,
          textColor: '#34495e',
          lineColor: '#bdc3c7',
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: '#3498db',
          textColor: '#ffffff',
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: '#f5f6fa',
        },
        margin: { left: 20, right: 20 },
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor('#3498db');
        doc.text('AuditCloud', 20, 290, { angle: 90 });
        doc.setTextColor('#7f8c8d');
        doc.text(`Page ${i} of ${pageCount}`, 180, 290);
      }

      doc.save(`audit-report-${timestamp}.pdf`);
    } else if (format === 'CSV') {
      const headers = ['Report Name', 'Score'];
      const rows = recentAudits.map(audit => [
        audit.source_file || 'Unnamed Audit',
        `${audit.score || 'N/A'}%`
      ]);
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `audit-report-${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'JSON') {
      const exportData = recentAudits.map(audit => ({
        reportName: audit.source_file || 'Unnamed Audit',
        score: `${audit.score || 'N/A'}%`
      }));
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `audit-report-${timestamp}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
          <button className="btn-secondary" onClick={() => { setShowReportModal(true); generateReport(); }}>
            📊 Generate Report
          </button>
        </div>
      </header>

      {/* Audit Creation Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeAuditModal}>×</button>

            <h2>🎯 Run Static Audit</h2>
            <div style={{ marginTop: '1rem' }}>
              <label htmlFor="auditFile">📥 Upload .json Plan File</label>
              <input
                id="auditFile"
                type="file"
                accept=".json"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button className="btn-primary" onClick={runAudit} disabled={!file || loading}>
              {loading ? 'Running Audit... ⏳' : '▶️ Run Audit'}
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeReportModal}>×</button>
            <h2>📋 Generate Report</h2>

            {/* Export Options */}
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