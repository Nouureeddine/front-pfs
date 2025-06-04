import { useState, useEffect, useRef, useCallback } from 'react';
import './RuleManagement.css';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import React from 'react';

// Enhanced ErrorBoundary for better error logging
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    console.error('ErrorBoundary caught:', error);
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error: {this.state.error?.message || 'Something went wrong. Please try again.'}</div>;
    }
    return this.props.children;
  }
}

export default function RuleManagement() {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [newRule, setNewRule] = useState({ ruleId: '', label: '', file: '', target: '', severity: 'medium', code: '' });
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const editorContainerRef = useRef(null);

  // Fetch rules
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('https://auditservice.agreeableplant-e53e6c49.westus2.azurecontainerapps.io/policies', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('API response:', response.data); // Debug
        const mappedRules = response.data.map(rule => ({
          _id: rule.id || rule.policyId || `rule-${Date.now()}-${Math.random()}`,
          ruleId: rule.id || rule.policyId,
          label: rule.name || rule.title || 'Unnamed Rule',
          target: rule.resource || rule.resourceType || '',
          severity: rule.severityLevel || rule.level || 'medium',
          code: rule.script || rule.content || ''
        }));
        setRules(mappedRules);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch rules');
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  // Ensure editor mounts only when container is ready
  useEffect(() => {
    if (activeTab === 'create' || selectedRule) {
      const timer = setTimeout(() => setEditorReady(true), 100); // Delay to ensure container is rendered
      return () => clearTimeout(timer);
    } else {
      setEditorReady(false);
    }
  }, [activeTab, selectedRule]);

  const handleSave = useCallback(async () => {
    if (!selectedRule?._id) return;
    try {
      await fetch(`https://auditservice.agreeableplant-e53e6c49.westus2.azurecontainerapps.io/policies/${selectedRule._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ruleId: selectedRule.ruleId,
          label: selectedRule.label,
          target: selectedRule.target,
          severity: selectedRule.severity,
          code: selectedRule.code
        }),
      });
      setRules(rules => rules.map(rule => (rule._id === selectedRule._id ? selectedRule : rule)));
      setSelectedRule(null);
    } catch (err) {
      console.error('Save failed:', err);
    }
  }, [selectedRule]);

  const handleCreate = useCallback(async () => {
    if (isCreating) return;
    setIsCreating(true);
    const payload = { ...newRule, file: `${newRule.ruleId}.js` };
    try {
      const response = await fetch('https://auditservice.agreeableplant-e53e6c49.westus2.azurecontainerapps.io/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const newRuleData = await response.json();
        console.log('Created rule:', newRuleData); // Debug
        setRules(rules => [...rules, {
          _id: newRuleData.id || newRuleData.policyId || `rule-${Date.now()}-${Math.random()}`,
          ruleId: newRule.ruleId,
          label: newRule.label,
          target: newRule.target,
          severity: newRule.severity,
          code: newRule.code
        }]);
        setNewRule({ ruleId: '', label: '', file: '', target: '', severity: 'medium', code: '' });
        setActiveTab('list');
      } else {
        console.error('Create failed:', await response.text());
      }
    } catch (err) {
      console.error('Create failed:', err);
    } finally {
      setIsCreating(false);
    }
  }, [newRule, isCreating]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ErrorBoundary>
      <div className="rule-management">
        <h1>Rule Management</h1>
        <div className="tabs">
          <button onClick={() => setActiveTab('list')} className={activeTab === 'list' ? 'active' : ''}>Rule List</button>
          <button onClick={() => setActiveTab('create')} className={activeTab === 'create' ? 'active' : ''}>Create Rule</button>
        </div>

        {activeTab === 'list' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>LABEL</th>
                  <th>SEVERITY</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {rules.map(rule => (
                  <tr key={rule._id}>
                    <td>{rule.label}</td>
                    <td>{rule.severity}</td>
                    <td>
                      <button onClick={() => setSelectedRule(rule)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedRule && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Edit Rule: {selectedRule.ruleId}</h3>
                  <input
                    value={selectedRule.label}
                    onChange={e => setSelectedRule({ ...selectedRule, label: e.target.value })}
                    placeholder="Label"
                  />
                  <div className="monaco-editor-container" ref={editorContainerRef}>
                    {editorReady && (
                      <Editor
                        height="300px"
                        defaultLanguage="javascript"
                        value={selectedRule.code || ''}
                        onMount={(editor) => editor.layout()}
                        onChange={code => setSelectedRule({ ...selectedRule, code })}
                        options={{ minimap: { enabled: false }, automaticLayout: true }}
                      />
                    )}
                  </div>
                  <button onClick={handleSave}>Save Changes</button>
                  <button onClick={() => setSelectedRule(null)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="form-container">
            <div className="form-row">
              <label>Rule ID</label>
              <input value={newRule.ruleId} onChange={e => setNewRule({ ...newRule, ruleId: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Label</label>
              <input value={newRule.label} onChange={e => setNewRule({ ...newRule, label: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Target</label>
              <input value={newRule.target} onChange={e => setNewRule({ ...newRule, target: e.target.value })} />
            </div>
            <div className="form-row">
              <label>Severity</label>
              <select value={newRule.severity} onChange={e => setNewRule({ ...newRule, severity: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="form-row">
              <label>Rule Code</label>
              <div className="monaco-editor-container" ref={editorContainerRef}>
                {editorReady && (
                  <Editor
                    height="300px"
                    defaultLanguage="javascript"
                    value={newRule.code}
                    onMount={(editor) => editor.layout()}
                    onChange={code => setNewRule({ ...newRule, code })}
                    options={{ minimap: { enabled: false }, automaticLayout: true }}
                  />
                )}
              </div>
            </div>
            <button onClick={handleCreate} disabled={isCreating}>{isCreating ? 'Creating...' : 'Create Rule'}</button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}