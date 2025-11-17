import { useEffect, useState } from 'react';
import { useNavigate, useParams, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';

// Import existing super admin components
import ActivityLogs from '../components/ActivityLogs';
import AccessLogs from '../components/AccessLogs';
import KnowledgeBaseViewer from '../components/KnowledgeBaseViewer';

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
  const { customUrlPath } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Get project context
    const projectContext = localStorage.getItem('projectContext');
    if (projectContext) {
      const context = JSON.parse(projectContext);
      setProjectId(context.projectId);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchTickets();
    }
  }, [projectId]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:3003/api/tickets/agent/assigned',
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { projectId },
        }
      );
      console.log('Fetched tickets:', response.data);
      setTickets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'open': 'background: #fef3c7; color: #92400e; border-color: #fbbf24',
      'in-progress': 'background: #dbeafe; color: #1e40af; border-color: #3b82f6',
      'pending': 'background: #fce7f3; color: #9f1239; border-color: #ec4899',
      'resolved': 'background: #d1fae5; color: #065f46; border-color: #10b981',
      'closed': 'background: #e5e7eb; color: #374151; border-color: #6b7280',
    };
    return colors[status.toLowerCase()] || colors.open;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'critical': 'background: #fee2e2; color: #991b1b',
      'urgent': 'background: #fed7aa; color: #9a3412',
      'high': 'background: #fef3c7; color: #92400e',
      'medium': 'background: #dbeafe; color: #1e40af',
      'low': 'background: #e5e7eb; color: #374151',
    };
    return colors[priority.toLowerCase()] || colors.medium;
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>My Tickets</h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>Tickets assigned to you</p>
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ color: '#6b7280', marginTop: '16px' }}>Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>My Tickets</h1>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>
        {tickets.length === 0 ? 'No tickets assigned yet' : `${tickets.length} ticket(s) assigned to you`}
      </p>
      
      {tickets.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          textAlign: 'center'
        }}>
          <svg style={{ width: '64px', height: '64px', color: '#d1d5db', margin: '0 auto' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p style={{ color: '#6b7280', marginTop: '16px' }}>No tickets assigned yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() => navigate(`/${customUrlPath}/portal/ticket/${ticket._id}`)}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#6b7280' }}>
                      #{ticket.ticketNumber}
                    </span>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '12px', 
                      fontWeight: '500',
                      border: '1px solid',
                      ...(() => {
                        const style = getStatusColor(ticket.status);
                        return Object.fromEntries(style.split('; ').map(s => s.split(': ')));
                      })()
                    }}>
                      {ticket.status}
                    </span>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '9999px', 
                      fontSize: '12px', 
                      fontWeight: '500',
                      ...(() => {
                        const style = getPriorityColor(ticket.priority);
                        return Object.fromEntries(style.split('; ').map(s => s.split(': ')));
                      })()
                    }}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                    {ticket.title || ticket.subject || 'No subject'}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                    {ticket.description ? 
                      (ticket.description.length > 150 ? 
                        ticket.description.substring(0, 150) + '...' : 
                        ticket.description) 
                      : 'No description'}
                  </p>
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                fontSize: '13px', 
                color: '#6b7280',
                paddingTop: '12px',
                borderTop: '1px solid #f3f4f6'
              }}>
                {ticket.category && (
                  <span>📂 {ticket.category}</span>
                )}
                {ticket.createdBy && (
                  <span>👤 {ticket.createdBy.firstName} {ticket.createdBy.lastName}</span>
                )}
                {ticket.metadata?.studentEmail && (
                  <span>✉️ {ticket.metadata.studentEmail}</span>
                )}
                <span>🕒 {new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
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
        const primaryColor = brandingData.branding.colorTheme.primary;
        
        root.style.setProperty('--primary-main', primaryColor);
        root.style.setProperty('--primary-dark', brandingData.branding.colorTheme.secondary);
        root.style.setProperty('--accent-main', brandingData.branding.colorTheme.accent);
        
        // Create a lighter version of primary color for hover states
        // Convert hex to RGB and add alpha for light variant
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null;
        };
        
        const rgb = hexToRgb(primaryColor);
        if (rgb) {
          // Create light version with 15% opacity over white
          root.style.setProperty('--primary-light', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
        }
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
    const roleModules: Record<string, Record<string, boolean>> = {
      'SUPERADMIN': { dashboard: true, tickets: true, knowledgeBase: true, users: true, audit: true, all: true },
      'AGENT': { dashboard: true, tickets: true, knowledgeBase: true },
      'HELPDESK': { dashboard: true, tickets: true, knowledgeBase: true },
      'MANAGER': { dashboard: true, tickets: true, knowledgeBase: true, users: true, audit: true },
      'SUPERVISOR': { dashboard: true, tickets: true, knowledgeBase: true, users: true },
    };

    return roleModules[roleCode] || { dashboard: true };
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
        <Route path="/knowledge-base" element={<KnowledgeBaseViewer />} />
        <Route path="/audit/activity-logs" element={<ActivityLogs />} />
        <Route path="/audit/access-logs" element={<AccessLogs />} />
        <Route path="/" element={<AgentDashboardContent />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ProjectPortalDashboard;
