// src/DynamicAuditScene.js
import React, { useState } from 'react';

const DynamicAuditScene = ({ onClose }) => {
  const [tenantId, setTenantId] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [resourceGroup, setResourceGroup] = useState('');

  const handleAudit = () => {
    if (!tenantId || !subscriptionId || !resourceGroup) {
      alert('Please fill in all fields.');
      return;
    }

    console.log('Running dynamic audit with:', {
      tenantId,
      subscriptionId,
      resourceGroup,
    });

    alert('Dynamic audit complete!');
    onClose();
  };

  return (
    <div>
      <h3>Dynamic Audit</h3>
      <input
        type="text"
        placeholder="Tenant ID"
        value={tenantId}
        onChange={(e) => setTenantId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subscription ID"
        value={subscriptionId}
        onChange={(e) => setSubscriptionId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Resource Group"
        value={resourceGroup}
        onChange={(e) => setResourceGroup(e.target.value)}
      />
      <button className="btn-primary" onClick={handleAudit}>Start Dynamic Audit</button>
    </div>
  );
};

export default DynamicAuditScene;
