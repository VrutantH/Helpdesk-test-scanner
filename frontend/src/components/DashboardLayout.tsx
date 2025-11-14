import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { SkipLink } from './accessible/SkipLink';
import { LanguageToggle } from './LanguageToggle';
import { designSystem } from '../styles/designSystem';
import { 
  MdDashboard, 
  MdFolder, 
  MdSettings, 
  MdSecurity, 
  MdPeople,
  MdDescription,
  MdConfirmationNumber,
  MdDynamicForm,
  MdFlashOn,
  MdPerson,
  MdPhone,
  MdLink,
  MdAutoMode,
  MdAdd,
  MdUpdate,
  MdTimer,
  MdCheckCircle,
  MdAccountTree,
  MdSchedule,
  MdIntegrationInstructions,
  MdBarChart,
  MdFactCheck,
  MdHistory,
  MdLogin,
  MdBook,
  MdBlock,
  MdError,
  MdMailOutline,
  MdSyncProblem,
  MdWebhook,
  MdChat,
  MdLogout,
  MdMenu,
  MdChevronLeft,
  MdExpandMore
} from 'react-icons/md';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  path?: string;
  icon: ReactNode;
  label: string;
  labelHi?: string;
  labelMr?: string;
  subItems?: MenuItem[];
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [projectBranding, setProjectBranding] = useState<any>(null);

  // Fetch project branding if user is logged in via project portal
  useEffect(() => {
    const fetchProjectBranding = async () => {
      try {
        // Check if project context exists in localStorage
        const projectContextStr = localStorage.getItem('projectContext');
        if (!projectContextStr) return;

        const projectContext = JSON.parse(projectContextStr);
        if (projectContext.projectId) {
          // Fetch project details
          const response = await axios.get(
            `http://localhost:3003/api/projects/${projectContext.projectId}`
          );
          const project = response.data.data || response.data;
          
          // Set branding with proper structure
          setProjectBranding({
            name: project.name,
            code: project.code,
            logo: project.branding?.logo,
            colorTheme: project.branding?.colorTheme || {
              primary: '#667eea',
              secondary: '#764ba2',
              accent: '#3b82f6',
              background: '#ffffff'
            }
          });
        }
      } catch (error) {
        console.error('Error fetching project branding:', error);
      }
    };

    fetchProjectBranding();
  }, []);

  // Apply project color theme to CSS variables
  useEffect(() => {
    if (projectBranding?.colorTheme) {
      const root = document.documentElement;
      root.style.setProperty('--primary-main', projectBranding.colorTheme.primary);
      root.style.setProperty('--primary-dark', projectBranding.colorTheme.secondary);
      root.style.setProperty('--accent-main', projectBranding.colorTheme.accent);
    }
  }, [projectBranding]);

  // Helper function to get label in current language
  const getLabel = (item: MenuItem): string => {
    if (i18n.language === 'hi' && item.labelHi) return item.labelHi;
    if (i18n.language === 'mr' && item.labelMr) return item.labelMr;
    return item.label; // Default to English
  };

  // Helper function for common UI text
  const getText = (en: string, hi: string, mr: string): string => {
    if (i18n.language === 'hi') return hi;
    if (i18n.language === 'mr') return mr;
    return en;
  };

  // Check if user is a project user with limited access
  const moduleAccessStr = localStorage.getItem('moduleAccess');
  const isProjectUser = !!moduleAccessStr;
  const moduleAccess = moduleAccessStr ? JSON.parse(moduleAccessStr) : {};

  // All menu items for super admin
  const allMenuItems: MenuItem[] = [
    { path: '/dashboard', icon: <MdDashboard />, label: 'Dashboard', labelMr: 'डॅशबोर्ड' },
    { path: '/projects', icon: <MdFolder />, label: 'Project Management', labelMr: 'प्रकल्प व्यवस्थापन' },
    { path: '/master-data', icon: <MdSettings />, label: 'Master Data', labelMr: 'मास्टर डेटा' },
    { path: '/rbac', icon: <MdSecurity />, label: 'RBAC Setup', labelMr: 'RBAC सेटअप' },
    { path: '/users', icon: <MdPeople />, label: 'User Management', labelMr: 'वापरकर्ता व्यवस्थापन' },
    { 
      icon: <MdDescription />, 
      label: 'Fields & Forms', 
      labelMr: 'फील्ड आणि फॉर्म',
      subItems: [
        { path: '/fields-forms/ticket-fields', icon: <MdConfirmationNumber />, label: 'Ticket Fields', labelMr: 'तिकीट फील्ड' },
        { path: '/fields-forms/ticket-forms', icon: <MdDynamicForm />, label: 'Ticket Forms', labelMr: 'तिकीट फॉर्म' },
        { path: '/fields-forms/activity-fields', icon: <MdFlashOn />, label: 'Activity Fields', labelMr: 'अॅक्टिव्हिटी फील्ड' },
        { path: '/fields-forms/user-fields', icon: <MdPerson />, label: 'User Fields', labelMr: 'वापरकर्ता फील्ड' },
        { path: '/fields-forms/contact-fields', icon: <MdPhone />, label: 'Contact Group Fields', labelMr: 'संपर्क फील्ड' },
        { path: '/fields-forms/dependencies', icon: <MdLink />, label: 'Field Dependencies', labelMr: 'फील्ड अवलंबित्व' },
      ]
    },
    { 
      icon: <MdAutoMode />, 
      label: 'Ticket Automation', 
      labelMr: 'तिकीट ऑटोमेशन',
      subItems: [
        { path: '/ticket-automation/auto-assignments', icon: <MdAutoMode />, label: 'Auto Assignments', labelMr: 'ऑटो असाइनमेंट' },
        { path: '/ticket-automation/create-triggers', icon: <MdAdd />, label: 'Create Ticket Triggers', labelMr: 'तिकीट ट्रिगर तयार करा' },
        { path: '/ticket-automation/update-triggers', icon: <MdUpdate />, label: 'Update Ticket Triggers', labelMr: 'तिकीट ट्रिगर अद्यतनित करा' },
        { path: '/ticket-automation/time-triggers', icon: <MdTimer />, label: 'Time Triggers', labelMr: 'वेळ ट्रिगर' },
      ]
    },
    { path: '/approvals', icon: <MdCheckCircle />, label: 'Approval Process', labelMr: 'मंजूरी प्रक्रिया' },
    { path: '/workflows', icon: <MdAccountTree />, label: 'Workflow & Role Mapping', labelMr: 'कार्यप्रवाह आणि भूमिका मॅपिंग' },
    { path: '/sla', icon: <MdSchedule />, label: 'SLA & Escalation', labelMr: 'SLA आणि वाढीव प्रक्रिया' },
    { path: '/knowledge-base', icon: <MdBook />, label: 'Knowledge Base', labelMr: 'ज्ञान आधार' },
    { path: '/integrations', icon: <MdIntegrationInstructions />, label: 'Integrations', labelMr: 'इंटिग्रेशन' },
    { path: '/reports', icon: <MdBarChart />, label: 'Predefined Reports', labelMr: 'पूर्वनिर्धारित अहवाल' },
    { 
      icon: <MdFactCheck />, 
      label: 'Audit Logs', 
      labelMr: 'ऑडिट लॉग',
      subItems: [
        { path: '/audit/activity-logs', icon: <MdHistory />, label: 'Activity Logs', labelMr: 'अॅक्टिव्हिटी लॉग' },
        { path: '/audit/access-logs', icon: <MdLogin />, label: 'Access Logs', labelMr: 'अॅक्सेस लॉग' },
        { path: '/audit/blocked-email-recipients', icon: <MdBlock />, label: 'Blocked Email Recipients', labelMr: 'ब्लॉक केलेले ईमेल प्राप्तकर्ते' },
        { path: '/audit/email-failure-logs', icon: <MdMailOutline />, label: 'Email Failure Logs', labelMr: 'ईमेल फेल्युअर लॉग' },
        { path: '/audit/integration-failure-logs', icon: <MdSyncProblem />, label: 'Integration Failure Logs', labelMr: 'इंटिग्रेशन फेल्युअर लॉग' },
        { path: '/audit/webhook-failure-logs', icon: <MdWebhook />, label: 'Webhook Failure Logs', labelMr: 'वेबहुक फेल्युअर लॉग' },
        { path: '/audit/chat-webhook-failure', icon: <MdChat />, label: 'Chat Webhook Failure', labelMr: 'चॅट वेबहुक फेल्युअर' },
      ]
    },
  ];

  // Filter menu items based on module access for project users
  const getFilteredMenuItems = (): MenuItem[] => {
    if (!isProjectUser) {
      // Super admin or regular admin - show all items
      return allMenuItems;
    }

    // Project user - filter based on module access
    const filteredItems: MenuItem[] = [];

    // Always show project dashboard
    filteredItems.push({ path: '/project-dashboard', icon: <MdDashboard />, label: 'Dashboard', labelMr: 'डॅशबोर्ड' });

    // Check each module access
    if (moduleAccess.tickets) {
      filteredItems.push({ 
        icon: <MdDescription />, 
        label: 'Fields & Forms', 
        labelMr: 'फील्ड आणि फॉर्म',
        subItems: allMenuItems.find(item => item.label === 'Fields & Forms')?.subItems || []
      });
      filteredItems.push({ 
        icon: <MdAutoMode />, 
        label: 'Ticket Automation', 
        labelMr: 'तिकीट ऑटोमेशन',
        subItems: allMenuItems.find(item => item.label === 'Ticket Automation')?.subItems || []
      });
    }

    if (moduleAccess.userManagement) {
      filteredItems.push(allMenuItems.find(item => item.path === '/users')!);
    }

    if (moduleAccess.reports) {
      filteredItems.push(allMenuItems.find(item => item.path === '/reports')!);
    }

    if (moduleAccess.analytics) {
      // Analytics could be added here
    }

    if (moduleAccess.workflows) {
      filteredItems.push(allMenuItems.find(item => item.path === '/workflows')!);
    }

    if (moduleAccess.approvals) {
      filteredItems.push(allMenuItems.find(item => item.path === '/approvals')!);
    }

    if (moduleAccess.knowledgeBase) {
      // Knowledge base could be added here
    }

    return filteredItems;
  };

  const menuItems = getFilteredMenuItems();

  const userName = localStorage.getItem('userName') || 'Super Admin';
  const sidebarWidth = isSidebarCollapsed ? '64px' : '240px';

  return (
    <>
      {/* Skip Navigation Link for Keyboard Users */}
      <SkipLink />

      <div 
        style={{ 
          display: 'flex', 
          minHeight: '100vh',
          overflow: 'visible',
          fontFamily: i18n.language === 'mr' 
            ? '"Noto Sans Devanagari", sans-serif' 
            : designSystem.typography.fontFamily.primary
        }}
      >
      {/* Sidebar Navigation */}
      <aside 
        role="navigation"
        aria-label={getText('Main navigation', 'मुख्य नेविगेशन', 'मुख्य नेव्हिगेशन')}
        style={{
        width: sidebarWidth,
        background: 'var(--background-primary)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'visible',
        transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 100,
        // Custom scrollbar styles
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0, 0, 0, 0.1) transparent'
      }}
      className="custom-scrollbar"
      >
        {/* Logo at Top */}
        <div style={{ 
          padding: isSidebarCollapsed ? '16px 12px' : '20px 16px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
          gap: '12px',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          {projectBranding?.logo ? (
            <img 
              src={projectBranding.logo} 
              alt={projectBranding.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'cover',
                flexShrink: 0
              }}
            />
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: projectBranding?.colorTheme?.primary || 'var(--primary-main)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
              color: 'white'
            }}>
              <MdFolder />
            </div>
          )}
          {!isSidebarCollapsed && (
            <div style={{
              flex: 1,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              opacity: isSidebarCollapsed ? 0 : 1,
              transition: 'opacity 0.3s ease 0.1s'
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {projectBranding?.name || userName}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-secondary)'
              }}>
                {projectBranding?.code || (i18n.language === 'mr' ? 'हेल्पडेस्क' : i18n.language === 'hi' ? 'हेल्पडेस्क' : 'Helpdesk')}
              </div>
            </div>
          )}
        </div>

        {/* Language Toggle */}
        {!isSidebarCollapsed && (
          <div style={{ 
            padding: '12px',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <LanguageToggle />
          </div>
        )}

        {/* Toggle Button */}
        <div style={{ 
          padding: '12px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="btn btn-icon"
            style={{
              width: '100%',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '20px',
              cursor: 'pointer'
            }}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <MdMenu /> : <MdChevronLeft />}
          </button>
        </div>

        {/* Menu Items */}
        <nav 
          style={{ 
            flex: 1, 
            padding: isSidebarCollapsed ? '8px 4px' : '8px 12px',
            overflow: 'visible',
            position: 'relative'
          }}
          aria-label={getText('Primary menu', 'प्राथमिक मेनू', 'प्राथमिक मेनू')}
        >
          {menuItems.map((item, index) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenu === item.label && !isSidebarCollapsed;
            const isActive = item.path ? location.pathname === item.path : false;
            const isSubItemActive = hasSubItems && item.subItems?.some(sub => sub.path === location.pathname);
            const showTooltip = isSidebarCollapsed && hoveredItem === item.label;
            
            return (
              <div 
                key={item.label || index} 
                style={{ 
                  marginBottom: '4px',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  setHoveredItem(item.label);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltipPosition({
                    top: rect.top + rect.height / 2,
                    left: rect.right + 12
                  });
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setTooltipPosition(null);
                }}
              >
                {/* Tooltip for collapsed state - rendered with fixed positioning */}
                {showTooltip && tooltipPosition && (
                  <div style={{
                    position: 'fixed',
                    left: `${tooltipPosition.left}px`,
                    top: `${tooltipPosition.top}px`,
                    transform: 'translateY(-50%)',
                    backgroundColor: '#333',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    zIndex: 99999,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    pointerEvents: 'none'
                  }}>
                    {getLabel(item)}
                    {/* Tooltip arrow */}
                    <div style={{
                      position: 'absolute',
                      right: '100%',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                      borderRight: '6px solid #333'
                    }} />
                  </div>
                )}

                {/* Main Menu Item */}
                {hasSubItems ? (
                  <button
                    onClick={() => {
                      if (isSidebarCollapsed) {
                        setIsSidebarCollapsed(false);
                        setExpandedMenu(item.label);
                      } else {
                        setExpandedMenu(isExpanded ? null : item.label);
                      }
                    }}
                    aria-expanded={isExpanded}
                    aria-controls={`submenu-${index}`}
                    aria-label={`${getLabel(item)}. ${hasSubItems ? (isExpanded ? 'Expanded' : 'Collapsed') : ''}`}
                    disabled={false}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isSidebarCollapsed ? '0' : '12px',
                      padding: isSidebarCollapsed ? '10px' : '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: (isSubItemActive || isActive) ? 'var(--primary-main)' : 'transparent',
                      color: (isSubItemActive || isActive) ? 'var(--primary-on)' : 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '400',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      userSelect: 'none',
                      width: '100%',
                      border: 'none',
                      textAlign: 'left',
                      justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                      boxShadow: (isSubItemActive || isActive) ? '0 1px 3px rgba(0, 0, 0, 0.12)' : 'none'
                    }}
                    onMouseOver={(e) => {
                      if (!isSubItemActive && !isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-variant)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSubItemActive && !isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                    onMouseDown={(e) => {
                      if (!isSubItemActive && !isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(63, 65, 209, 0.12)';
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!isSubItemActive && !isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-variant)';
                      }
                    }}
                  >
                    <span style={{ 
                      fontSize: '24px', 
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0 
                    }} aria-hidden="true">
                      {item.icon}
                    </span>
                    {!isSidebarCollapsed && (
                      <>
                        <span style={{ 
                          flex: 1, 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          lineHeight: '1.5'
                        }}>
                          {getLabel(item)}
                        </span>
                        <span 
                          style={{ 
                            fontSize: '20px',
                            flexShrink: 0,
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          aria-hidden="true"
                        >
                          <MdExpandMore />
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path!}
                    aria-label={getLabel(item)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isSidebarCollapsed ? '0' : '12px',
                      padding: isSidebarCollapsed ? '10px' : '12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: isActive ? 'var(--primary-main)' : 'transparent',
                      color: isActive ? 'var(--primary-on)' : 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '400',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                      boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.12)' : 'none',
                      lineHeight: '1.5'
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-variant)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.08)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                    onMouseDown={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(63, 65, 209, 0.12)';
                      }
                    }}
                    onMouseUp={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--surface-variant)';
                      }
                    }}
                  >
                    <span style={{ 
                      fontSize: '24px',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0 
                    }} aria-hidden="true">
                      {item.icon}
                    </span>
                    {!isSidebarCollapsed && (
                      <span style={{ 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        lineHeight: '1.5'
                      }}>
                        {getLabel(item)}
                      </span>
                    )}
                  </Link>
                )}

                {/* Sub Menu Items */}
                {hasSubItems && !isSidebarCollapsed && (
                  <div 
                    id={`submenu-${index}`}
                    role="group"
                    aria-label={`${getLabel(item)} submenu`}
                    style={{ 
                      maxHeight: isExpanded ? `${item.subItems!.length * 40}px` : '0px',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      opacity: isExpanded ? 1 : 0,
                      marginTop: isExpanded ? '4px' : '0px',
                      marginBottom: isExpanded ? '4px' : '0px',
                      marginLeft: '12px',
                      transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)'
                    }}
                  >
                    {item.subItems!.map((subItem) => {
                      const isSubActive = location.pathname === subItem.path;
                      return (
                        <Link
                          key={subItem.path}
                          to={subItem.path!}
                          aria-label={getLabel(subItem)}
                          aria-current={isSubActive ? 'page' : undefined}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 16px',
                            marginBottom: '2px',
                            marginLeft: '12px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: isSubActive ? 'rgba(63, 65, 209, 0.08)' : 'transparent',
                            color: isSubActive ? 'var(--primary-main)' : 'var(--text-primary)',
                            textDecoration: 'none',
                            fontSize: '16px',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            borderLeft: isSubActive ? '2px solid var(--primary-main)' : '2px solid transparent',
                            boxShadow: isSubActive ? '0 1px 2px rgba(0, 0, 0, 0.08)' : 'none'
                          }}
                          onMouseOver={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = 'var(--surface-variant)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.06)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = 'var(--text-primary)';
                              e.currentTarget.style.boxShadow = 'none';
                            }
                          }}
                          onMouseDown={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = 'rgba(63, 65, 209, 0.12)';
                            }
                          }}
                          onMouseUp={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = 'var(--surface-variant)';
                            }
                          }}
                        >
                          <span style={{ 
                            fontSize: '20px',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0 
                          }} aria-hidden="true">
                            {subItem.icon}
                          </span>
                          <span style={{ 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            lineHeight: '1.5'
                          }}>
                            {getLabel(subItem)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout Button at Bottom */}
        <div style={{ 
          padding: isSidebarCollapsed ? '12px 4px' : '16px 12px',
          borderTop: '1px solid var(--border-light)',
          marginTop: 'auto'
        }}>
          <button
            onClick={async () => {
              try {
                // Call logout API to log the activity
                const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
                console.log('Logging out with token:', token ? 'Token exists' : 'No token found');
                
                if (token) {
                  const response = await fetch('http://localhost:3003/api/auth/logout', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  console.log('Logout API response:', response.status);
                } else {
                  console.log('No token found for logout API call');
                }
              } catch (error) {
                console.error('Logout API error:', error);
              } finally {
                // Clear local storage and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('authToken');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userId');
                localStorage.removeItem('userRole');
                window.location.href = '/login';
              }
            }}
            className="btn btn-outline"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              gap: isSidebarCollapsed ? '0' : '12px',
              padding: isSidebarCollapsed ? '12px' : '10px 12px',
              fontSize: '12px',
              fontWeight: '400',
              textTransform: 'none',
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-default)'
            }}
            aria-label={getText('Logout', 'लॉगआउट', 'लॉगआउट')}
            title={isSidebarCollapsed ? getText('Logout', 'लॉगआउट', 'लॉगआउट') : ''}
          >
            <span style={{ 
              fontSize: '24px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MdLogout />
            </span>
            {!isSidebarCollapsed && (
              <span>{getText('Logout', 'लॉगआउट', 'लॉगआउट')}</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        id="main-content"
        role="main"
        aria-label={getText('Main content', 'मुख्य सामग्री', 'मुख्य सामग्री')}
        tabIndex={-1}
        style={{ 
          marginLeft: sidebarWidth, 
          flex: 1, 
          backgroundColor: 'var(--background-secondary)',
          transition: 'margin-left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
    </div>
    </>
  );
};

export default DashboardLayout;


