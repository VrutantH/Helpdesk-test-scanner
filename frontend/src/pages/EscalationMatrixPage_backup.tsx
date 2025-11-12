import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { AddEscalationMatrixModal } from '../components/AddEscalationMatrixModal';

interface EscalationLevel {
  level: number;
  escalateAfter: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  escalateTo: {
    type: 'user' | 'group' | 'role';
    targetId: string;
    targetName: string;
  };
  notifyMethod: ('email' | 'sms' | 'push')[];
  emailTemplate?: string;
  actions?: {
    changePriority?: 'Urgent' | 'High' | 'Normal' | 'Low';
    addWatchers?: string[];
    changeStatus?: string;
  };
}

interface EscalationPolicy {
  _id?: string;
  policyId: string;
  name: string;
  description?: string;
  levels: EscalationLevel[];
  isActive: boolean;
  projectId?: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const EscalationMatrixPage: React.FC = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<EscalationPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMatrix, setEditingMatrix] = useState<any>(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3003/api/escalation-policies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setPolicies(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching escalation policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (policy: EscalationPolicy) => {
    if (confirm(`Are you sure you want to delete "${policy.name}"?`)) {
      try {
        const policyId = policy._id || policy.policyId;
        const response = await fetch(`http://localhost:3003/api/escalation-policies/${policyId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          alert('Escalation policy deleted successfully!');
          fetchPolicies();
        } else {
          alert('Failed to delete policy');
        }
      } catch (error) {
        console.error('Error deleting policy:', error);
        alert('Error deleting policy');
      }
    }
  };

  const handleToggleStatus = async (policy: EscalationPolicy) => {
    try {
      const policyId = policy._id || policy.policyId;
      const response = await fetch(`http://localhost:3003/api/escalation-policies/${policyId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        fetchPolicies();
      } else {
        alert('Failed to toggle policy status');
      }
    } catch (error) {
      console.error('Error toggling policy status:', error);
      alert('Error toggling policy status');
    }
  };

  const handleSaveMatrix = async (matrixData: any) => {
    try {
      // Convert the form data to the API format
      const apiData = {
        name: matrixData.name,
        description: matrixData.description || '',
        projectIds: matrixData.projectIds,
        levels: matrixData.levels.map((level: any) => ({
          level: level.level,
          levelName: level.levelName,
          escalateAfter: level.escalateAfter,
          assignRoles: level.assignRoles,
          notificationChannels: level.notificationChannels,
        })),
        saveAsTemplate: matrixData.saveAsTemplate,
        isActive: true,
        createdBy: 'Admin',
      };

      const response = await fetch('http://localhost:3003/api/escalation-policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        alert('Escalation matrix created successfully!');
        setShowCreateModal(false);
        setEditingMatrix(null);
        fetchPolicies();
      } else {
        const error = await response.json();
        alert(`Failed to create escalation matrix: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating escalation matrix:', error);
      alert('Error creating escalation matrix');
    }
  };

  const formatTime = (time: { value: number; unit: string }) => {
    return `${time.value} ${time.unit}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div>Loading escalation policies...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ padding: 'var(--spacing-8)', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header with Tab Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-2)',
        }}>
          <h1 style={{ margin: 0, fontSize: 'var(--font-2xl)', fontWeight: 600 }}>
            SLA & Escalation Management
          </h1>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: 'var(--spacing-6)',
          borderBottom: '2px solid var(--border-default)'
        }}>
          <button
            onClick={() => navigate('/sla')}
            className="btn btn-text"
            style={{
              borderBottom: '3px solid transparent',
              color: 'var(--text-secondary)',
              marginBottom: '-2px',
              textTransform: 'none',
              borderRadius: 0,
            }}
          >
            SLA Rules
          </button>
          <button
            className="btn btn-text"
            style={{
              borderBottom: '3px solid var(--primary-main)',
              color: 'var(--primary-main)',
              marginBottom: '-2px',
              textTransform: 'none',
              borderRadius: 0,
            }}
          >
            Escalation Matrix
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-6)',
        }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
            Configure escalation policies for SLA breaches
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-cta"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}
          >
            + Add Escalation Policy
          </button>
        </div>

        {/* Create Escalation Matrix Modal */}
        <AddEscalationMatrixModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEditingMatrix(null);
          }}
          onSave={handleSaveMatrix}
          initialData={editingMatrix}
          mode={editingMatrix ? 'edit' : 'create'}
        />

        {/* Escalation Policies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
          {policies.map((policy) => (
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 1
              }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    Create Escalation Matrix
                  </h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
                    Define escalation levels and auto-escalation logic
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                {/* Matrix Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '6px'
                  }}>
                    Matrix Name <span style={{ color: '#E6393E' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.matrixName}
                    onChange={(e) => setFormData({ ...formData, matrixName: e.target.value })}
                    placeholder="e.g., Standard Support Escalation"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Project Selector */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '6px'
                  }}>
                    Project
                  </label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 12px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Acme Corporation">Acme Corporation</option>
                  </select>
                </div>

                {/* Escalation Levels Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Escalation Levels
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newLevel = {
                        id: formData.escalationLevels.length + 1,
                        levelName: `L${formData.escalationLevels.length + 1}`,
                        assignRoles: [] as string[],
                        escalateAfter: 30,
                        escalateUnit: 'Minutes' as 'Minutes' | 'Hours' | 'Days',
                        notificationChannels: {
                          email: true,
                          sms: false,
                          whatsapp: false
                        }
                      };
                      setFormData({
                        ...formData,
                        escalationLevels: [...formData.escalationLevels, newLevel]
                      });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#3F41D1',
                      backgroundColor: 'transparent',
                      border: '1px solid #3F41D1',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F3F4FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span style={{ fontSize: '16px', lineHeight: '1' }}>+</span>
                    Add Level
                  </button>
                </div>

                {/* Escalation Levels List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  {formData.escalationLevels.map((level, index) => (
                    <div
                      key={level.id}
                      style={{
                        padding: '16px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                      }}
                    >
                      {/* Level Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}>
                        <h5 style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: 0
                        }}>
                          Level {index + 1}
                        </h5>
                        {formData.escalationLevels.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                escalationLevels: formData.escalationLevels.filter((_, i) => i !== index)
                              });
                            }}
                            style={{
                              padding: '4px 8px',
                              fontSize: '12px',
                              color: '#dc2626',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#fef2f2';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Level Name */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#111827',
                            marginBottom: '6px'
                          }}>
                            Level Name
                          </label>
                          <input
                            type="text"
                            value={level.levelName}
                            onChange={(e) => {
                              const newLevels = [...formData.escalationLevels];
                              newLevels[index].levelName = e.target.value;
                              setFormData({ ...formData, escalationLevels: newLevels });
                            }}
                            placeholder="L1"
                            style={{
                              width: '100%',
                              height: '36px',
                              padding: '0 12px',
                              fontSize: '13px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              boxSizing: 'border-box',
                              outline: 'none'
                            }}
                          />
                        </div>

                        {/* Assign Roles */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#111827',
                            marginBottom: '6px'
                          }}>
                            Assign Roles
                          </label>
                          <select
                            style={{
                              width: '100%',
                              height: '36px',
                              padding: '0 12px',
                              fontSize: '13px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              boxSizing: 'border-box',
                              outline: 'none',
                              color: '#6b7280',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">Select roles</option>
                          </select>
                        </div>

                        {/* Escalate After */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#111827',
                            marginBottom: '6px'
                          }}>
                            Escalate After
                          </label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                            <input
                              type="number"
                              value={level.escalateAfter}
                              onChange={(e) => {
                                const newLevels = [...formData.escalationLevels];
                                newLevels[index].escalateAfter = parseInt(e.target.value) || 0;
                                setFormData({ ...formData, escalationLevels: newLevels });
                              }}
                              style={{
                                width: '80px',
                                height: '36px',
                                padding: '0 12px',
                                fontSize: '13px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                boxSizing: 'border-box',
                                outline: 'none'
                              }}
                            />
                            <select
                              value={level.escalateUnit}
                              onChange={(e) => {
                                const newLevels = [...formData.escalationLevels];
                                newLevels[index].escalateUnit = e.target.value as 'Minutes' | 'Hours' | 'Days';
                                setFormData({ ...formData, escalationLevels: newLevels });
                              }}
                              style={{
                                flex: 1,
                                height: '36px',
                                padding: '0 12px',
                                fontSize: '13px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                boxSizing: 'border-box',
                                outline: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Minutes">Minutes</option>
                              <option value="Hours">Hours</option>
                              <option value="Days">Days</option>
                            </select>
                          </div>
                        </div>

                        {/* Notification Channels */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#111827',
                            marginBottom: '8px'
                          }}>
                            Notification Channels
                          </label>
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer'
                            }}>
                              <input
                                type="checkbox"
                                checked={level.notificationChannels.email}
                                onChange={(e) => {
                                  const newLevels = [...formData.escalationLevels];
                                  newLevels[index].notificationChannels.email = e.target.checked;
                                  setFormData({ ...formData, escalationLevels: newLevels });
                                }}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  cursor: 'pointer',
                                  accentColor: '#3F41D1'
                                }}
                              />
                              <span style={{ fontSize: '13px', color: '#374151' }}>Email</span>
                            </label>
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer'
                            }}>
                              <input
                                type="checkbox"
                                checked={level.notificationChannels.sms}
                                onChange={(e) => {
                                  const newLevels = [...formData.escalationLevels];
                                  newLevels[index].notificationChannels.sms = e.target.checked;
                                  setFormData({ ...formData, escalationLevels: newLevels });
                                }}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  cursor: 'pointer',
                                  accentColor: '#3F41D1'
                                }}
                              />
                              <span style={{ fontSize: '13px', color: '#374151' }}>Sms</span>
                            </label>
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer'
                            }}>
                              <input
                                type="checkbox"
                                checked={level.notificationChannels.whatsapp}
                                onChange={(e) => {
                                  const newLevels = [...formData.escalationLevels];
                                  newLevels[index].notificationChannels.whatsapp = e.target.checked;
                                  setFormData({ ...formData, escalationLevels: newLevels });
                                }}
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  cursor: 'pointer',
                                  accentColor: '#3F41D1'
                                }}
                              />
                              <span style={{ fontSize: '13px', color: '#374151' }}>Whatsapp</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save as Template */}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.saveAsTemplate}
                      onChange={(e) => setFormData({ ...formData, saveAsTemplate: e.target.checked })}
                      style={{
                        width: '18px',
                        height: '18px',
                        marginTop: '2px',
                        cursor: 'pointer',
                        accentColor: '#3F41D1',
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <span style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1f2937',
                        marginBottom: '2px'
                      }}>
                        Save as Template
                      </span>
                      <span style={{
                        display: 'block',
                        fontSize: '12px',
                        color: '#6b7280',
                        lineHeight: '1.5'
                      }}>
                        Reuse for similar projects
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'white'
              }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    backgroundColor: 'transparent',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle create escalation matrix
                    console.log('Creating escalation matrix:', formData);
                    setShowCreateModal(false);
                    // Reset form
                    setFormData({
                      matrixName: '',
                      project: 'Acme Corporation',
                      escalationLevels: [
                        {
                          id: 1,
                          levelName: 'L1',
                          assignRoles: [],
                          escalateAfter: 30,
                          escalateUnit: 'Minutes',
                          notificationChannels: {
                            email: true,
                            sms: false,
                            whatsapp: false
                          }
                        }
                      ],
                      saveAsTemplate: false
                    });
                  }}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: '#f97316',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ea580c';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f97316';
                  }}
                >
                  Create Escalation Matrix
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Escalation Policies */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
          {policies.map((policy) => (
            <div
              key={policy._id || policy.policyId}
              className="card"
              style={{ overflow: 'hidden' }}
            >
              {/* Policy Header */}
              <div style={{
                padding: 'var(--spacing-5)',
                borderBottom: '1px solid var(--border-default)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 'var(--font-lg)', fontWeight: 600 }}>
                    {policy.name}
                  </h3>
                  {policy.description && (
                    <p style={{ margin: 'var(--spacing-1) 0 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                      {policy.description}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <button
                    onClick={() => handleToggleStatus(policy)}
                    className="btn btn-tonal"
                    style={{
                      padding: 'var(--spacing-2) var(--spacing-4)',
                      minHeight: 'auto',
                      height: 'auto',
                      textTransform: 'none',
                      background: policy.isActive ? 'var(--accent-success-light, #dcfce7)' : 'var(--background-secondary)',
                      color: policy.isActive ? '#166534' : 'var(--text-secondary)',
                    }}
                  >
                    {policy.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleDeletePolicy(policy)}
                    className="btn btn-outline"
                    style={{
                      padding: 'var(--spacing-2) var(--spacing-4)',
                      minHeight: 'auto',
                      height: 'auto',
                      textTransform: 'none',
                      borderColor: 'var(--accent-error)',
                      color: 'var(--accent-error)',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Escalation Levels */}
              <div style={{ padding: 'var(--spacing-5)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {policy.levels.map((level) => (
                    <div
                      key={level.level}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      {/* Level Badge */}
                      <div style={{
                        minWidth: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: '#f97316',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 600,
                        marginRight: '16px',
                      }}>
                        L{level.level}
                      </div>

                      {/* Level Details */}
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            Escalate After
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 500 }}>
                            ⏱️ {formatTime(level.escalateAfter)}
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            Escalate To
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 500 }}>
                            👤 {level.escalateTo.targetName}
                            <span style={{
                              marginLeft: '8px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              background: '#dbeafe',
                              color: '#1e40af',
                            }}>
                              {level.escalateTo.type}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            Notification Method
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 500, display: 'flex', gap: '4px' }}>
                            {level.notifyMethod.map(method => (
                              <span
                                key={method}
                                style={{
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  background: '#fef3c7',
                                  color: '#92400e',
                                }}
                              >
                                {method}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {level.actions && (
                        <div style={{
                          marginLeft: '16px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          background: '#dcfce7',
                          fontSize: '12px',
                          color: '#166534',
                        }}>
                          {level.actions.changePriority && (
                            <div>↗️ Priority → {level.actions.changePriority}</div>
                          )}
                          {level.actions.changeStatus && (
                            <div>🔄 Status → {level.actions.changeStatus}</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {policies.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '60px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
              No Escalation Policies Found
            </h3>
            <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>
              Create escalation policies to automatically escalate tickets on SLA breach
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '10px 20px',
                borderRadius: '6px',
                border: 'none',
                background: '#f97316',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              + Add Escalation Policy
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EscalationMatrixPage;
