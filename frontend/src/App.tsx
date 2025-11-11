import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Login from './components/Login'
import ProjectLogin from './components/ProjectLogin'
import ProjectDashboard from './components/ProjectDashboard'
import ForgotPassword from './components/ForgotPassword'
import EULA from './components/EULA'
import ProjectManagement from './components/ProjectManagement'
import MasterDataManagement from './components/MasterDataManagement'
import RoleManagement from './components/RoleManagement'
import UserManagement from './components/UserManagement'
import DashboardLayout from './components/DashboardLayout'
import { FieldFormManagement } from './components/FieldFormManagement'
import { TicketAutomation } from './components/TicketAutomation'
import SLARulesPage from './pages/SLARulesPage'
import EscalationMatrixPage from './pages/EscalationMatrixPage'
import ActivityLogs from './components/ActivityLogs'
import AccessLogs from './components/AccessLogs'
import BlockedEmailRecipients from './components/BlockedEmailRecipients'
import EmailFailureLogs from './components/EmailFailureLogs'
import IntegrationsManagement from './components/IntegrationsManagement'

const Dashboard = () => {
  const { i18n } = useTranslation()
  
  return (
    <DashboardLayout>
      <div style={{ 
        padding: '48px', 
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          {i18n.language === 'en' ? 'Welcome to SAC Helpdesk Portal' : 'SAC हेल्पडेस्क पोर्टलमध्ये आपले स्वागत आहे'}
        </h1>
        <p style={{ fontSize: '18px', color: '#6b7280' }}>
          {i18n.language === 'en' ? 'Navigate using the sidebar to manage your projects and settings.' : 'तुमचे प्रकल्प आणि सेटिंग्ज व्यवस्थापित करण्यासाठी साइडबार वापरून नेव्हिगेट करा.'}
        </p>
      </div>
    </DashboardLayout>
  )
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/:projectCode" element={<ProjectLogin />} />
        <Route path="/:customUrlPath" element={<ProjectLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/eula" element={<EULA />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project-dashboard" element={<ProjectDashboard />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/master-data" element={<MasterDataManagement />} />
        <Route path="/rbac" element={<RoleManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/fields-forms/*" element={<FieldFormManagement />} />
        <Route path="/ticket-automation/*" element={<TicketAutomation />} />
        <Route path="/sla" element={<SLARulesPage />} />
        <Route path="/escalation" element={<EscalationMatrixPage />} />
        <Route path="/integrations" element={<IntegrationsManagement />} />
        <Route path="/audit/activity-logs" element={<ActivityLogs />} />
        <Route path="/audit/access-logs" element={<AccessLogs />} />
        <Route path="/audit/blocked-email-recipients" element={<BlockedEmailRecipients />} />
        <Route path="/audit/email-failure-logs" element={<EmailFailureLogs />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App