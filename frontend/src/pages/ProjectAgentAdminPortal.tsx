import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  HomeIcon,
  TicketIcon,
  BookOpenIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

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

interface Permission {
  module: string;
  actions: string[]; // ['view', 'create', 'edit', 'delete', 'export']
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: {
    name: string;
    code: string;
    _id: string;
  };
  permissions: Permission[];
}

type ActiveModule = 
  | 'dashboard' 
  | 'tickets' 
  | 'knowledge-base' 
  | 'users'
  | 'projects'
  | 'master-data'
  | 'rbac'
  | 'settings';

interface MenuItem {
  id: ActiveModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPermission: string; // module name that user must have permission for
  subItems?: {
    id: string;
    label: string;
    requiredAction?: string; // specific action required (e.g., 'edit', 'create')
  }[];
}

const ProjectAgentAdminPortal: React.FC = () => {
  const navigate = useNavigate();
  const { customUrlPath } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [projectBranding, setProjectBranding] = useState<ProjectBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPermissions, setUserPermissions] = useState<Map<string, string[]>>(new Map());

  // Define all possible menu items
  const allMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: HomeIcon,
      requiredPermission: 'dashboard',
    },
    {
      id: 'tickets',
      label: 'Tickets',
      icon: TicketIcon,
      requiredPermission: 'tickets',
      subItems: [
        { id: 'my-tickets', label: 'My Tickets' },
        { id: 'all-tickets', label: 'All Tickets', requiredAction: 'view_all' },
        { id: 'create-ticket', label: 'Create Ticket', requiredAction: 'create' },
      ],
    },
    {
      id: 'knowledge-base',
      label: 'Knowledge Base',
      icon: BookOpenIcon,
      requiredPermission: 'knowledge_base',
      subItems: [
        { id: 'browse', label: 'Browse Articles' },
        { id: 'manage', label: 'Manage Articles', requiredAction: 'edit' },
      ],
    },
    {
      id: 'users',
      label: 'User Management',
      icon: UserGroupIcon,
      requiredPermission: 'users',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: BuildingOfficeIcon,
      requiredPermission: 'projects',
    },
    {
      id: 'master-data',
      label: 'Master Data',
      icon: TableCellsIcon,
      requiredPermission: 'master_data',
    },
    {
      id: 'rbac',
      label: 'RBAC Setup',
      icon: ShieldCheckIcon,
      requiredPermission: 'rbac',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Cog6ToothIcon,
      requiredPermission: 'settings',
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate(`/${customUrlPath}/agent/login`);
      return;
    }

    fetchUserData(token);
    fetchProjectBranding();
  }, [customUrlPath, navigate]);

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:3003/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.data;

      // Verify not a student
      if (userData.role.code === 'STUDENT') {
        localStorage.removeItem('authToken');
        navigate(`/${customUrlPath}/agent/login`);
        return;
      }

      setUser(userData);
      
      // Fetch user permissions
      await fetchUserPermissions(token, userData._id);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('authToken');
      navigate(`/${customUrlPath}/agent/login`);
    }
  };

  const fetchUserPermissions = async (token: string, userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3003/api/users/${userId}/permissions`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { projectId: projectBranding?.projectId },
        }
      );
      
      const permissions = response.data.data || [];
      const permMap = new Map<string, string[]>();
      
      permissions.forEach((perm: Permission) => {
        permMap.set(perm.module, perm.actions);
      });
      
      setUserPermissions(permMap);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      // Set default permissions for demo
      setUserPermissions(new Map([
        ['dashboard', ['view']],
        ['tickets', ['view', 'create', 'edit']],
        ['knowledge_base', ['view']],
      ]));
    }
  };

  const fetchProjectBranding = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3003/api/projects/branding/${customUrlPath}`
      );
      // Handle both response formats: { success: true, data: {...} } or direct data
      const brandingData = response.data.success ? response.data.data : response.data;
      console.log('Fetched project branding:', brandingData);
      setProjectBranding(brandingData);
    } catch (error) {
      console.error('Error fetching project branding:', error);
      // Set default branding if fetch fails
      setProjectBranding({
        projectId: '',
        name: 'Helpdesk',
        code: 'DEFAULT',
        branding: {
          logo: null,
          colorTheme: {
            primary: '#667eea',
            secondary: '#764ba2',
            accent: '#3b82f6',
            background: '#ffffff'
          }
        }
      });
    }
  };

  const hasPermission = (module: string, action?: string): boolean => {
    const modulePermissions = userPermissions.get(module);
    if (!modulePermissions || modulePermissions.length === 0) {
      return false;
    }
    
    if (!action) {
      return modulePermissions.includes('view');
    }
    
    return modulePermissions.includes(action);
  };

  const getVisibleMenuItems = (): MenuItem[] => {
    return allMenuItems.filter(item => {
      // Check if user has permission for this module
      if (!hasPermission(item.requiredPermission)) {
        return false;
      }
      
      // Filter sub-items based on permissions
      if (item.subItems) {
        item.subItems = item.subItems.filter(subItem => {
          if (!subItem.requiredAction) return true;
          return hasPermission(item.requiredPermission, subItem.requiredAction);
        });
      }
      
      return true;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate(`/${customUrlPath}/agent/login`);
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule user={user} permissions={userPermissions} />;
      case 'tickets':
        return <TicketsModule user={user} permissions={userPermissions} />;
      case 'knowledge-base':
        return <KnowledgeBaseModule user={user} permissions={userPermissions} />;
      case 'users':
        return <UserManagementModule user={user} permissions={userPermissions} />;
      case 'projects':
        return <ProjectsModule user={user} permissions={userPermissions} />;
      case 'master-data':
        return <MasterDataModule user={user} permissions={userPermissions} />;
      case 'rbac':
        return <RBACModule user={user} permissions={userPermissions} />;
      case 'settings':
        return <SettingsModule user={user} permissions={userPermissions} />;
      default:
        return <DashboardModule user={user} permissions={userPermissions} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const visibleMenuItems = getVisibleMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div
          className="h-20 flex items-center justify-between px-6"
          style={{
            background: projectBranding?.branding?.colorTheme
              ? `linear-gradient(135deg, ${projectBranding.branding.colorTheme.primary} 0%, ${projectBranding.branding.colorTheme.secondary} 100%)`
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className="flex items-center space-x-3">
            {projectBranding?.branding?.logo && (
              <img
                src={projectBranding.branding.logo}
                alt={projectBranding.name}
                className="h-10 w-10 rounded-lg"
              />
            )}
            <div className="text-white">
              <h1 className="text-lg font-bold">{projectBranding?.name || 'Helpdesk'}</h1>
              <p className="text-xs opacity-90">Agent Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => {
                    setActiveModule(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
                
                {/* Sub-items */}
                {item.subItems && item.subItems.length > 0 && isActive && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role.name}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-20 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeModule.charAt(0).toUpperCase() + activeModule.slice(1).replace('-', ' ')}
              </h2>
              <p className="text-sm text-gray-600">
                {user?.role.name} Portal
              </p>
            </div>
          </div>
          
          {/* Role Badge */}
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
              {user?.role.name}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {renderModuleContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

// Placeholder Module Components (to be replaced with full implementations)

const DashboardModule: React.FC<{ user: User | null; permissions: Map<string, string[]> }> = ({ user, permissions }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Dashboard Overview</h3>
      <p className="text-gray-600">Dashboard content for {user?.role.name}</p>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          Permissions: {Array.from(permissions.entries()).map(([module, actions]) => 
            `${module}: ${actions && Array.isArray(actions) ? actions.join(', ') : 'none'}`
          ).join(' | ') || 'No permissions loaded'}
        </p>
      </div>
    </div>
  );
};

const TicketsModule: React.FC<{ user: User | null; permissions: Map<string, string[]> }> = ({ user, permissions }) => {
  const canCreate = permissions.get('tickets')?.includes('create');
  const canEdit = permissions.get('tickets')?.includes('edit');
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Tickets</h3>
        {canCreate && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Ticket
          </button>
        )}
      </div>
      <p className="text-gray-600">Tickets module for {user?.role.name}</p>
      <p className="text-sm text-gray-500 mt-2">
        Permissions: View {canCreate && '• Create'} {canEdit && '• Edit'}
      </p>
    </div>
  );
};

const KnowledgeBaseModule: React.FC<{ user: User | null; permissions: Map<string, string[]> }> = ({ user, permissions }) => {
  const canEdit = permissions.get('knowledge_base')?.includes('edit');
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Knowledge Base</h3>
        {canEdit && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Article
          </button>
        )}
      </div>
      <p className="text-gray-600">Knowledge Base for {user?.role.name}</p>
      <p className="text-sm text-gray-500 mt-2">
        {canEdit ? 'Can view and edit articles' : 'Can view articles only'}
      </p>
    </div>
  );
};

const UserManagementModule: React.FC<{ user: User | null; permissions: Map<string, string[]> }> = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">User Management</h3>
      <p className="text-gray-600">User management module</p>
    </div>
  );
};

const ProjectsModule: React.FC<{ user: User | null; permissions: Map<string, string[]> }> = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Projects</h3>
      <p className="text-gray-600">Projects module</p>
    </div>
  );
};

const MasterDataModule: React.FC<{ user: User | null; permissions: Map<string, string[]> }> = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Master Data</h3>
      <p className="text-gray-600">Master data management</p>
    </div>
  );
};

const RBACModule: React.FC<{ user: User | null; permissions: Map<string, string[]> }> = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">RBAC Setup</h3>
      <p className="text-gray-600">Role-based access control configuration</p>
    </div>
  );
};

const SettingsModule: React.FC<{ user: User | null; permissions: Map<string, string[]> }> = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Settings</h3>
      <p className="text-gray-600">System settings and configuration</p>
    </div>
  );
};

export default ProjectAgentAdminPortal;
