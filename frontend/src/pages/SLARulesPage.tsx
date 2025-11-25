import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

interface SLARule {
  _id?: string;
  name: string;
  description?: string;
  priority: 'Critical' | 'Urgent' | 'High' | 'Normal' | 'Low';
  responseTime: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  resolutionTime: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  isActive: boolean;
  projectIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SLARulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [slaRules, setSlaRules] = useState<SLARule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<SLARule | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'Normal' as 'Critical' | 'Urgent' | 'High' | 'Normal' | 'Low',
    responseTimeValue: '',
    responseTimeUnit: 'minutes' as 'minutes' | 'hours' | 'days',
    resolutionTimeValue: '',
    resolutionTimeUnit: 'hours' as 'minutes' | 'hours' | 'days',
    isActive: true,
    projectIds: [] as string[],
  });

  useEffect(() => {
    fetchSLARules();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3003/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Projects data received:', data);
        // Handle nested structure: {success: true, data: {projects: [...], pagination: {...}}}
        if (data.success && data.data && Array.isArray(data.data.projects)) {
          setProjects(data.data.projects);
        } else if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        } else if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.warn('Projects data is not in expected format:', data);
          setProjects([]);
        }
      } else {
        console.error('Failed to fetch projects, status:', response.status);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const fetchSLARules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      console.log('Fetching SLA rules with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('http://localhost:3003/api/sla-rules', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('SLA Rules data received:', data);
        if (data.success && data.data) {
          setSlaRules(data.data);
          console.log('SLA Rules set:', data.data.length, 'rules');
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Failed to fetch SLA rules:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error fetching SLA rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSLARule = async (rule: SLARule) => {
    if (confirm(`Are you sure you want to delete "${rule.name}"?`)) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3003/api/sla-rules/${rule._id || rule.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          alert('SLA rule deleted successfully!');
          fetchSLARules();
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Failed to delete' }));
          alert(`Failed to delete SLA rule: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error deleting SLA rule:', error);
        alert('Error deleting SLA rule');
      }
    }
  };

  const handleToggleStatus = async (rule: SLARule) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3003/api/sla-rules/${rule._id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        fetchSLARules();
      } else {
        alert('Failed to toggle SLA rule status');
      }
    } catch (error) {
      console.error('Error toggling SLA rule status:', error);
      alert('Error toggling SLA rule status');
    }
  };

  const handleSaveSLARule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      
      const slaRuleData = {
        name: formData.name,
        description: formData.description,
        priority: formData.priority,
        responseTime: {
          value: parseInt(formData.responseTimeValue),
          unit: formData.responseTimeUnit,
        },
        resolutionTime: {
          value: parseInt(formData.resolutionTimeValue),
          unit: formData.resolutionTimeUnit,
        },
        isActive: formData.isActive,
        projectIds: formData.projectIds,
      };

      const isEditing = editingRule !== null;
      const url = isEditing 
        ? `http://localhost:3003/api/sla-rules/${editingRule._id}`
        : 'http://localhost:3003/api/sla-rules';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(slaRuleData),
      });

      if (response.ok) {
        alert(`SLA rule ${isEditing ? 'updated' : 'created'} successfully!`);
        setShowCreateModal(false);
        setEditingRule(null);
        // Reset form
        setFormData({
          name: '',
          description: '',
          priority: 'Normal',
          responseTimeValue: '',
          responseTimeUnit: 'minutes',
          resolutionTimeValue: '',
          resolutionTimeUnit: 'hours',
          isActive: true,
          projectIds: [],
        });
        fetchSLARules();
      } else {
        const errorData = await response.json().catch(() => ({ message: `Failed to ${isEditing ? 'update' : 'create'}` }));
        alert(`Failed to ${isEditing ? 'update' : 'create'} SLA rule: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Error ${editingRule ? 'updating' : 'creating'} SLA rule:`, error);
      alert(`Error ${editingRule ? 'updating' : 'creating'} SLA rule`);
    }
  };

  const handleEditSLARule = (rule: SLARule) => {
    setEditingRule(rule);
    
    // Extract project IDs from either populated objects or string IDs
    const projectIds = rule.projectIds?.map((p: any) => {
      if (typeof p === 'string') return p;
      return p._id || p;
    }).filter(Boolean) || [];

    setFormData({
      name: rule.name,
      description: rule.description || '',
      priority: rule.priority || 'Normal',
      responseTimeValue: rule.responseTime.value.toString(),
      responseTimeUnit: rule.responseTime.unit,
      resolutionTimeValue: rule.resolutionTime.value.toString(),
      resolutionTimeUnit: rule.resolutionTime.unit,
      isActive: rule.isActive,
      projectIds: projectIds,
    });
    setShowCreateModal(true);
  };

  const formatTime = (time: { value: number; unit: string }) => {
    return `${time.value} ${time.unit}`;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Critical': '#dc2626',
      'Urgent': '#ea580c',
      'High': '#f97316',
      'Normal': '#0891b2',
      'Low': '#059669',
    };
    return colors[priority] || '#6b7280';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div>Loading SLA rules...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
            SLA & Escalation Management
          </h1>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: '24px',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <button
            className="btn btn-text"
            style={{
              borderBottom: '3px solid #7c3aed',
              color: '#7c3aed',
              marginBottom: '-2px',
              textTransform: 'none',
              borderRadius: 0,
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            SLA Rules
          </button>
          <button
            onClick={() => navigate('/escalation-matrix')}
            className="btn btn-text"
            style={{
              borderBottom: '3px solid transparent',
              color: '#6b7280',
              marginBottom: '-2px',
              textTransform: 'none',
              borderRadius: 0,
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Escalation Matrix
          </button>
        </div>

        {/* Description and Action Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
            Define Service Level Agreement rules based on ticket priority
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <span>+</span>
            Add SLA Rule
          </button>
        </div>

        {/* SLA Rules List */}
        {slaRules.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
              No SLA Rules Found
            </h3>
            <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>
              Create your first SLA rule to define response and resolution times
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Create SLA Rule
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {slaRules.map((rule) => (
              <div
                key={rule._id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                        {rule.name}
                      </h3>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 500,
                          backgroundColor: `${getPriorityColor(rule.priority)}15`,
                          color: getPriorityColor(rule.priority),
                        }}
                      >
                        {rule.priority}
                      </span>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 500,
                          backgroundColor: rule.isActive ? '#dcfce7' : '#fee2e2',
                          color: rule.isActive ? '#166534' : '#991b1b',
                        }}
                      >
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {rule.description && (
                      <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>
                        {rule.description}
                      </p>
                    )}
                    {rule.projectIds && rule.projectIds.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>
                          Mapped to {rule.projectIds.length} project{rule.projectIds.length > 1 ? 's' : ''}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {rule.projectIds.slice(0, 3).map((projectId: string, idx: number) => {
                            const project = projects.find(p => p._id === projectId);
                            return project ? (
                              <span
                                key={idx}
                                style={{
                                  padding: '2px 8px',
                                  backgroundColor: '#ede9fe',
                                  color: '#7c3aed',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                }}
                              >
                                {project.code || project.name}
                              </span>
                            ) : null;
                          })}
                          {rule.projectIds.length > 3 && (
                            <span
                              style={{
                                padding: '2px 8px',
                                backgroundColor: '#f3f4f6',
                                color: '#6b7280',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 500,
                              }}
                            >
                              +{rule.projectIds.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEditSLARule(rule)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(rule)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: rule.isActive ? '#fef3c7' : '#dcfce7',
                        color: rule.isActive ? '#92400e' : '#166534',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {rule.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteSLARule(rule)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>
                      Response Time
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
                      {formatTime(rule.responseTime)}
                    </div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>
                      Resolution Time
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
                      {formatTime(rule.resolutionTime)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal - Placeholder */}
        {showCreateModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={() => setShowCreateModal(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 600 }}>
                {editingRule ? 'Edit SLA Rule' : 'Create SLA Rule'}
              </h2>
              
              <form onSubmit={handleSaveSLARule}>
                {/* Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    Rule Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Critical Priority SLA"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>

                {/* Description */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this SLA rule"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Priority */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    Priority <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Response Time */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    Response Time <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.responseTimeValue}
                      onChange={(e) => setFormData({ ...formData, responseTimeValue: e.target.value })}
                      placeholder="e.g., 15"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                    <select
                      value={formData.responseTimeUnit}
                      onChange={(e) => setFormData({ ...formData, responseTimeUnit: e.target.value as any })}
                      style={{
                        width: '120px',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                {/* Resolution Time */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    Resolution Time <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.resolutionTimeValue}
                      onChange={(e) => setFormData({ ...formData, resolutionTimeValue: e.target.value })}
                      placeholder="e.g., 2"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />
                    <select
                      value={formData.resolutionTimeUnit}
                      onChange={(e) => setFormData({ ...formData, resolutionTimeUnit: e.target.value as any })}
                      style={{
                        width: '120px',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                {/* Project Mapping */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    Map to Projects (Optional)
                  </label>
                  <div style={{ 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px', 
                    padding: '12px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    backgroundColor: '#f9fafb',
                  }}>
                    {!Array.isArray(projects) || projects.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                        No projects available
                      </p>
                    ) : (
                      projects.map((project) => (
                        <label 
                          key={project._id}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            marginBottom: '4px',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <input
                            type="checkbox"
                            checked={formData.projectIds.includes(project._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ 
                                  ...formData, 
                                  projectIds: [...formData.projectIds, project._id] 
                                });
                              } else {
                                setFormData({ 
                                  ...formData, 
                                  projectIds: formData.projectIds.filter(id => id !== project._id) 
                                });
                              }
                            }}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                              {project.name}
                            </div>
                            {project.code && (
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                Code: {project.code}
                              </div>
                            )}
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                    Select projects where this SLA rule should apply. Leave empty to apply to all projects.
                  </p>
                </div>

                {/* Active Status */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                      Active (rule will be applied immediately)
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingRule(null);
                      setFormData({
                        name: '',
                        description: '',
                        priority: 'Normal',
                        responseTimeValue: '',
                        responseTimeUnit: 'minutes',
                        resolutionTimeValue: '',
                        resolutionTimeUnit: 'hours',
                        isActive: true,
                        projectIds: [],
                      });
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {editingRule ? 'Update SLA Rule' : 'Create SLA Rule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SLARulesPage;
