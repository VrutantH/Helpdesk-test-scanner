import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    email: '',
    role: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    // Get user data from localStorage
    const email = localStorage.getItem('userEmail') || '';
    const role = localStorage.getItem('userRole') || '';
    const firstName = localStorage.getItem('userFirstName') || '';
    const lastName = localStorage.getItem('userLastName') || '';

    setUserData({ email, role, firstName, lastName });
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      <div style={{ padding: '2rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
            Welcome to SAC Helpdesk
          </h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '1rem', color: '#6B7280', marginBottom: '0.5rem' }}>
              Logged in as: <strong style={{ color: '#111827' }}>{userData.firstName} {userData.lastName}</strong>
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Email: {userData.email}
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
              Role: {userData.role}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Total Tickets</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '8px',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Open Tickets</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '8px',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Resolved</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '8px',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>In Progress</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>0</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="/form-builder"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#2563EB',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background 0.2s'
                }}
              >
                Form Builder
              </a>
              <a
                href="/rbac"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#2563EB',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background 0.2s'
                }}
              >
                Role Management
              </a>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
