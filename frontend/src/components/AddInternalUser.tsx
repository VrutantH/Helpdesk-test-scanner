import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RoleConfirmationModal from './RoleConfirmationModal';

interface Employee {
  employeeId: string;
  hrmsCode: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  designation: string;
  department: string;
  reportingManagerName?: string;
  role?: string;
  alreadyAdded?: boolean;
}

interface SelectedEmployee extends Employee {
  assignedRole: string;
  permissions: string[];
  customPermissions: string[];
}

interface Props {
  user?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const AddInternalUser = ({ user, onClose, onSuccess }: Props) => {
  const { i18n } = useTranslation();
  const [step, setStep] = useState(1); // 1: Enter HRMS Code, 2: Select Employees, 3: Assign Roles
  const [hrmsCode, setHrmsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<SelectedEmployee | null>(null);

  // Role mapping from HRMS roles
  const roleMapping: Record<string, string> = {
    'developer': 'agent',
    'team_lead': 'admin',
    'manager': 'admin',
    'qa': 'agent',
    'default': 'user',
  };

  // Fetch employees from HRMS
  const fetchEmployees = async () => {
    if (!hrmsCode.trim()) {
      alert(i18n.language === 'en' ? 'Please enter HRMS code' : 'कृपया HRMS कोड प्रविष्ट करा');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3003/api/users/hrms/${hrmsCode}/employees`, {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setEmployees(data.data);
        setStep(2);
      } else {
        alert(data.message || 'Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert(i18n.language === 'en' ? 'Failed to fetch employees from HRMS' : 'HRMS मधून कर्मचारी मिळवण्यात अयशस्वी');
    } finally {
      setLoading(false);
    }
  };

  // Toggle employee selection
  const toggleEmployee = (employee: Employee) => {
    if (employee.alreadyAdded) return;

    const isSelected = selectedEmployees.some(emp => emp.employeeId === employee.employeeId);
    
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter(emp => emp.employeeId !== employee.employeeId));
    } else {
      // Auto-assign role based on HRMS role
      const assignedRole = roleMapping[employee.role || 'default'] || 'user';
      setSelectedEmployees([...selectedEmployees, {
        ...employee,
        assignedRole,
        permissions: [],
        customPermissions: [],
      }]);
    }
  };

  // Show role configuration modal
  const configureRole = (employee: SelectedEmployee) => {
    setCurrentEmployee(employee);
    setShowRoleModal(true);
  };

  // Update employee role and permissions
  const updateEmployeeRole = (employeeId: string, role: string, permissions: string[], customPermissions: string[]) => {
    setSelectedEmployees(selectedEmployees.map(emp => 
      emp.employeeId === employeeId 
        ? { ...emp, assignedRole: role, permissions, customPermissions }
        : emp
    ));
  };

  // Save selected employees
  const handleSave = async () => {
    if (selectedEmployees.length === 0) {
      alert(i18n.language === 'en' ? 'Please select at least one employee' : 'कृपया किमान एक कर्मचारी निवडा');
      return;
    }

    try {
      setSaving(true);
      
      const employeesData = selectedEmployees.map(emp => ({
        employeeId: emp.employeeId,
        hrmsCode: emp.hrmsCode,
        role: emp.assignedRole,
        permissions: emp.permissions,
        customPermissions: emp.customPermissions,
      }));

      const response = await fetch('http://localhost:3003/api/users/internal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          employees: employeesData,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`${data.data.totalCreated} ${i18n.language === 'en' ? 'user(s) added successfully' : 'वापरकर्ते यशस्वीरित्या जोडले'}`);
        if (data.data.errors.length > 0) {
          console.error('Some users could not be added:', data.data.errors);
        }
        onSuccess();
      } else {
        alert(data.message || 'Failed to add users');
      }
    } catch (error) {
      console.error('Error adding users:', error);
      alert(i18n.language === 'en' ? 'Failed to add users' : 'वापरकर्ते जोडण्यात अयशस्वी');
    } finally {
      setSaving(false);
    }
  };

  // Filter employees by search
  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: 0 }}>
              {i18n.language === 'en' ? 'Add Internal Users' : 'अंतर्गत वापरकर्ते जोडा'}
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              {step === 1 && (i18n.language === 'en' ? 'Step 1: Enter HRMS Code' : 'पायरी 1: HRMS कोड प्रविष्ट करा')}
              {step === 2 && (i18n.language === 'en' ? 'Step 2: Select Employees' : 'पायरी 2: कर्मचारी निवडा')}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                }}>
                  {i18n.language === 'en' ? 'HRMS Code' : 'HRMS कोड'} <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  value={hrmsCode}
                  onChange={(e) => setHrmsCode(e.target.value)}
                  placeholder={i18n.language === 'en' ? 'Enter HRMS code (e.g., DEPT001)' : 'HRMS कोड प्रविष्ट करा'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      fetchEmployees();
                    }
                  }}
                />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {i18n.language === 'en' 
                    ? 'Enter the HRMS code to fetch all employees under that code from PeopleStrong'
                    : 'PeopleStrong मधून त्या कोड अंतर्गत सर्व कर्मचारी मिळवण्यासाठी HRMS कोड प्रविष्ट करा'
                  }
                </p>
              </div>

              <button
                onClick={fetchEmployees}
                disabled={loading || !hrmsCode.trim()}
                style={{
                  backgroundColor: loading || !hrmsCode.trim() ? '#9ca3af' : '#a855f7',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: loading || !hrmsCode.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                }}
              >
                {loading ? (i18n.language === 'en' ? 'Fetching...' : 'मिळवत आहे...') : (i18n.language === 'en' ? 'Fetch Employees' : 'कर्मचारी मिळवा')}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              {/* Search */}
              <div style={{ marginBottom: '16px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder={i18n.language === 'en' ? 'Search employees...' : 'कर्मचारी शोधा...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 16px 10px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '18px',
                }}>🔍</span>
              </div>

              {/* Selected Count */}
              <div style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
              }}>
                {selectedEmployees.length} {i18n.language === 'en' ? 'employee(s) selected' : 'कर्मचारी निवडले'}
              </div>

              {/* Employees List */}
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                {filteredEmployees.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    {i18n.language === 'en' ? 'No employees found' : 'कोणतेही कर्मचारी सापडले नाहीत'}
                  </div>
                ) : (
                  filteredEmployees.map((employee) => {
                    const isSelected = selectedEmployees.some(emp => emp.employeeId === employee.employeeId);
                    const selectedEmp = selectedEmployees.find(emp => emp.employeeId === employee.employeeId);
                    
                    return (
                      <div
                        key={employee.employeeId}
                        style={{
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          marginBottom: '12px',
                          backgroundColor: employee.alreadyAdded ? '#f9fafb' : (isSelected ? '#f3e8ff' : 'white'),
                          opacity: employee.alreadyAdded ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleEmployee(employee)}
                          disabled={employee.alreadyAdded}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: employee.alreadyAdded ? 'not-allowed' : 'pointer',
                          }}
                        />
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>
                              {employee.firstName} {employee.lastName}
                            </span>
                            {employee.alreadyAdded && (
                              <span style={{
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '500',
                              }}>
                                {i18n.language === 'en' ? 'Already Added' : 'आधीच जोडले'}
                              </span>
                            )}
                          </div>
                          
                          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                            {employee.email} • {employee.employeeId}
                          </div>
                          
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                            {employee.designation} • {employee.department}
                            {employee.reportingManagerName && ` • Manager: ${employee.reportingManagerName}`}
                          </div>
                          
                          {isSelected && selectedEmp && (
                            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                              }}>
                                Role: {selectedEmp.assignedRole}
                              </span>
                              <button
                                onClick={() => configureRole(selectedEmp)}
                                style={{
                                  backgroundColor: '#f3f4f6',
                                  border: 'none',
                                  padding: '4px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  color: '#374151',
                                }}
                              >
                                ⚙️ {i18n.language === 'en' ? 'Configure Role' : 'भूमिका कॉन्फिगर करा'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
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
              ← {i18n.language === 'en' ? 'Back' : 'मागे'}
            </button>
          )}
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
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
            
            {step === 2 && (
              <button
                onClick={handleSave}
                disabled={saving || selectedEmployees.length === 0}
                style={{
                  backgroundColor: saving || selectedEmployees.length === 0 ? '#9ca3af' : '#a855f7',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: saving || selectedEmployees.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? (i18n.language === 'en' ? 'Saving...' : 'जतन करत आहे...') : (i18n.language === 'en' ? 'Add Users' : 'वापरकर्ते जोडा')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Role Configuration Modal */}
      {showRoleModal && currentEmployee && (
        <RoleConfirmationModal
          employee={currentEmployee}
          onClose={() => {
            setShowRoleModal(false);
            setCurrentEmployee(null);
          }}
          onConfirm={(role, permissions, customPermissions) => {
            updateEmployeeRole(currentEmployee.employeeId, role, permissions, customPermissions);
            setShowRoleModal(false);
            setCurrentEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default AddInternalUser;
