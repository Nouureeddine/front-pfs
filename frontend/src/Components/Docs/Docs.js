// src/scenes/Docs/Docs.js
import React from 'react';
import './Docs.css';

const Docs = () => {
  return (
    <div className="docs-container">
      <h1>📘 About AuditCloud</h1>
      <p>
        <strong>AuditCloud</strong> is a modern platform that enables teams to efficiently perform infrastructure audits using Terraform code.
        It automates the evaluation of compliance, security, and configuration policies with clarity and speed.
      </p>

      <h2>🔧 Key Features</h2>
      <ul>
        <li>Upload or paste Terraform code for auditing</li>
        <li>Instant analysis and compliance checks</li>
        <li>View audit history and statuses</li>
        <li>Generate professional audit reports</li>
        <li>Track critical issues and progress metrics</li>
      </ul>

      <h2>🔗 Useful Links</h2>
      <ul>
        <li>
          <a href="https://github.com/your-org/auditcloud" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </a>
        </li>
        <li>
          <a href="/docs/user-guide">User Guide</a>
        </li>
        <li>
          <a href="/settings">Project Settings</a>
        </li>
        <li>
          <a href="/contact">Contact Support</a>
        </li>
      </ul>

      <h2>📬 Contact</h2>
      <p>
        If you encounter issues or have questions, reach out via the <a href="/contact">Contact</a> page or email us at <code>support@auditcloud.io</code>.
      </p>
    </div>
  );
};

export default Docs;
