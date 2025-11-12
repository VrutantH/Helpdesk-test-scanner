import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from './DashboardLayout';
import AddProjectForm from './AddProjectForm';
import { getText } from '../utils/language';


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
    if (confirm(getText('Are you sure you want to delete this project?', 'तुम्हाला हा प्रकल्प हटवायचा आहे का?', 'तुम्हाला हा प्रकल्प हटवायचा आहे का?'))) {
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
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            {getText('Project Management', 'प्रकल्प व्यवस्थापन', 'प्रकल्प व्यवस्थापन')}
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            {getText('Create and manage all projects in the system', 'सिस्टममधील सर्व प्रकल्प तयार आणि व्यवस्थापित करा', 'सिस्टममधील सर्व प्रकल्प तयार आणि व्यवस्थापित करा')}
          </p>
        </div>

        {/* Content Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Card Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                  {getText('All Projects', 'सर्व प्रकल्प', 'सर्व प्रकल्प')}
                </h2>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  {getText('View and manage all projects in the system', 'सिस्टममधील सर्व प्रकल्प पहा आणि व्यवस्थापित करा', 'सिस्टममधील सर्व प्रकल्प पहा आणि व्यवस्थापित करा')}
                </p>
              </div>
              <button
                onClick={handleAddNew}
                style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
              >
                <span style={{ fontSize: '18px' }}>+</span>
                {getText('Add New Project', 'नवीन प्रकल्प जोडा', 'नवीन प्रकल्प जोडा')}
              </button>
            </div>

            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '18px',
                color: '#9ca3af'
              }}>
                🔍
              </span>
              <input
                type="text"
                placeholder={getText('Search projects by name, industry, or ID...', 'नाव, उद्योग किंवा आयडी द्वारे प्रकल्प शोधा...', 'नाव, उद्योग किंवा आयडी द्वारे प्रकल्प शोधा...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && fetchProjects()}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                {getText('Loading projects...', 'प्रकल्प लोड करत आहे...', 'प्रकल्प लोड करत आहे...')}
              </div>
            ) : projects.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280' }}>
                {getText('No projects found', 'कोणताही प्रकल्प सापडला नाही', 'कोणताही प्रकल्प सापडला नाही')}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      {getText('Project ID', 'प्रकल्प आयडी', 'प्रकल्प आयडी')}
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      {getText('Name', 'नाव', 'नाव')}
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      {getText('Industry', 'उद्योग', 'उद्योग')}
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      {getText('Users', 'वापरकर्ते', 'वापरकर्ते')}
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      {getText('Status', 'स्थिती', 'स्थिती')}
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      {getText('Created Date', 'तयार केलेली तारीख', 'तयार केलेली तारीख')}
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                      {getText('Actions', 'कृती', 'कृती')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                        {project.projectId}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                        {project.name}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {project.organizationType}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {project.users}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                            <input
                              type="checkbox"
                              checked={project.isActive}
                              onChange={() => toggleProjectStatus(project._id)}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                              position: 'absolute',
                              cursor: 'pointer',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: project.isActive ? '#22c55e' : '#9ca3af',
                              borderRadius: '24px',
                              transition: '0.3s'
                            }}>
                              <span style={{
                                position: 'absolute',
                                content: '""',
                                height: '18px',
                                width: '18px',
                                left: project.isActive ? '23px' : '3px',
                                bottom: '3px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                transition: '0.3s'
                              }}></span>
                            </span>
                          </label>
                          <span style={{
                            backgroundColor: project.isActive ? '#dcfce7' : '#f3f4f6',
                            color: project.isActive ? '#166534' : '#6b7280',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {project.isActive ? (getText('active', 'सक्रिय', 'सक्रिय')) : (getText('inactive', 'निष्क्रिय', 'निष्क्रिय'))}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(project)}
                            style={{
                              width: '36px',
                              height: '36px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor: '#f3f4f6',
                              cursor: 'pointer',
                              fontSize: '16px',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteProject(project._id)}
                            style={{
                              width: '36px',
                              height: '36px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor: '#fee2e2',
                              cursor: 'pointer',
                              fontSize: '16px',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                          >
                            🗑️
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
      </div>

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
