import { useEffect, useState } from 'react';
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

// Import existing super admin components
import ActivityLogs from '../components/ActivityLogs';
import AccessLogs from '../components/AccessLogs';
import KnowledgeBaseManagement from '../components/KnowledgeBaseManagement';

interface ProjectBranding {
  projectId: string;
  name: string;
  code: string;
  branding?: {
    logo?: string | null;
    colorTheme?: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
    };
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: {
    name: string;
    code: string;
  };
}

// Simple Dashboard component for agents
const AgentDashboardContent = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Overview of your work</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Stats cards */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Tickets</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#111827' }}>0</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Pending</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b' }}>0</div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Resolved</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>0</div>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recent Activity</h2>
        <p style={{ color: '#6b7280' }}>No recent activity</p>
      </div>
    </div>
  );
};

// Tickets component for agents
const AgentTicketsContent = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>My Tickets</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Tickets assigned to you</p>
      
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
      }}>
        <p style={{ color: '#6b7280' }}>No tickets assigned yet</p>
      </div>
    </div>
  );
};

const ProjectPortalDashboard = () => {
  const navigate = useNavigate();
  const { customUrlPath } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [projectBranding, setProjectBranding] = useState<ProjectBranding | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(`/${customUrlPath}/portal/login`);
      return;
    }

    initializePortal(token);
  }, [customUrlPath, navigate]);

  const initializePortal = async (token: string) => {
    try {
      // Get user data
      const userResponse = await axios.get('http://localhost:3003/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = userResponse.data.data;

      // Block students
      if (userData.role.code === 'STUDENT') {
        localStorage.removeItem('token');
        navigate(`/${customUrlPath}/portal/login`);
        return;
      }

      setUser(userData);

      // Get project branding
      const brandingResponse = await axios.get(
        `http://localhost:3003/api/projects/branding/${customUrlPath}`
      );
      const brandingData = brandingResponse.data.success 
        ? brandingResponse.data.data 
        : brandingResponse.data;
      
      setProjectBranding(brandingData);

      // Apply project theme
      if (brandingData?.branding?.colorTheme) {
        const root = document.documentElement;
        root.style.setProperty('--primary-main', brandingData.branding.colorTheme.primary);
        root.style.setProperty('--primary-dark', brandingData.branding.colorTheme.secondary);
        root.style.setProperty('--accent-main', brandingData.branding.colorTheme.accent);
      }

      // Set module access based on role
      const moduleAccess = getModuleAccessForRole(userData.role.code);
      localStorage.setItem('moduleAccess', JSON.stringify(moduleAccess));
      localStorage.setItem('userName', userData.name || `${userData.firstName} ${userData.lastName}`);
      
      // Store project context
      localStorage.setItem('projectContext', JSON.stringify({
        projectId: brandingData.projectId,
        projectName: brandingData.name,
        customUrlPath: customUrlPath
      }));

      setLoading(false);
    } catch (error) {
      console.error('Error initializing portal:', error);
      localStorage.removeItem('token');
      navigate(`/${customUrlPath}/portal/login`);
    }
  };

  const getModuleAccessForRole = (roleCode: string) => {
    // Define which modules each role can access
    const roleModules: Record<string, string[]> = {
      'SUPERADMIN': ['all'], // Super admin sees everything
      'AGENT': ['dashboard', 'tickets', 'knowledge-base'],
      'MANAGER': ['dashboard', 'tickets', 'knowledge-base', 'users', 'audit'],
      'SUPERVISOR': ['dashboard', 'tickets', 'knowledge-base', 'users'],
    };

    return roleModules[roleCode] || ['dashboard'];
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: '#f9fafb'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/dashboard" element={<AgentDashboardContent />} />
        <Route path="/tickets" element={<AgentTicketsContent />} />
        <Route path="/knowledge-base" element={<KnowledgeBaseManagement />} />
        <Route path="/audit/activity-logs" element={<ActivityLogs />} />
        <Route path="/audit/access-logs" element={<AccessLogs />} />
        <Route path="/" element={<AgentDashboardContent />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ProjectPortalDashboard;
