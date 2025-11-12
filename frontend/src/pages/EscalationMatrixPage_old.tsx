import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

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

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

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
  const [policies, setPolicies] = useState<EscalationPolicy[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleCreatePolicy = async () => {
    const samplePolicy: EscalationPolicy = {
      policyId: `EP${String(policies.length + 1).padStart(3, '0')}`,
      name: `Sample Escalation Policy ${policies.length + 1}`,
      description: 'Sample escalation policy',
      levels: [
        {
          level: 1,
          escalateAfter: { value: 30, unit: 'minutes' },
          escalateTo: {
            type: 'group',
            targetId: 'group1',
            targetName: 'Support Team Lead',
          },
          notifyMethod: ['email'],
        },
        {
          level: 2,
          escalateAfter: { value: 2, unit: 'hours' },
          escalateTo: {
            type: 'role',
            targetId: 'manager',
            targetName: 'Support Manager',
          },
          notifyMethod: ['email', 'sms'],
          actions: {
            changePriority: 'Urgent',
          },
        },
      ],
      isActive: true,
      createdBy: 'Admin',
    };

    try {
      const response = await fetch('http://localhost:3003/api/escalation-policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(samplePolicy),
      });

      if (response.ok) {
        alert('Escalation policy created successfully!');
        fetchPolicies();
      } else {
        const data = await response.json();
        alert(`Failed to create policy: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating policy:', error);
      alert('Error creating policy');
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

  const formatTime = (time: { value: number; unit: string }) => {
    return `${time.value} ${time.unit}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div>Loading escalation policies...</div>
      </div>
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
        marginBottom: '24px',
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
            Escalation Matrix
          </h1>
          <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Configure escalation policies for SLA breaches
          </p>
        </div>
        <button
          onClick={handleCreatePolicy}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: '#f97316',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          + Add Escalation Policy
        </button>
      </div>

      {/* Escalation Policies */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {policies.map((policy) => (
          <div
            key={policy._id || policy.policyId}
            style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
            }}
          >
            {/* Policy Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                  {policy.name}
                </h3>
                {policy.description && (
                  <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                    {policy.description}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleToggleStatus(policy)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    background: policy.isActive ? '#dcfce7' : '#f3f4f6',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: policy.isActive ? '#166534' : '#6b7280',
                  }}
                >
                  {policy.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleDeletePolicy(policy)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #ef4444',
                    background: 'white',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Escalation Levels */}
            <div style={{ padding: '20px' }}>
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
            onClick={handleCreatePolicy}
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
            Create Sample Policy
          </button>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default EscalationMatrixPage;
