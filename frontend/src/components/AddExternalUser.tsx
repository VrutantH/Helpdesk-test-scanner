import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RoleConfirmationModal from './RoleConfirmationModal';

interface Props {
  user?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const AddExternalUser = ({ user, onClose, onSuccess }: Props) => {
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    password: '',
    confirmPassword: '',
  });
  const [role, setRole] = useState(user?.role || 'user');
  const [permissions, setPermissions] = useState<string[]>(user?.permissions || []);
  const [customPermissions, setCustomPermissions] = useState<string[]>(user?.customPermissions || []);
  const [saving, setSaving] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || (!user && !formData.password)) {
      alert(i18n.language === 'en' ? 'Please fill in all required fields' : 'कृपया सर्व आवश्यक फील्ड भरा');
      return;
    }

    if (!user && formData.password !== formData.confirmPassword) {
      alert(i18n.language === 'en' ? 'Passwords do not match' : 'पासवर्ड जुळत नाहीत');
      return;
    }

    if (!user && formData.password.length < 8) {
      alert(i18n.language === 'en' ? 'Password must be at least 8 characters' : 'पासवर्ड किमान 8 वर्णांचा असावा');
      return;
    }

    try {
      setSaving(true);

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role,
        permissions,
        customPermissions,
      };

      const response = await fetch(
        user ? `http://localhost:3003/api/users/${user._id}` : 'http://localhost:3003/api/users/external',
        {
          method: user ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(
          user 
            ? (i18n.language === 'en' ? 'User updated successfully' : 'वापरकर्ता यशस्वीरित्या अद्यतनित केला')
            : (i18n.language === 'en' ? 'User added successfully' : 'वापरकर्ता यशस्वीरित्या जोडला')
        );
        onSuccess();
      } else {
        alert(data.message || 'Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert(i18n.language === 'en' ? 'Failed to save user' : 'वापरकर्ता जतन करण्यात अयशस्वी');
    } finally {
      setSaving(false);
    }
  };

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
        maxWidth: '600px',
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
              {user
                ? (i18n.language === 'en' ? 'Edit External User' : 'बाह्य वापरकर्ता संपादित करा')
                : (i18n.language === 'en' ? 'Add External User' : 'बाह्य वापरकर्ता जोडा')
              }
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              {i18n.language === 'en' ? 'Manually add external user details' : 'बाह्य वापरकर्ता तपशील व्यक्तिचलितपणे जोडा'}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {/* First Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px',
              }}>
                {i18n.language === 'en' ? 'First Name' : 'पहिले नाव'} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={i18n.language === 'en' ? 'Enter first name' : 'पहिले नाव प्रविष्ट करा'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px',
              }}>
                {i18n.language === 'en' ? 'Last Name' : 'आडनाव'} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={i18n.language === 'en' ? 'Enter last name' : 'आडनाव प्रविष्ट करा'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Email */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px',
              }}>
                {i18n.language === 'en' ? 'Email' : 'ईमेल'} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={i18n.language === 'en' ? 'Enter email address' : 'ईमेल पत्ता प्रविष्ट करा'}
                disabled={!!user}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: user ? '#f9fafb' : 'white',
                  cursor: user ? 'not-allowed' : 'text',
                }}
              />
            </div>

            {/* Mobile */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px',
              }}>
                {i18n.language === 'en' ? 'Mobile Number' : 'मोबाईल नंबर'}
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder={i18n.language === 'en' ? 'Enter mobile number' : 'मोबाईल नंबर प्रविष्ट करा'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {!user && (
              <>
                {/* Password */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                  }}>
                    {i18n.language === 'en' ? 'Password' : 'पासवर्ड'} <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={i18n.language === 'en' ? 'Enter password (min 8 chars)' : 'पासवर्ड प्रविष्ट करा'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px',
                  }}>
                    {i18n.language === 'en' ? 'Confirm Password' : 'पासवर्डची पुष्टी करा'} <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={i18n.language === 'en' ? 'Re-enter password' : 'पासवर्ड पुन्हा प्रविष्ट करा'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Role and Permissions */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {i18n.language === 'en' ? 'Role & Permissions' : 'भूमिका आणि परवानग्या'}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                  {i18n.language === 'en' ? 'Role' : 'भूमिका'}: <strong style={{ textTransform: 'capitalize' }}>{role}</strong>
                  {' • '}
                  {permissions.length + customPermissions.length} {i18n.language === 'en' ? 'permissions' : 'परवानग्या'}
                </div>
              </div>
              <button
                onClick={() => setShowRoleModal(true)}
                style={{
                  backgroundColor: '#a855f7',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                ⚙️ {i18n.language === 'en' ? 'Configure' : 'कॉन्फिगर करा'}
              </button>
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
            onClick={handleSave}
            disabled={saving}
            style={{
              backgroundColor: saving ? '#9ca3af' : '#a855f7',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '500',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving 
              ? (i18n.language === 'en' ? 'Saving...' : 'जतन करत आहे...')
              : (user
                  ? (i18n.language === 'en' ? 'Update User' : 'वापरकर्ता अद्यतनित करा')
                  : (i18n.language === 'en' ? 'Add User' : 'वापरकर्ता जोडा')
                )
            }
          </button>
        </div>
      </div>

      {/* Role Configuration Modal */}
      {showRoleModal && (
        <RoleConfirmationModal
          employee={{
            firstName: formData.firstName,
            lastName: formData.lastName,
            designation: 'External User',
            assignedRole: role,
            permissions,
            customPermissions,
          }}
          onClose={() => setShowRoleModal(false)}
          onConfirm={(newRole: string, newPermissions: string[], newCustomPermissions: string[]) => {
            setRole(newRole);
            setPermissions(newPermissions);
            setCustomPermissions(newCustomPermissions);
            setShowRoleModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AddExternalUser;
