import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Nav from '../../Components/Nav/Nav';
import Header from '../../Components/Header/Header';
import StatsGrid from '../../Components/StatsGrid/StatsGrid';
import RecentAudits from '../../Components/RecentAudits/RecentAudits';
import Docs from '../../Components/Docs/Docs';
import RulesManagement from '../../Components/RulesManagement/RulesManagement';
import axios from 'axios';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [auditReports, setAuditReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate stats based on mapped audit reports
  const stats = [
    { title: 'Total Audits', value: auditReports.length, trend: 'up' },
    { title: 'Violations Found', value: auditReports.reduce((acc, report) => acc + (report.findings?.length || 0), 0), trend: 'down' },
    { title: 'Policies Applied', value: 5, trend: 'stable' } // Placeholder, update if API provides this
  ];

  useEffect(() => {
    const fetchAuditReports = async () => {
      try {
        const response = await axios.get('https://auditservice.agreeableplant-e53e6c49.westus2.azurecontainerapps.io/report', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Include token if required
          }
        });
        // Map API response to match RecentAudits structure
        const mappedReports = response.data.map(report => ({
          id: report.report_id,
          name: report.source_file || `Report-${report.report_id}`,
          date: report.generated_at,
          status: report.summary?.total_violations > 0 ? 'In Progress' : 'Completed', // Simplified status logic
          score: report.summary?.total_violations === 0 ? 100 : 100 - (report.summary?.total_violations * 20), // Example scoring
          findings: report.violations || [], // Map violations to findings
          timestamp: report.generated_at,
          reportBlobUrl: `https://auditservice.agreeableplant-e53e6c49.westus2.azurecontainerapps.io/report/${report.report_id}` // Hypothetical URL
        }));
        setAuditReports(mappedReports);
        console.log('Mapped audit reports:', mappedReports);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch audit reports');
        setLoading(false);
      }
    };

    fetchAuditReports();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <Header />
            <StatsGrid stats={stats} />
            <RecentAudits recentAudits={auditReports} />
          </>
        );
      case 'recentAudits':
        return <RecentAudits recentAudits={auditReports} />;
      case 'rulesMg':
        return <RulesManagement />;
      case 'pipelines':
        return (
          <div className="content-placeholder">
            <h2>Triggered by Pipelines</h2>
            <p>Pipeline content will go here...</p>
          </div>
        );
      case 'docs':
        return <Docs />;
      default:
        return (
          <>
            <Header />
            <StatsGrid stats={stats} />
            <RecentAudits recentAudits={auditReports} />
          </>
        );
    }
  };

  return (
    <div className="dashboard-content">
      <Nav activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={onLogout} />
      <div className="main-content">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default Dashboard;