import { useState, useEffect } from 'react';
import './RuleManagement.css';
import Editor from '@monaco-editor/react';

export default function RuleManagement() {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [newRule, setNewRule] = useState({ ruleId: '', label: '', file: '', target: '', severity: 'medium', code: '' });
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    fetch('/api/rules')
      .then(res => res.json())
      .then(data => setRules(data));
  }, []);

  useEffect(() => {
    if (selectedRule) {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    }
  }, [selectedRule]);

  const handleSave = () => {
    fetch(`/api/rules/${selectedRule._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedRule),
    }).then(() => setSelectedRule(null));
  };

  const handleCreate = () => {
    const payload = { ...newRule, file: `${newRule.ruleId}.js` };
    fetch('/api/rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(() => {
      setNewRule({ ruleId: '', label: '', file: '', target: '', severity: 'medium', code: '' });
      window.location.reload();
    });
  };

  return (
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
                <th>ID</th>
                <th>Label</th>
                <th>Target</th>
                <th>Severity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule._id}>
                  <td>{rule.ruleId}</td>
                  <td>{rule.label}</td>
                  <td>{rule.target}</td>
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
                <Editor
                  height="300px"
                  defaultLanguage="javascript"
                  value={selectedRule.code || ''}
                  onMount={(editor) => editor.layout()}
                  onChange={code => setSelectedRule({ ...selectedRule, code })}
                />
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
            <select
              value={newRule.severity}
              onChange={e => setNewRule({ ...newRule, severity: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="form-row">
            <label>Rule Code</label>
            <Editor
              height="300px"
              defaultLanguage="javascript"
              value={newRule.code}
              onMount={(editor) => editor.layout()}
              onChange={code => setNewRule({ ...newRule, code })}
            />
          </div>
          <button onClick={handleCreate}>Create Rule</button>
        </div>
      )}
    </div>
  );
}