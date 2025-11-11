import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from './DashboardLayout';
import AddProjectForm from './AddProjectForm';
import { formatDateToDDMMYYYY } from '../utils/dateFormat';

interface Project {
  _id: string;
  projectId: string;
  name: string;
  code: string;
  description?: string;
  organizationType: 'government' | 'ngo' | 'private' | 'partner';
  status: 'active' | 'inactive' | 'suspended';
  isActive: boolean;
  users: number;
  createdAt: string;
  contactInfo?: {
    industry?: string;
  };
  branding?: {
    headerText?: string;
    domainUrl?: string;
    customUrlPath?: string;
    logo?: string;
    favicon?: string;
    footerText?: string;
    colorTheme?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
    };
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  primaryContact?: {
    name?: string;
    designation?: string;
    email?: string;
    phone?: string;
  };
}

const ProjectManagement = () => {
  const { i18n } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3003/api/projects?search=${searchQuery}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProjectStatus = async (projectId: string) => {
    try {
      const response = await fetch(`http://localhost:3003/api/projects/${projectId}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (confirm(i18n.language === 'en' ? 'Are you sure you want to delete this project?' : 'तुम्हाला हा प्रकल्प हटवायचा आहे का?')) {
      try {
        const response = await fetch(`http://localhost:3003/api/projects/${projectId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          fetchProjects();
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  return (
    <DashboardLayout>
      <div style={{ 
        padding: '32px 24px', 
        maxWidth: '1440px', 
        margin: '0 auto',
        background: '#F9FAFB',
        minHeight: '100vh',
        fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
      }}>
        {/* Header Section */}
        <div style={{
          marginBottom: '24px',
        }}>
          <h1 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '28px', 
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '-0.02em',
            fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
          }}>
            {i18n.language === 'en' ? 'Project Management' : 'प्रकल्प व्यवस्थापन'}
          </h1>
          <p style={{ 
            margin: 0, 
            color: '#6B7280', 
            fontSize: '14px',
            fontWeight: 400,
            fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
          }}>
            {i18n.language === 'en' ? 'Create and manage all projects in the system' : 'सिस्टममधील सर्व प्रकल्प तयार आणि व्यवस्थापित करा'}
          </p>
        </div>

        {/* Action Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: '1', minWidth: '300px', maxWidth: '500px' }}>
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#6B7280" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder={i18n.language === 'en' ? 'Search projects by name, industry, or ID...' : 'नाव, उद्योग किंवा आयडी द्वारे प्रकल्प शोधा...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && fetchProjects()}
              style={{
                width: '100%',
                padding: '10px 16px 10px 44px',
                fontSize: '14px',
                border: '1.5px solid #E5E7EB',
                borderRadius: '8px',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                background: 'white',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddNew}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.24)',
              transition: 'all 0.2s ease',
              fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1d4ed8';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.32)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2563EB';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.24)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {i18n.language === 'en' ? 'Add New Project' : 'नवीन प्रकल्प जोडा'}
          </button>
        </div>

        {/* Table Container */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
        }}>
          {loading ? (
            <div style={{ 
              padding: '80px 40px', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid #E5E7EB',
                borderTop: '3px solid #2563EB',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
              <p style={{ 
                color: '#6B7280', 
                fontSize: '14px',
                margin: 0,
                fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
              }}>
                {i18n.language === 'en' ? 'Loading projects...' : 'प्रकल्प लोड करत आहे...'}
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              padding: '80px 40px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '96px',
                height: '96px',
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '20px', 
                fontWeight: 700,
                color: '#111827',
                fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
              }}>
                {i18n.language === 'en' ? 'No Projects Found' : 'कोणताही प्रकल्प सापडला नाही'}
              </h3>
              <p style={{ 
                margin: '0', 
                color: '#6B7280', 
                fontSize: '14px',
                maxWidth: '420px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.6',
                fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
              }}>
                {i18n.language === 'en' ? 'Get started by creating your first project to organize your helpdesk system' : 'तुमची हेल्पडेस्क प्रणाली आयोजित करण्यासाठी तुमचा पहिला प्रकल्प तयार करून प्रारंभ करा'}
              </p>
            </div>
          ) : (
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
            }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                  }}>
                    {i18n.language === 'en' ? 'Project ID' : 'प्रकल्प आयडी'}
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                  }}>
                    {i18n.language === 'en' ? 'Portal Name' : 'पोर्टल नाव'}
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                  }}>
                    {i18n.language === 'en' ? 'Portal URL' : 'पोर्टल URL'}
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                  }}>
                    {i18n.language === 'en' ? 'Users' : 'वापरकर्ते'}
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                  }}>
                    {i18n.language === 'en' ? 'Status' : 'स्थिती'}
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                  }}>
                    {i18n.language === 'en' ? 'Created Date' : 'तयार केलेली तारीख'}
                  </th>
                  <th style={{ 
                    padding: '12px 24px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: '#6B7280', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                  }}>
                    {i18n.language === 'en' ? 'Actions' : 'कृती'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr 
                    key={project._id} 
                    style={{ 
                      borderBottom: index < projects.length - 1 ? '1px solid #E5E7EB' : 'none',
                      background: 'white',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <td style={{ 
                      padding: '16px 24px', 
                      fontSize: '14px', 
                      color: '#2563EB', 
                      fontWeight: 600,
                      fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                    }}>
                      {project.projectId}
                    </td>
                    <td style={{ 
                      padding: '16px 24px', 
                      fontSize: '14px', 
                      color: '#111827', 
                      fontWeight: 500,
                      fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                    }}>
                      {project.branding?.headerText || project.name}
                    </td>
                    <td style={{ 
                      padding: '16px 24px', 
                      fontSize: '14px', 
                      color: '#6B7280',
                      fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                    }}>
                      {project.branding?.domainUrl || '-'}
                    </td>
                    <td style={{ 
                      padding: '16px 24px', 
                      fontSize: '14px', 
                      color: '#6B7280',
                      fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        background: '#EFF6FF',
                        borderRadius: '6px',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563EB' }}>
                          {project.users}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ 
                          position: 'relative', 
                          display: 'inline-block', 
                          width: '44px', 
                          height: '24px',
                          cursor: 'pointer',
                        }}>
                          <input
                            type="checkbox"
                            checked={project.isActive}
                            onChange={() => toggleProjectStatus(project._id)}
                            style={{ 
                              opacity: 0, 
                              width: 0, 
                              height: 0,
                              position: 'absolute',
                            }}
                          />
                          <span style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: project.isActive ? '#10B981' : '#D1D5DB',
                            borderRadius: '24px',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}>
                            <span style={{
                              position: 'absolute',
                              height: '18px',
                              width: '18px',
                              left: project.isActive ? '23px' : '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              borderRadius: '50%',
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            }}></span>
                          </span>
                        </label>
                        <span style={{
                          backgroundColor: project.isActive ? '#DCFCE7' : '#F3F4F6',
                          color: project.isActive ? '#047857' : '#6B7280',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                        }}>
                          {project.isActive ? (i18n.language === 'en' ? 'Active' : 'सक्रिय') : (i18n.language === 'en' ? 'Inactive' : 'निष्क्रिय')}
                        </span>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '16px 24px', 
                      fontSize: '14px', 
                      color: '#6B7280',
                      fontFamily: '"Noto Sans", system-ui, -apple-system, sans-serif',
                    }}>
                      {formatDateToDDMMYYYY(project.createdAt)}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            const customPath = project.branding?.customUrlPath || project.name.toLowerCase().replace(/\s+/g, '');
                            const loginUrl = `${window.location.origin}/${customPath}`;
                            navigator.clipboard.writeText(loginUrl);
                            alert(`Login URL copied: ${loginUrl}`);
                          }}
                          style={{
                            padding: '8px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'white',
                            border: '1.5px solid #E5E7EB',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            outline: 'none',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F0FDF4';
                            e.currentTarget.style.borderColor = '#10B981';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#E5E7EB';
                          }}
                          aria-label="Copy login URL"
                          title={`Copy Agent Login URL: /${project.branding?.customUrlPath || project.name.toLowerCase().replace(/\s+/g, '')}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(project)}
                          style={{
                            padding: '8px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'white',
                            border: '1.5px solid #E5E7EB',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            outline: 'none',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#EFF6FF';
                            e.currentTarget.style.borderColor = '#2563EB';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#E5E7EB';
                          }}
                          aria-label="Edit project"
                          title="Edit Project"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteProject(project._id)}
                          style={{
                            padding: '8px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'white',
                            border: '1.5px solid #E5E7EB',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            outline: 'none',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FEF2F2';
                            e.currentTarget.style.borderColor = '#DC2626';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#E5E7EB';
                          }}
                          aria-label="Delete project"
                          title="Delete Project"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add loading animation keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Add/Edit Modal */}
      {showModal && (
        <AddProjectForm
          project={editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onSave={() => {
            setShowModal(false);
            setEditingProject(null);
            fetchProjects();
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default ProjectManagement;
