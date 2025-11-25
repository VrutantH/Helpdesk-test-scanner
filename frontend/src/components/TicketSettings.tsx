import React, { useState, useEffect } from 'react';
import { MdSave, MdInfo, MdAdd, MdEdit, MdDelete, MdDragIndicator } from 'react-icons/md';
import DashboardLayout from './DashboardLayout';
import { useParams } from 'react-router-dom';

interface TicketStatus {
  _id?: string;
  name: string;
  code: string;
  color: string;
  isDefault: boolean;
  isClosed: boolean;
  displayOrder: number;
}

interface TicketType {
  _id?: string;
  name: string;
  code: string;
  description: string;
  icon?: string;
  defaultPriority?: string;
}

interface TicketNumberingConfig {
  format: string; // e.g., "TICK-{YYYY}-{####}"
  prefix: string;
  startingNumber: number;
  separator: string;
  includeYear: boolean;
  includeMonth: boolean;
  resetFrequency: 'never' | 'yearly' | 'monthly';
}

const TicketSettings: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState('numbering');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [projectName, setProjectName] = useState('');

  // Ticket Numbering State
  const [numbering, setNumbering] = useState<TicketNumberingConfig>({
    format: 'TICK-{YYYY}-{####}',
    prefix: 'TICK',
    startingNumber: 1,
    separator: '-',
    includeYear: true,
    includeMonth: false,
    resetFrequency: 'yearly',
  });

  // Statuses State
  const [statuses, setStatuses] = useState<TicketStatus[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [editingStatus, setEditingStatus] = useState<TicketStatus | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Types State
  // Types State
  const [types, setTypes] = useState<TicketType[]>([
    { _id: 'type_1', name: 'Incident', code: 'INCIDENT', description: 'Unexpected service interruption', defaultPriority: 'HIGH' },
    { _id: 'type_2', name: 'Request', code: 'REQUEST', description: 'Service or information request', defaultPriority: 'MEDIUM' },
    { _id: 'type_3', name: 'Problem', code: 'PROBLEM', description: 'Root cause investigation', defaultPriority: 'HIGH' },
    { _id: 'type_4', name: 'Change', code: 'CHANGE', description: 'Change request', defaultPriority: 'MEDIUM' },
    { _id: 'type_5', name: 'Question', code: 'QUESTION', description: 'General question', defaultPriority: 'LOW' },
  ]);
  const [editingType, setEditingType] = useState<TicketType | null>(null);
  const [showTypeModal, setShowTypeModal] = useState(false);

  // Priority options for ticket types
  const priorities = [
    { name: 'Low', code: 'LOW' },
    { name: 'Medium', code: 'MEDIUM' },
    { name: 'High', code: 'HIGH' },
    { name: 'Critical', code: 'CRITICAL' },
  ];

  // Load project-specific ticket configuration
  useEffect(() => {
    loadProjectConfig();
    if (projectId) {
      loadStatuses();
    }
  }, [projectId]);

  const loadStatuses = async () => {
    if (!projectId) return;
    
    setLoadingStatuses(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3003/api/statuses/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Status API Response:', data);
        if (data.success && data.data) {
          console.log('✅ Setting statuses:', data.data.length, 'items');
          setStatuses(data.data);
        } else {
          console.error('❌ API returned success=false or no data:', data);
        }
      } else {
        console.error('❌ API response not OK:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error loading statuses:', error);
    } finally {
      setLoadingStatuses(false);
    }
  };

  const loadProjectConfig = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3003/api/projects/${projectId}/ticket-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setProjectName(data.projectName || '');
        
        if (data.ticketConfig) {
          if (data.ticketConfig.numbering) setNumbering(data.ticketConfig.numbering);
          if (data.ticketConfig.types) setTypes(data.ticketConfig.types);
        }
      }
    } catch (error) {
      console.error('Error loading project config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!projectId) {
      alert('Project ID is required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3003/api/projects/${projectId}/ticket-settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          numbering,
          statuses,
          types,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save ticket configuration');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'numbering', label: 'Ticket Numbering', labelMr: 'तिकीट क्रमांकन' },
    { id: 'statuses', label: 'Ticket Statuses', labelMr: 'तिकीट स्टेटस' },
    { id: 'types', label: 'Ticket Types', labelMr: 'तिकीट प्रकार' },
  ];

  const generatePreview = () => {
    let preview = numbering.prefix;
    if (numbering.separator) preview += numbering.separator;
    if (numbering.includeYear) preview += '2025';
    if (numbering.includeMonth) {
      if (numbering.includeYear) preview += numbering.separator;
      preview += '11';
    }
    preview += numbering.separator + '0001';
    return preview;
  };

  // Status CRUD operations
  const handleAddStatus = () => {
    setEditingStatus({ 
      _id: `temp_${Date.now()}`, 
      name: '', 
      code: '', 
      color: '#3b82f6', 
      isDefault: false, 
      isClosed: false, 
      displayOrder: statuses.length + 1 
    });
    setShowStatusModal(true);
  };

  const handleEditStatus = (status: TicketStatus) => {
    setEditingStatus(status);
    setShowStatusModal(true);
  };

  const handleSaveStatus = async () => {
    if (!editingStatus || !projectId) return;
    
    // Validate required fields
    if (!editingStatus.name || !editingStatus.code) {
      alert('Name and code are required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      // Determine if this is an update or create
      const isUpdate = editingStatus._id && !editingStatus._id.startsWith('temp_');
      const url = isUpdate
        ? `http://localhost:3003/api/statuses/${editingStatus._id}`
        : `http://localhost:3003/api/statuses/project/${projectId}`;
      
      const method = isUpdate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingStatus.name,
          code: editingStatus.code.toUpperCase(),
          color: editingStatus.color,
          isDefault: editingStatus.isDefault,
          isClosed: editingStatus.isClosed,
          displayOrder: editingStatus.displayOrder
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reload statuses from server
        await loadStatuses();
        setShowStatusModal(false);
        setEditingStatus(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.message || 'Failed to save status');
      }
    } catch (error) {
      console.error('Error saving status:', error);
      alert('Failed to save status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStatus = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this status?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `http://localhost:3003/api/statuses/${id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        // Reload statuses from server
        await loadStatuses();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert(data.message || 'Failed to delete status');
      }
    } catch (error) {
      console.error('Error deleting status:', error);
      alert('Failed to delete status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddType = () => {
    setEditingType({ _id: `temp_${Date.now()}`, name: '', code: '', description: '' });
    setShowTypeModal(true);
  };

  const handleSaveType = () => {
    if (!editingType) return;
    
    const existingIndex = types.findIndex(t => t._id === editingType._id);
    
    if (existingIndex !== -1) {
      // Update existing
      setTypes(types.map(t => t._id === editingType._id ? editingType : t));
    } else {
      // Add new
      const newType = {
        ...editingType,
        _id: editingType._id || `temp_${Date.now()}`
      };
      setTypes([...types, newType]);
    }
    setShowTypeModal(false);
    setEditingType(null);
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '32px' 
        }}>
          <div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '600', 
              color: 'var(--text-primary)',
              marginBottom: '8px' 
            }}>
              Ticket Configuration {projectName && `- ${projectName}`}
            </h1>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)' 
            }}>
              Configure ticket numbering, statuses, priorities, categories, and types for this project
            </p>
            <p style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)',
              marginTop: '4px',
              fontStyle: 'italic'
            }}>
              Note: Assignment rules, notifications, and SLA settings are configured in Project Management and SLA/Escalation pages
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                background: saved ? '#10b981' : 'var(--primary-main)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                color: 'white',
              }}
            >
              <MdSave /> {saved ? 'Saved!' : loading ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '60% 38%', gap: '24px' }}>
          {/* Left Column - Configuration */}
          <div>
            {/* Tabs */}
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              borderBottom: '2px solid var(--border-subtle)',
              marginBottom: '24px',
              overflowX: 'auto',
              paddingBottom: '0'
            }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 20px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.id ? '3px solid var(--primary-main)' : '3px solid transparent',
                    fontSize: '14px',
                    fontWeight: activeTab === tab.id ? '600' : '500',
                    color: activeTab === tab.id ? 'var(--primary-main)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

        {/* Tab Content */}
        <div style={{ 
          background: 'white', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '12px',
          padding: '32px' 
        }}>
          {/* Ticket Numbering Tab */}
          {activeTab === 'numbering' && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
                Ticket Numbering Configuration
              </h2>
              
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Prefix
                    </label>
                    <input
                      type="text"
                      value={numbering.prefix}
                      onChange={(e) => setNumbering({ ...numbering, prefix: e.target.value })}
                      placeholder="e.g., TICK, REQ, INC"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Starting Number
                    </label>
                    <input
                      type="number"
                      value={numbering.startingNumber}
                      onChange={(e) => setNumbering({ ...numbering, startingNumber: parseInt(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Separator
                  </label>
                  <input
                    type="text"
                    value={numbering.separator}
                    onChange={(e) => setNumbering({ ...numbering, separator: e.target.value })}
                    placeholder="e.g., -, _, /"
                    maxLength={1}
                    style={{
                      width: '200px',
                      padding: '10px 12px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={numbering.includeYear}
                      onChange={(e) => setNumbering({ ...numbering, includeYear: e.target.checked })}
                    />
                    Include Year
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={numbering.includeMonth}
                      onChange={(e) => setNumbering({ ...numbering, includeMonth: e.target.checked })}
                    />
                    Include Month
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Reset Frequency
                  </label>
                  <select
                    value={numbering.resetFrequency}
                    onChange={(e) => setNumbering({ ...numbering, resetFrequency: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="never">Never (Continuous)</option>
                    <option value="yearly">Reset Yearly</option>
                    <option value="monthly">Reset Monthly</option>
                  </select>
                </div>

                <div style={{ 
                  background: '#dbeafe', 
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <MdInfo style={{ color: '#3b82f6', fontSize: '20px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#1e40af' }}>Preview:</strong>
                    <p style={{ color: '#1e40af', marginTop: '4px', fontSize: '18px', fontWeight: '600' }}>
                      {generatePreview()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ticket Statuses Tab */}
          {activeTab === 'statuses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                  Ticket Statuses
                </h2>
                <button
                  onClick={handleAddStatus}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: 'var(--primary-main)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  <MdAdd /> Add Status
                </button>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {loadingStatuses && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading statuses...
                  </div>
                )}
                {!loadingStatuses && statuses.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No statuses found. Click "Add Status" to create one.
                  </div>
                )}
                {!loadingStatuses && statuses.map((status) => (
                  <div
                    key={status._id || status.code}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      background: 'white',
                    }}
                  >
                    <MdDragIndicator style={{ color: 'var(--text-secondary)', cursor: 'grab' }} />
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        background: status.color,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{status.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Code: {status.code}
                        {status.isDefault && ' • Default'}
                        {status.isClosed && ' • Closes Ticket'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditStatus(status)}
                      style={{
                        padding: '8px 12px',
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <MdEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStatus(status._id || status.code)}
                      style={{
                        padding: '8px 12px',
                        background: 'transparent',
                        border: '1px solid #ef4444',
                        borderRadius: '6px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <MdDelete /> Delete
                    </button>
                  </div>
                ))}
              </div>

              {/* Status Modal */}
              {showStatusModal && editingStatus && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    width: '500px',
                    maxWidth: '90%',
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                      {editingStatus._id ? 'Edit Status' : 'Add Status'}
                    </h3>

                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name</label>
                        <input
                          type="text"
                          value={editingStatus.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            // Auto-generate code from name
                            const code = name
                              .toUpperCase()
                              .replace(/[^A-Z0-9\s]/g, '') // Remove special characters
                              .replace(/\s+/g, '_')         // Replace spaces with underscores
                              .substring(0, 50);             // Limit length
                            setEditingStatus({ ...editingStatus, name, code });
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                          Code <span style={{ color: '#6b7280', fontSize: '12px' }}>(Auto-generated)</span>
                        </label>
                        <input
                          type="text"
                          value={editingStatus.code}
                          readOnly
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            backgroundColor: '#f9fafb',
                            color: '#6b7280',
                            cursor: 'not-allowed',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Color</label>
                        <input
                          type="color"
                          value={editingStatus.color}
                          onChange={(e) => setEditingStatus({ ...editingStatus, color: e.target.value })}
                          style={{
                            width: '100%',
                            height: '50px',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
                        />
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={editingStatus.isDefault}
                          onChange={(e) => setEditingStatus({ ...editingStatus, isDefault: e.target.checked })}
                        />
                        Set as Default Status
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={editingStatus.isClosed}
                          onChange={(e) => setEditingStatus({ ...editingStatus, isClosed: e.target.checked })}
                        />
                        This Status Closes Tickets
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setShowStatusModal(false);
                          setEditingStatus(null);
                        }}
                        style={{
                          padding: '10px 20px',
                          background: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveStatus}
                        style={{
                          padding: '10px 20px',
                          background: 'var(--primary-main)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ticket Types Tab */}
          {activeTab === 'types' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                  Ticket Types
                </h2>
                <button
                  onClick={handleAddType}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: 'var(--primary-main)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  <MdAdd /> Add Type
                </button>
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                {types.map((type) => (
                  <div
                    key={type._id || type.code}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '20px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      background: 'white',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{type.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{type.description}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Code: {type.code}
                        {type.defaultPriority && ` • Default Priority: ${type.defaultPriority}`}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingType(type);
                        setShowTypeModal(true);
                      }}
                      style={{
                        padding: '8px 12px',
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <MdEdit /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this type?')) {
                          setTypes(types.filter(t => t._id !== type._id));
                        }
                      }}
                      style={{
                        padding: '8px 12px',
                        background: 'transparent',
                        border: '1px solid #ef4444',
                        borderRadius: '6px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <MdDelete /> Delete
                    </button>
                  </div>
                ))}
              </div>

              {/* Type Modal */}
              {showTypeModal && editingType && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    width: '500px',
                    maxWidth: '90%',
                  }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
                      {editingType._id ? 'Edit Type' : 'Add Type'}
                    </h3>

                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name</label>
                        <input
                          type="text"
                          value={editingType.name}
                          onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Code</label>
                        <input
                          type="text"
                          value={editingType.code}
                          onChange={(e) => setEditingType({ ...editingType, code: e.target.value.toUpperCase() })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                        <textarea
                          value={editingType.description}
                          onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            fontFamily: 'inherit',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Default Priority</label>
                        <select
                          value={editingType.defaultPriority || ''}
                          onChange={(e) => setEditingType({ ...editingType, defaultPriority: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                          }}
                        >
                          <option value="">No default</option>
                          {priorities.map(p => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setShowTypeModal(false);
                          setEditingType(null);
                        }}
                        style={{
                          padding: '10px 20px',
                          background: 'transparent',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveType}
                        style={{
                          padding: '10px 20px',
                          background: 'var(--primary-main)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
          </div>

          {/* Right Column - Preview Panel */}
          <div>
            <div style={{ position: 'sticky', top: '24px' }}>
              <div style={{ 
                background: 'white', 
                border: '1px solid var(--border-subtle)', 
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <MdInfo style={{ color: 'var(--primary-main)' }} />
                  Configuration Summary
                </h3>

                {activeTab === 'numbering' && (
                  <div>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: 'var(--text-secondary)',
                      marginBottom: '12px'
                    }}>
                      Preview Format
                    </h4>
                    <div style={{
                      background: '#f3f4f6',
                      padding: '16px',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '16px',
                      fontWeight: '600',
                      textAlign: 'center',
                      color: 'var(--primary-main)',
                      marginBottom: '16px'
                    }}>
                      {generatePreview()}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <p><strong>Format:</strong> {numbering.format}</p>
                      <p><strong>Prefix:</strong> {numbering.prefix || 'None'}</p>
                      <p><strong>Starting Number:</strong> {numbering.startingNumber}</p>
                      <p><strong>Reset:</strong> {numbering.resetFrequency}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'statuses' && (
                  <div>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: 'var(--text-secondary)',
                      marginBottom: '12px'
                    }}>
                      Configured Statuses
                    </h4>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f9fafb', position: 'sticky', top: 0 }}>
                          <tr>
                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>#</th>
                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '8px', textAlign: 'center', fontWeight: '600' }}>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statuses.sort((a, b) => a.displayOrder - b.displayOrder).map((status, index) => (
                            <tr key={status._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px' }}>{index + 1}</td>
                              <td style={{ padding: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: status.color,
                                    display: 'inline-block'
                                  }}></span>
                                  {status.name}
                                </div>
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center' }}>
                                {status.isDefault && <span style={{ color: '#10b981' }}>✓ Default</span>}
                                {status.isClosed && <span style={{ color: '#6b7280' }}>Closed</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {statuses.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>
                          No statuses configured yet
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'types' && (
                  <div>
                    <h4 style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: 'var(--text-secondary)',
                      marginBottom: '12px'
                    }}>
                      Configured Types
                    </h4>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f9fafb', position: 'sticky', top: 0 }}>
                          <tr>
                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>#</th>
                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {types.map((type, index) => (
                            <tr key={type._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '8px' }}>{index + 1}</td>
                              <td style={{ padding: '8px' }}>
                                <div>
                                  <div style={{ fontWeight: '500' }}>{type.name}</div>
                                  <div style={{ fontSize: '11px', color: '#6b7280' }}>{type.description}</div>
                                </div>
                              </td>
                              <td style={{ padding: '8px' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  background: type.defaultPriority === 'CRITICAL' ? '#fee2e2' :
                                             type.defaultPriority === 'HIGH' ? '#fed7aa' :
                                             type.defaultPriority === 'MEDIUM' ? '#fef3c7' : '#dbeafe',
                                  color: type.defaultPriority === 'CRITICAL' ? '#991b1b' :
                                         type.defaultPriority === 'HIGH' ? '#9a3412' :
                                         type.defaultPriority === 'MEDIUM' ? '#92400e' : '#1e40af'
                                }}>
                                  {type.defaultPriority}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {types.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>
                          No types configured yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketSettings;
