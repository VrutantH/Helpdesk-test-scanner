import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Login from './components/Login'
import ProjectLogin from './pages/ProjectLogin'
import AgentDashboard from './components/AgentDashboard'
import ProjectPortalLogin from './pages/ProjectPortalLogin'
import ProjectPortalDashboard from './pages/ProjectPortalDashboard'
import StudentPortal from './pages/StudentPortal'
import StudentKBPage from './pages/StudentKBPage'
import StudentDashboard from './pages/StudentDashboard'
import StudentTicketDetail from './pages/StudentTicketDetail'
import ForgotPassword from './components/ForgotPassword'
import EULA from './components/EULA'
import ProjectManagement from './components/ProjectManagement'
import MasterDataManagement from './components/MasterDataManagement'
import RoleManagement from './components/RoleManagement'
import UserManagement from './components/UserManagement'
import DashboardLayout from './components/DashboardLayout'
// import { FieldFormManagement } from './components/FieldFormManagement' // TODO: Implement
// import { TicketAutomation } from './components/TicketAutomation' // TODO: Implement
import SLARulesPage from './pages/SLARulesPage'
import EscalationMatrixPage from './pages/EscalationMatrixPage'
import ActivityLogs from './components/ActivityLogs'
import AccessLogs from './components/AccessLogs'
import KnowledgeBaseManagement from './components/KnowledgeBaseManagement'
import KBArticleView from './pages/KBArticleView'
// import BlockedEmailRecipients from './components/BlockedEmailRecipients' // TODO: Implement
// import EmailFailureLogs from './components/EmailFailureLogs' // TODO: Implement
// import IntegrationsManagement from './components/IntegrationsManagement' // TODO: Implement

const Dashboard = () => {
  const { i18n } = useTranslation()
  
  const getText = (en: string, hi: string, mr: string): string => {
    if (i18n.language === 'hi') return hi;
    if (i18n.language === 'mr') return mr;
    return en;
  };
  
  return (
    <DashboardLayout>
      <div style={{ 
        padding: '48px', 
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          {getText('Welcome to SAC Helpdesk Portal', 'SAC हेल्पडेस्क पोर्टल में आपका स्वागत है', 'SAC हेल्पडेस्क पोर्टलमध्ये आपले स्वागत आहे')}
        </h1>
        <p style={{ fontSize: '18px', color: '#6b7280' }}>
          {getText('Navigate using the sidebar to manage your projects and settings.', 'अपने प्रोजेक्ट और सेटिंग्स को प्रबंधित करने के लिए साइडबार का उपयोग करें।', 'तुमचे प्रकल्प आणि सेटिंग्ज व्यवस्थापित करण्यासाठी साइडबार वापरून नेव्हिगेट करा.')}
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
        {/* Project-specific login */}
        <Route path="/:customUrlPath" element={<ProjectLogin />} />
        <Route path="/:customUrlPath/dashboard" element={<AgentDashboard />} />
        <Route path="/:customUrlPath/submit-ticket" element={<StudentPortal />} />
        <Route path="/:customUrlPath/kb" element={<StudentKBPage />} />
        {/* Project Portal Routes */}
        <Route path="/:customUrlPath/portal/login" element={<ProjectPortalLogin />} />
        <Route path="/:customUrlPath/portal/*" element={<ProjectPortalDashboard />} />
        {/* Student Dashboard Routes */}
        <Route path="/:customUrlPath/student/dashboard" element={<StudentDashboard />} />
        <Route path="/:customUrlPath/student/ticket/:ticketId" element={<StudentTicketDetail />} />
        <Route path="/:customUrlPath/forgot-password" element={<ForgotPassword />} />
        <Route path="/:customUrlPath/eula" element={<EULA />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/eula" element={<EULA />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* TODO: Implement ProjectDashboard component */}
        {/* <Route path="/project-dashboard" element={<ProjectDashboard />} /> */}
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/master-data" element={<MasterDataManagement />} />
        <Route path="/rbac" element={<RoleManagement />} />
        <Route path="/users" element={<UserManagement />} />
        {/* TODO: Implement these components */}
        {/* <Route path="/fields-forms/*" element={<FieldFormManagement />} /> */}
        {/* <Route path="/ticket-automation/*" element={<TicketAutomation />} /> */}
        <Route path="/sla" element={<SLARulesPage />} />
        <Route path="/escalation-matrix" element={<EscalationMatrixPage />} />
        <Route path="/knowledge-base" element={<KnowledgeBaseManagement />} />
        <Route path="/kb/:articleId" element={<KBArticleView />} />
        {/* <Route path="/integrations" element={<IntegrationsManagement />} /> */}
        <Route path="/audit/activity-logs" element={<ActivityLogs />} />
        <Route path="/audit/access-logs" element={<AccessLogs />} />
        {/* <Route path="/audit/blocked-email-recipients" element={<BlockedEmailRecipients />} /> */}
        {/* <Route path="/audit/email-failure-logs" element={<EmailFailureLogs />} /> */}
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App