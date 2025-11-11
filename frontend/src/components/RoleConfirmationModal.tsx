import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  employee: {
    firstName: string;
    lastName: string;
    designation: string;
    assignedRole: string;
    permissions: string[];
    customPermissions: string[];
  };
  onClose: () => void;
  onConfirm: (role: string, permissions: string[], customPermissions: string[]) => void;
}

// Available roles
const ROLES = [
  { value: 'user', label: 'User', labelMr: 'वापरकर्ता' },
  { value: 'agent', label: 'Agent', labelMr: 'एजंट' },
  { value: 'admin', label: 'Admin', labelMr: 'प्रशासक' },
  { value: 'super_admin', label: 'Super Admin', labelMr: 'सुपर प्रशासक' },
];

// Available permissions
const PERMISSIONS = {
  tickets: [
    { code: 'view_tickets', label: 'View Tickets', labelMr: 'तिकिटे पहा' },
    { code: 'create_tickets', label: 'Create Tickets', labelMr: 'तिकिटे तयार करा' },
    { code: 'edit_tickets', label: 'Edit Tickets', labelMr: 'तिकिटे संपादित करा' },
    { code: 'delete_tickets', label: 'Delete Tickets', labelMr: 'तिकिटे हटवा' },
    { code: 'assign_tickets', label: 'Assign Tickets', labelMr: 'तिकिटे नियुक्त करा' },
    { code: 'close_tickets', label: 'Close Tickets', labelMr: 'तिकिटे बंद करा' },
  ],
  users: [
    { code: 'view_users', label: 'View Users', labelMr: 'वापरकर्ते पहा' },
    { code: 'create_users', label: 'Create Users', labelMr: 'वापरकर्ते तयार करा' },
    { code: 'edit_users', label: 'Edit Users', labelMr: 'वापरकर्ते संपादित करा' },
    { code: 'delete_users', label: 'Delete Users', labelMr: 'वापरकर्ते हटवा' },
  ],
  projects: [
    { code: 'view_projects', label: 'View Projects', labelMr: 'प्रकल्प पहा' },
    { code: 'create_projects', label: 'Create Projects', labelMr: 'प्रकल्प तयार करा' },
    { code: 'edit_projects', label: 'Edit Projects', labelMr: 'प्रकल्प संपादित करा' },
    { code: 'delete_projects', label: 'Delete Projects', labelMr: 'प्रकल्प हटवा' },
  ],
  reports: [
    { code: 'view_reports', label: 'View Reports', labelMr: 'अहवाल पहा' },
    { code: 'export_reports', label: 'Export Reports', labelMr: 'अहवाल निर्यात करा' },
  ],
  settings: [
    { code: 'view_settings', label: 'View Settings', labelMr: 'सेटिंग्ज पहा' },
    { code: 'edit_settings', label: 'Edit Settings', labelMr: 'सेटिंग्ज संपादित करा' },
  ],
};

// Default permissions for each role
const ROLE_PERMISSIONS: Record<string, string[]> = {
  user: ['view_tickets', 'create_tickets'],
  agent: ['view_tickets', 'create_tickets', 'edit_tickets', 'assign_tickets', 'close_tickets', 'view_users'],
  admin: ['view_tickets', 'create_tickets', 'edit_tickets', 'delete_tickets', 'assign_tickets', 'close_tickets', 'view_users', 'create_users', 'edit_users', 'view_projects', 'view_reports', 'view_settings'],
  super_admin: Object.values(PERMISSIONS).flat().map(p => p.code),
};

