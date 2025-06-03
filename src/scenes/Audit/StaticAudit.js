// src/StaticAuditScene.js
import React, { useState } from 'react';
import './Audit.css'; // Import CSS module

const StaticAuditScene = ({ onClose }) => {
  const [terraformContent, setTerraformContent] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => setTerraformContent(event.target.result);
    if (file) reader.readAsText(file);
  };

  const handleAudit = () => {
    if (!terraformContent.trim()) {
      alert('Please provide Terraform content.');
      return;
    }

    console.log('Auditing with:', terraformContent);
    alert('Static audit complete!');
    onClose();
  };

  return (
    <div className="static-audit-container">
      <h3>Static Audit</h3>
      
      <label className="static-audit-label">Terraform Content</label>
      <textarea
        className="static-audit-textarea"
        rows={12}
        placeholder="Paste your Terraform code here..."
        value={terraformContent}
        onChange={(e) => setTerraformContent(e.target.value)}
      />

      <label className="static-audit-label">Or Upload Terraform File</label>
      <input
        className="static-audit-file"
        type="file"
        accept=".tf,.txt"
        onChange={handleFileUpload}
      />

      <button className="static-audit-button" onClick={handleAudit}>
        Start Static Audit
      </button>
    </div>
  );
};

export default StaticAuditScene;
