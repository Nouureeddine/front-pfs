import React, { useState } from 'react';
import StaticAudit from './StaticAudit';
import DynamicAudit from './DynamicAudit';

const Audit = ({ type, terraformContent, onComplete }) => {
  const [formData, setFormData] = useState({
    auditorName: '',
    team: '',
    description: '',
    tags: ''
  });

  const [isStarted, setIsStarted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartAudit = () => {
    if (!formData.auditorName || !formData.team) {
      alert('Please fill in the required fields.');
      return;
    }
    setIsStarted(true);
  };

  if (isStarted) {
    const enrichedProps = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim())
    };

    return type === 'static' ? (
      <StaticAudit
        terraformContent={terraformContent}
        onComplete={onComplete}
        auditMeta={enrichedProps}
      />
    ) : (
      <DynamicAudit
        onComplete={onComplete}
        auditMeta={enrichedProps}
      />
    );
  }

  return (
    <div className="modal-content">
      <h2>Start Audit</h2>
      <label>
        Auditor Name *
        <input
          type="text"
          name="auditorName"
          value={formData.auditorName}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Team / Department *
        <input
          type="text"
          name="team"
          value={formData.team}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Audit Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>

      <label>
        Tags (comma separated)
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />
      </label>

      <button className="btn-primary" onClick={handleStartAudit}>
        Start Audit
      </button>
    </div>
  );
};

export default Audit;