const RoleConfirmationModal = ({ employee, onClose, onConfirm }: Props) => {
  const { i18n } = useTranslation();
  const [selectedRole, setSelectedRole] = useState(employee.assignedRole);
  const [rolePermissions, setRolePermissions] = useState<string[]>(
    employee.permissions.length > 0 ? employee.permissions : ROLE_PERMISSIONS[employee.assignedRole] || []
  );
  const [customPermissions, setCustomPermissions] = useState<string[]>(employee.customPermissions);

  // Update permissions when role changes
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setRolePermissions(ROLE_PERMISSIONS[role] || []);
  };

  // Toggle permission
  const togglePermission = (code: string) => {
    if (rolePermissions.includes(code)) {
      setRolePermissions(rolePermissions.filter(p => p !== code));
    } else {
      setRolePermissions([...rolePermissions, code]);
    }
  };

  // Toggle custom permission
  const toggleCustomPermission = (code: string) => {
    if (customPermissions.includes(code)) {
      setCustomPermissions(customPermissions.filter(p => p !== code));
    } else {
      setCustomPermissions([...customPermissions, code]);
    }
  };

  // Get all permissions (role + custom)
  const allPermissions = [...new Set([...rolePermissions, ...customPermissions])];

  const handleConfirm = () => {
    onConfirm(selectedRole, rolePermissions, customPermissions);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
            {i18n.language === 'en' ? 'Configure Role & Permissions' : 'भूमिका आणि परवानग्या कॉन्फिगर करा'}
          </h3>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
            {employee.firstName} {employee.lastName} • {employee.designation}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {/* Role Selection */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '12px',
            }}>
              {i18n.language === 'en' ? 'Assign Role' : 'भूमिका नियुक्त करा'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {ROLES.map((role) => (
                <div
                  key={role.value}
                  onClick={() => handleRoleChange(role.value)}
                  style={{
                    padding: '12px 16px',
                    border: `2px solid ${selectedRole === role.value ? '#a855f7' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedRole === role.value ? '#f3e8ff' : 'white',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="radio"
                      checked={selectedRole === role.value}
                      onChange={() => handleRoleChange(role.value)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      {i18n.language === 'en' ? role.label : role.labelMr}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Permissions */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                {i18n.language === 'en' ? 'Role Permissions' : 'भूमिका परवानग्या'}
              </label>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {rolePermissions.length} {i18n.language === 'en' ? 'permissions' : 'परवानग्या'}
              </span>
            </div>
            
            {Object.entries(PERMISSIONS).map(([category, perms]) => (
              <div key={category} style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}>
                  {category}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {perms.map((perm) => {
                    const isRolePermission = rolePermissions.includes(perm.code);
                    const isCustomPermission = customPermissions.includes(perm.code);
                    const isChecked = isRolePermission || isCustomPermission;
                    
                    return (
                      <label
                        key={perm.code}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          borderRadius: '6px',
                          backgroundColor: isChecked ? '#f3f4f6' : 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isRolePermission) {
                              togglePermission(perm.code);
                            } else {
                              toggleCustomPermission(perm.code);
                            }
                          }}
                          style={{ width: '16px', height: '16px' }}
                        />
                        <span style={{ fontSize: '13px', color: '#374151' }}>
                          {i18n.language === 'en' ? perm.label : perm.labelMr}
                        </span>
                        {isCustomPermission && (
                          <span style={{
                            fontSize: '10px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '2px 6px',
                            borderRadius: '10px',
                          }}>
                            +
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              {i18n.language === 'en' ? 'Summary' : 'सारांश'}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              <div>• {i18n.language === 'en' ? 'Role' : 'भूमिका'}: <strong>{ROLES.find(r => r.value === selectedRole)?.label}</strong></div>
              <div>• {i18n.language === 'en' ? 'Total Permissions' : 'एकूण परवानग्या'}: <strong>{allPermissions.length}</strong></div>
              <div>• {i18n.language === 'en' ? 'Custom Permissions' : 'कस्टम परवानग्या'}: <strong>{customPermissions.length}</strong></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {i18n.language === 'en' ? 'Cancel' : 'रद्द करा'}
          </button>
          
          <button
            onClick={handleConfirm}
            style={{
              backgroundColor: '#a855f7',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {i18n.language === 'en' ? 'Confirm' : 'पुष्टी करा'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleConfirmationModal;
