// Define all permissions for the helpdesk portal - Organized by Sidebar Navigation
interface HelpDeskPermission {
  module: string;
  name: string;
  code: string;
  description: string;
  category: string;
  [key: string]: any;
}

export const helpDeskPermissions: HelpDeskPermission[] = [
  // =====================================================
  // DASHBOARD CATEGORY
  // =====================================================
  {
    module: 'Dashboard',
    name: 'View Dashboard',
    code: 'DASHBOARD_VIEW',
    description: 'Can access and view dashboard',
    category: 'dashboard',
  },
  {
    module: 'Dashboard',
    name: 'View Analytics',
    code: 'DASHBOARD_VIEW_ANALYTICS',
    description: 'Can view dashboard analytics and metrics',
    category: 'dashboard',
  },
  {
    module: 'Dashboard',
    name: 'Export Dashboard Data',
    code: 'DASHBOARD_EXPORT',
    description: 'Can export dashboard data and reports',
    category: 'dashboard',
  },
  // =====================================================
  // PROJECT MANAGEMENT CATEGORY
  // =====================================================
  {
    module: 'Project Management',
    name: 'View All Projects',
    code: 'PROJECT_VIEW_ALL',
    description: 'Can view all projects/portals',
    category: 'project-management',
  },
  {
    module: 'Project Management',
    name: 'Create Project',
    code: 'PROJECT_CREATE',
    description: 'Can create new projects/portals',
    category: 'project-management',
  },
  {
    module: 'Project Management',
    name: 'Edit Project',
    code: 'PROJECT_EDIT',
    description: 'Can edit project settings and details',
    category: 'project-management',
  },
  {
    module: 'Project Management',
    name: 'Delete Project',
    code: 'PROJECT_DELETE',
    description: 'Can delete projects',
    category: 'project-management',
  },
  {
    module: 'Project Management',
    name: 'Activate/Deactivate Project',
    code: 'PROJECT_TOGGLE_STATUS',
    description: 'Can activate or deactivate projects',
    category: 'project-management',
  },
  {
    module: 'Project Management',
    name: 'Manage Project Settings',
    code: 'PROJECT_MANAGE_SETTINGS',
    description: 'Can manage project configuration and settings',
    category: 'project-management',
  },
  {
    module: 'Project Management',
    name: 'Manage Project Branding',
    code: 'PROJECT_MANAGE_BRANDING',
    description: 'Can customize project branding (logo, colors, theme)',
    category: 'project-management',
  },
  {
    module: 'Project Management',
    name: 'Manage Project URL',
    code: 'PROJECT_MANAGE_URL',
    description: 'Can configure custom URL for project portal',
    category: 'project-management',
  },
  {
    module: 'Project Management',
    name: 'Assign Users to Project',
    code: 'PROJECT_ASSIGN_USERS',
    description: 'Can assign users and roles to projects',
    category: 'project-management',
  },
  // =====================================================
  // MASTER DATA CATEGORY
  // =====================================================
  {
    module: 'Master Data',
    name: 'View Master Data',
    code: 'MASTER_DATA_VIEW',
    description: 'Can view master data configurations',
    category: 'master-data',
  },
  {
    module: 'Master Data',
    name: 'Manage Ticket Categories',
    code: 'MASTER_DATA_MANAGE_CATEGORIES',
    description: 'Can create and manage ticket categories',
    category: 'master-data',
  },
  {
    module: 'Master Data',
    name: 'Manage Ticket Priorities',
    code: 'MASTER_DATA_MANAGE_PRIORITIES',
    description: 'Can create and manage priority levels',
    category: 'master-data',
  },
  {
    module: 'Master Data',
    name: 'Manage Ticket Statuses',
    code: 'MASTER_DATA_MANAGE_STATUSES',
    description: 'Can create and manage ticket statuses',
    category: 'master-data',
  },
  {
    module: 'Master Data',
    name: 'Manage Departments',
    code: 'MASTER_DATA_MANAGE_DEPARTMENTS',
    description: 'Can create and manage departments',
    category: 'master-data',
  },
  {
    module: 'Master Data',
    name: 'Manage Locations',
    code: 'MASTER_DATA_MANAGE_LOCATIONS',
    description: 'Can create and manage office locations',
    category: 'master-data',
  },
  // =====================================================
  // RBAC SETUP CATEGORY
  // =====================================================
  {
    module: 'RBAC Setup',
    name: 'View Roles',
    code: 'RBAC_VIEW_ROLES',
    description: 'Can view roles and their permissions',
    category: 'rbac-setup',
  },
  {
    module: 'RBAC Setup',
    name: 'Create Roles',
    code: 'RBAC_CREATE_ROLE',
    description: 'Can create new roles',
    category: 'rbac-setup',
  },
  {
    module: 'RBAC Setup',
    name: 'Edit Roles',
    code: 'RBAC_EDIT_ROLE',
    description: 'Can edit role details and permissions',
    category: 'rbac-setup',
  },
  {
    module: 'RBAC Setup',
    name: 'Delete Roles',
    code: 'RBAC_DELETE_ROLE',
    description: 'Can delete custom roles',
    category: 'rbac-setup',
  },
  {
    module: 'RBAC Setup',
    name: 'Assign Permissions',
    code: 'RBAC_ASSIGN_PERMISSIONS',
    description: 'Can assign permissions to roles',
    category: 'rbac-setup',
  },
  {
    module: 'RBAC Setup',
    name: 'View Permissions',
    code: 'RBAC_VIEW_PERMISSIONS',
    description: 'Can view all available permissions',
    category: 'rbac-setup',
  },
  // =====================================================
  // USER MANAGEMENT CATEGORY
  // =====================================================
  {
    module: 'User Management',
    name: 'View All Users',
    code: 'USER_VIEW_ALL',
    description: 'Can view all users (agents and customers)',
    category: 'user-management',
  },
  {
    module: 'User Management',
    name: 'Create User',
    code: 'USER_CREATE',
    description: 'Can create new user accounts',
    category: 'user-management',
  },
  {
    module: 'User Management',
    name: 'Edit User',
    code: 'USER_EDIT',
    description: 'Can edit user details',
    category: 'user-management',
  },
  {
    module: 'User Management',
    name: 'Delete User',
    code: 'USER_DELETE',
    description: 'Can delete user accounts',
    category: 'user-management',
  },
  {
    module: 'User Management',
    name: 'Activate/Deactivate User',
    code: 'USER_TOGGLE_STATUS',
    description: 'Can activate or deactivate user accounts',
    category: 'user-management',
  },
  {
    module: 'User Management',
    name: 'Assign Role',
    code: 'USER_ASSIGN_ROLE',
    description: 'Can assign roles to users',
    category: 'user-management',
  },
  {
    module: 'User Management',
    name: 'Reset User Password',
    code: 'USER_RESET_PASSWORD',
    description: 'Can reset user passwords',
    category: 'user-management',
  },
  {
    module: 'User Management',
    name: 'Manage User Groups',
    code: 'USER_MANAGE_GROUPS',
    description: 'Can create and manage user groups',
    category: 'user-management',
  },
  {
    module: 'User Management',
    name: 'Import Users',
    code: 'USER_IMPORT',
    description: 'Can import users in bulk',
    category: 'user-management',
  },
  // =====================================================
  // FIELDS & FORMS CATEGORY
  // =====================================================
  {
    module: 'Fields & Forms',
    name: 'View Ticket Fields',
    code: 'FIELDS_VIEW_TICKET_FIELDS',
    description: 'Can view ticket field configurations',
    category: 'fields-forms',
  },
  {
    module: 'Fields & Forms',
    name: 'Manage Ticket Fields',
    code: 'FIELDS_MANAGE_TICKET_FIELDS',
    description: 'Can create and manage custom ticket fields',
    category: 'fields-forms',
  },
  {
    module: 'Fields & Forms',
    name: 'Manage Ticket Forms',
    code: 'FIELDS_MANAGE_TICKET_FORMS',
    description: 'Can customize ticket submission forms',
    category: 'fields-forms',
  },
  {
    module: 'Fields & Forms',
    name: 'Manage Activity Fields',
    code: 'FIELDS_MANAGE_ACTIVITY_FIELDS',
    description: 'Can create and manage activity fields',
    category: 'fields-forms',
  },
  {
    module: 'Fields & Forms',
    name: 'Manage User Fields',
    code: 'FIELDS_MANAGE_USER_FIELDS',
    description: 'Can create and manage custom user fields',
    category: 'fields-forms',
  },
  {
    module: 'Fields & Forms',
    name: 'Manage Contact Fields',
    code: 'FIELDS_MANAGE_CONTACT_FIELDS',
    description: 'Can create and manage contact group fields',
    category: 'fields-forms',
  },
  {
    module: 'Fields & Forms',
    name: 'Manage Field Dependencies',
    code: 'FIELDS_MANAGE_DEPENDENCIES',
    description: 'Can configure field dependencies and conditional logic',
    category: 'fields-forms',
  },
  // =====================================================
  // TICKET AUTOMATION CATEGORY
  // =====================================================
  {
    module: 'Ticket Automation',
    name: 'View Automations',
    code: 'AUTOMATION_VIEW',
    description: 'Can view automation rules',
    category: 'ticket-automation',
  },
  {
    module: 'Ticket Automation',
    name: 'Manage Auto Assignments',
    code: 'AUTOMATION_MANAGE_AUTO_ASSIGN',
    description: 'Can configure automatic ticket assignment rules',
    category: 'ticket-automation',
  },
  {
    module: 'Ticket Automation',
    name: 'Manage Create Ticket Triggers',
    code: 'AUTOMATION_MANAGE_CREATE_TRIGGERS',
    description: 'Can create triggers that run when tickets are created',
    category: 'ticket-automation',
  },
  {
    module: 'Ticket Automation',
    name: 'Manage Update Ticket Triggers',
    code: 'AUTOMATION_MANAGE_UPDATE_TRIGGERS',
    description: 'Can create triggers that run when tickets are updated',
    category: 'ticket-automation',
  },
  {
    module: 'Ticket Automation',
    name: 'Manage Time Triggers',
    code: 'AUTOMATION_MANAGE_TIME_TRIGGERS',
    description: 'Can create time-based automation triggers',
    category: 'ticket-automation',
  },
  {
    module: 'Ticket Automation',
    name: 'Enable/Disable Automations',
    code: 'AUTOMATION_TOGGLE',
    description: 'Can enable or disable automation rules',
    category: 'ticket-automation',
  },
  // =====================================================
  // APPROVAL PROCESS CATEGORY
  // =====================================================
  {
    module: 'Approval Process',
    name: 'View Approval Workflows',
    code: 'APPROVAL_VIEW',
    description: 'Can view approval process configurations',
    category: 'approval-process',
  },
  {
    module: 'Approval Process',
    name: 'Create Approval Workflows',
    code: 'APPROVAL_CREATE',
    description: 'Can create approval workflows',
    category: 'approval-process',
  },
  {
    module: 'Approval Process',
    name: 'Edit Approval Workflows',
    code: 'APPROVAL_EDIT',
    description: 'Can edit approval workflows',
    category: 'approval-process',
  },
  {
    module: 'Approval Process',
    name: 'Delete Approval Workflows',
    code: 'APPROVAL_DELETE',
    description: 'Can delete approval workflows',
    category: 'approval-process',
  },
  {
    module: 'Approval Process',
    name: 'Approve/Reject Tickets',
    code: 'APPROVAL_APPROVE_REJECT',
    description: 'Can approve or reject tickets requiring approval',
    category: 'approval-process',
  },
  // =====================================================
  // WORKFLOW & ROLE MAPPING CATEGORY
  // =====================================================
  {
    module: 'Workflow & Role Mapping',
    name: 'View Workflows',
    code: 'WORKFLOW_VIEW',
    description: 'Can view ticket workflows',
    category: 'workflow-role-mapping',
  },
  {
    module: 'Workflow & Role Mapping',
    name: 'Create Workflows',
    code: 'WORKFLOW_CREATE',
    description: 'Can create ticket workflows',
    category: 'workflow-role-mapping',
  },
  {
    module: 'Workflow & Role Mapping',
    name: 'Edit Workflows',
    code: 'WORKFLOW_EDIT',
    description: 'Can edit workflow configurations',
    category: 'workflow-role-mapping',
  },
  {
    module: 'Workflow & Role Mapping',
    name: 'Delete Workflows',
    code: 'WORKFLOW_DELETE',
    description: 'Can delete workflows',
    category: 'workflow-role-mapping',
  },
  {
    module: 'Workflow & Role Mapping',
    name: 'Map Roles to Workflow Steps',
    code: 'WORKFLOW_MAP_ROLES',
    description: 'Can assign roles to workflow steps',
    category: 'workflow-role-mapping',
  },
  // =====================================================
  // SLA & ESCALATION CATEGORY
  // =====================================================
  {
    module: 'SLA & Escalation',
    name: 'View SLA Policies',
    code: 'SLA_VIEW',
    description: 'Can view SLA policies',
    category: 'sla-escalation',
  },
  {
    module: 'SLA & Escalation',
    name: 'Create SLA Policies',
    code: 'SLA_CREATE',
    description: 'Can create SLA policies',
    category: 'sla-escalation',
  },
  {
    module: 'SLA & Escalation',
    name: 'Edit SLA Policies',
    code: 'SLA_EDIT',
    description: 'Can edit SLA policies',
    category: 'sla-escalation',
  },
  {
    module: 'SLA & Escalation',
    name: 'Delete SLA Policies',
    code: 'SLA_DELETE',
    description: 'Can delete SLA policies',
    category: 'sla-escalation',
  },
  {
    module: 'SLA & Escalation',
    name: 'Manage Escalation Rules',
    code: 'SLA_MANAGE_ESCALATIONS',
    description: 'Can configure escalation rules and notifications',
    category: 'sla-escalation',
  },
  {
    module: 'SLA & Escalation',
    name: 'Manage Business Hours',
    code: 'SLA_MANAGE_BUSINESS_HOURS',
    description: 'Can configure business hours and holidays',
    category: 'sla-escalation',
  },
  // =====================================================
  // TICKET CONFIGURATION CATEGORY
  // =====================================================
  {
    module: 'Ticket Configuration',
    name: 'View Ticket Configuration',
    code: 'TICKET_CONFIG_VIEW',
    description: 'Can view ticket configuration settings',
    category: 'ticket-configuration',
  },
  {
    module: 'Ticket Configuration',
    name: 'Manage Categories',
    code: 'TICKET_CONFIG_MANAGE_CATEGORIES',
    description: 'Can create, edit, and delete ticket categories',
    category: 'ticket-configuration',
  },
  {
    module: 'Ticket Configuration',
    name: 'Manage Statuses',
    code: 'TICKET_CONFIG_MANAGE_STATUSES',
    description: 'Can create, edit, and delete ticket statuses',
    category: 'ticket-configuration',
  },
  {
    module: 'Ticket Configuration',
    name: 'Manage Priorities',
    code: 'TICKET_CONFIG_MANAGE_PRIORITIES',
    description: 'Can create, edit, and delete ticket priorities',
    category: 'ticket-configuration',
  },
  {
    module: 'Ticket Configuration',
    name: 'Manage Types',
    code: 'TICKET_CONFIG_MANAGE_TYPES',
    description: 'Can create, edit, and delete ticket types',
    category: 'ticket-configuration',
  },
  {
    module: 'Ticket Configuration',
    name: 'Manage Templates',
    code: 'TICKET_CONFIG_MANAGE_TEMPLATES',
    description: 'Can create and manage ticket templates',
    category: 'ticket-configuration',
  },
  // =====================================================
  // KNOWLEDGE BASE CATEGORY
  // =====================================================
  {
    module: 'Knowledge Base',
    name: 'View Knowledge Base',
    code: 'KB_VIEW',
    description: 'Can view knowledge base articles',
    category: 'knowledge-base',
  },
  {
    module: 'Knowledge Base',
    name: 'Create Articles',
    code: 'KB_CREATE',
    description: 'Can create new knowledge base articles',
    category: 'knowledge-base',
  },
  {
    module: 'Knowledge Base',
    name: 'Edit Articles',
    code: 'KB_EDIT',
    description: 'Can edit existing knowledge base articles',
    category: 'knowledge-base',
  },
  {
    module: 'Knowledge Base',
    name: 'Delete Articles',
    code: 'KB_DELETE',
    description: 'Can delete knowledge base articles',
    category: 'knowledge-base',
  },
  {
    module: 'Knowledge Base',
    name: 'Publish Articles',
    code: 'KB_PUBLISH',
    description: 'Can publish knowledge base articles',
    category: 'knowledge-base',
  },
  {
    module: 'Knowledge Base',
    name: 'Unpublish Articles',
    code: 'KB_UNPUBLISH',
    description: 'Can unpublish knowledge base articles',
    category: 'knowledge-base',
  },
  {
    module: 'Knowledge Base',
    name: 'Manage Categories',
    code: 'KB_MANAGE_CATEGORIES',
    description: 'Can create and manage KB categories',
    category: 'knowledge-base',
  },
  {
    module: 'Knowledge Base',
    name: 'Approve Articles',
    code: 'KB_APPROVE',
    description: 'Can approve KB articles for publishing',
    category: 'knowledge-base',
  },
  {
    module: 'Knowledge Base',
    name: 'Export Articles',
    code: 'KB_EXPORT',
    description: 'Can export knowledge base articles',
    category: 'knowledge-base',
  },
  // =====================================================
  // INTEGRATIONS CATEGORY
  // =====================================================
  {
    module: 'Integrations',
    name: 'View Integrations',
    code: 'INTEGRATION_VIEW',
    description: 'Can view integration configurations',
    category: 'integrations',
  },
  {
    module: 'Integrations',
    name: 'Manage Email Integration',
    code: 'INTEGRATION_MANAGE_EMAIL',
    description: 'Can configure email integration settings',
    category: 'integrations',
  },
  {
    module: 'Integrations',
    name: 'Manage SMS Integration',
    code: 'INTEGRATION_MANAGE_SMS',
    description: 'Can configure SMS integration settings',
    category: 'integrations',
  },
  {
    module: 'Integrations',
    name: 'Manage Webhooks',
    code: 'INTEGRATION_MANAGE_WEBHOOKS',
    description: 'Can configure webhooks',
    category: 'integrations',
  },
  {
    module: 'Integrations',
    name: 'Manage API Access',
    code: 'INTEGRATION_MANAGE_API',
    description: 'Can configure API access and tokens',
    category: 'integrations',
  },
  {
    module: 'Integrations',
    name: 'Manage Third-Party Apps',
    code: 'INTEGRATION_MANAGE_APPS',
    description: 'Can connect and manage third-party applications',
    category: 'integrations',
  },
  // =====================================================
  // PREDEFINED REPORTS CATEGORY
  // =====================================================
  {
    module: 'Predefined Reports',
    name: 'View Ticket Reports',
    code: 'REPORT_VIEW_TICKETS',
    description: 'Can view ticket analytics and reports',
    category: 'reports',
  },
  {
    module: 'Predefined Reports',
    name: 'View Agent Performance Reports',
    code: 'REPORT_VIEW_AGENT_PERFORMANCE',
    description: 'Can view agent performance metrics',
    category: 'reports',
  },
  {
    module: 'Predefined Reports',
    name: 'View Customer Satisfaction Reports',
    code: 'REPORT_VIEW_CSAT',
    description: 'Can view customer satisfaction scores',
    category: 'reports',
  },
  {
    module: 'Predefined Reports',
    name: 'View SLA Reports',
    code: 'REPORT_VIEW_SLA',
    description: 'Can view SLA compliance reports',
    category: 'reports',
  },
  {
    module: 'Predefined Reports',
    name: 'Export Reports',
    code: 'REPORT_EXPORT',
    description: 'Can export reports to various formats',
    category: 'reports',
  },
  {
    module: 'Predefined Reports',
    name: 'Create Custom Reports',
    code: 'REPORT_CREATE_CUSTOM',
    description: 'Can create custom report templates',
    category: 'reports',
  },
  {
    module: 'Predefined Reports',
    name: 'Schedule Reports',
    code: 'REPORT_SCHEDULE',
    description: 'Can schedule automated report generation',
    category: 'reports',
  },
  // =====================================================
  // AUDIT LOGS CATEGORY
  // =====================================================
  {
    module: 'Audit Logs',
    name: 'View Activity Logs',
    code: 'AUDIT_VIEW_ACTIVITY',
    description: 'Can view user activity logs',
    category: 'audit-logs',
  },
  {
    module: 'Audit Logs',
    name: 'View Access Logs',
    code: 'AUDIT_VIEW_ACCESS',
    description: 'Can view system access logs',
    category: 'audit-logs',
  },
  {
    module: 'Audit Logs',
    name: 'View Blocked Email Recipients',
    code: 'AUDIT_VIEW_BLOCKED_EMAILS',
    description: 'Can view blocked email recipient list',
    category: 'audit-logs',
  },
  {
    module: 'Audit Logs',
    name: 'Manage Blocked Email Recipients',
    code: 'AUDIT_MANAGE_BLOCKED_EMAILS',
    description: 'Can block/unblock email recipients',
    category: 'audit-logs',
  },
  {
    module: 'Audit Logs',
    name: 'View Email Failure Logs',
    code: 'AUDIT_VIEW_EMAIL_FAILURES',
    description: 'Can view email delivery failure logs',
    category: 'audit-logs',
  },
  {
    module: 'Audit Logs',
    name: 'View Integration Failure Logs',
    code: 'AUDIT_VIEW_INTEGRATION_FAILURES',
    description: 'Can view integration failure logs',
    category: 'audit-logs',
  },
  {
    module: 'Audit Logs',
    name: 'View Webhook Failure Logs',
    code: 'AUDIT_VIEW_WEBHOOK_FAILURES',
    description: 'Can view webhook failure logs',
    category: 'audit-logs',
  },
  {
    module: 'Audit Logs',
    name: 'View Chat Webhook Failures',
    code: 'AUDIT_VIEW_CHAT_WEBHOOK_FAILURES',
    description: 'Can view chat webhook failure logs',
    category: 'audit-logs',
  },
  {
    module: 'Audit Logs',
    name: 'Export Audit Logs',
    code: 'AUDIT_EXPORT',
    description: 'Can export audit logs for compliance',
    category: 'audit-logs',
  },
  // =====================================================
  // TICKETS CATEGORY (Core Ticket Operations)
  // =====================================================
  {
    module: 'Tickets',
    name: 'View All Tickets',
    code: 'TICKET_VIEW_ALL',
    description: 'Can view all tickets in the system without restrictions',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'View Own Tickets',
    code: 'TICKET_VIEW_OWN',
    description: 'Can view only tickets assigned to self',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Create Ticket',
    code: 'TICKET_CREATE',
    description: 'Can create new tickets',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Edit Ticket',
    code: 'TICKET_EDIT',
    description: 'Can edit ticket details',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Delete Ticket',
    code: 'TICKET_DELETE',
    description: 'Can delete tickets',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Assign Ticket',
    code: 'TICKET_ASSIGN',
    description: 'Can assign tickets to agents',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Change Ticket Status',
    code: 'TICKET_CHANGE_STATUS',
    description: 'Can change ticket status (open, in-progress, resolved, closed)',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Change Ticket Priority',
    code: 'TICKET_CHANGE_PRIORITY',
    description: 'Can change ticket priority level',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Add Ticket Comments',
    code: 'TICKET_ADD_COMMENT',
    description: 'Can add comments/replies to tickets',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Edit Ticket Comments',
    code: 'TICKET_EDIT_COMMENT',
    description: 'Can edit ticket comments',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Delete Ticket Comments',
    code: 'TICKET_DELETE_COMMENT',
    description: 'Can delete ticket comments',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Add Ticket Attachments',
    code: 'TICKET_ADD_ATTACHMENT',
    description: 'Can upload attachments to tickets',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Delete Ticket Attachments',
    code: 'TICKET_DELETE_ATTACHMENT',
    description: 'Can delete ticket attachments',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Merge Tickets',
    code: 'TICKET_MERGE',
    description: 'Can merge multiple tickets into one',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Bulk Update Tickets',
    code: 'TICKET_BULK_UPDATE',
    description: 'Can perform bulk operations on tickets',
    category: 'tickets',
  },
  {
    module: 'Tickets',
    name: 'Export Tickets',
    code: 'TICKET_EXPORT',
    description: 'Can export tickets to CSV/Excel',
    category: 'tickets',
  },
  // =====================================================
  // FORM BUILDER CATEGORY
  // =====================================================
  {
    module: 'Form Builder',
    name: 'View Forms',
    code: 'FORM_VIEW',
    description: 'Can view all forms and their versions',
    category: 'form-builder',
  },
  {
    module: 'Form Builder',
    name: 'Create Form',
    code: 'FORM_CREATE',
    description: 'Can create new forms',
    category: 'form-builder',
  },
  {
    module: 'Form Builder',
    name: 'Edit Form',
    code: 'FORM_EDIT',
    description: 'Can edit forms and add new versions',
    category: 'form-builder',
  },
  {
    module: 'Form Builder',
    name: 'Delete Form',
    code: 'FORM_DELETE',
    description: 'Can delete forms',
    category: 'form-builder',
  },
  {
    module: 'Form Builder',
    name: 'Assign Form Context',
    code: 'FORM_ASSIGN_CONTEXT',
    description: 'Can map forms to roles, products, categories, or pages',
    category: 'form-builder',
  },
  {
    module: 'Form Builder',
    name: 'View Form Audit Logs',
    code: 'FORM_VIEW_AUDIT_LOGS',
    description: 'Can view audit logs for form changes',
    category: 'form-builder',
  },
];

// Default roles for the helpdesk portal (must be after helpDeskPermissions)
const defaultRoles = [
  {
    module: 'Super Admin',
    name: 'Super Admin',
    code: 'SUPER_ADMIN',
    description: 'Has complete access to all features and settings across all projects',
    type: 'system',
    permissions: helpDeskPermissions.map(p => p.code),
  },
  {
    module: 'Account Owner',
    name: 'Account Owner',
    code: 'ACCOUNT_OWNER',
    description: 'Has access to all features except system-level settings',
    type: 'custom',
    permissions: [
      'TICKET_VIEW_ALL', 'TICKET_CREATE', 'TICKET_EDIT', 'TICKET_DELETE', 'TICKET_ASSIGN', 'TICKET_CHANGE_STATUS',
      'TICKET_CHANGE_PRIORITY', 'TICKET_ADD_COMMENT', 'TICKET_EDIT_COMMENT', 'TICKET_DELETE_COMMENT', 'TICKET_ADD_ATTACHMENT',
      'TICKET_DELETE_ATTACHMENT', 'TICKET_MERGE', 'TICKET_BULK_UPDATE', 'TICKET_EXPORT', 'USER_VIEW_ALL', 'USER_CREATE',
      'USER_EDIT', 'USER_DELETE', 'USER_TOGGLE_STATUS', 'USER_ASSIGN_ROLE', 'USER_RESET_PASSWORD', 'USER_MANAGE_GROUPS',
      'PROJECT_VIEW_ALL', 'PROJECT_EDIT', 'PROJECT_TOGGLE_STATUS', 'PROJECT_MANAGE_SETTINGS', 'REPORT_VIEW_TICKETS',
      'REPORT_VIEW_AGENT_PERFORMANCE', 'REPORT_VIEW_CSAT', 'REPORT_VIEW_SLA', 'REPORT_EXPORT', 'REPORT_CREATE_CUSTOM',
      'REPORT_SCHEDULE', 'FORM_VIEW', 'FORM_CREATE', 'FORM_EDIT', 'FORM_DELETE', 'FORM_ASSIGN_CONTEXT', 'FORM_VIEW_AUDIT_LOGS',
    ],
  },
  {
    module: 'Support Administrator',
    name: 'Support Administrator',
    code: 'SUPPORT_ADMIN',
    description: 'Manages support operations and settings',
    type: 'custom',
    permissions: [
      'TICKET_VIEW_ALL', 'TICKET_CREATE', 'TICKET_EDIT', 'TICKET_ASSIGN', 'TICKET_CHANGE_STATUS', 'TICKET_CHANGE_PRIORITY',
      'TICKET_ADD_COMMENT', 'TICKET_EDIT_COMMENT', 'TICKET_ADD_ATTACHMENT', 'TICKET_MERGE', 'TICKET_BULK_UPDATE', 'TICKET_EXPORT',
      'USER_VIEW_ALL', 'USER_CREATE', 'USER_EDIT', 'USER_TOGGLE_STATUS', 'USER_ASSIGN_ROLE', 'USER_MANAGE_GROUPS',
      'REPORT_VIEW_TICKETS', 'REPORT_VIEW_AGENT_PERFORMANCE', 'REPORT_VIEW_CSAT', 'REPORT_VIEW_SLA', 'REPORT_EXPORT',
      'FORM_VIEW', 'FORM_CREATE', 'FORM_EDIT', 'FORM_DELETE', 'FORM_ASSIGN_CONTEXT', 'FORM_VIEW_AUDIT_LOGS',
    ],
  },
  {
    module: 'Support Manager',
    name: 'Support Manager',
    code: 'SUPPORT_MANAGER',
    description: 'Manages team and ticket operations',
    type: 'custom',
    permissions: [
      'TICKET_VIEW_ALL', 'TICKET_CREATE', 'TICKET_EDIT', 'TICKET_ASSIGN', 'TICKET_CHANGE_STATUS', 'TICKET_CHANGE_PRIORITY',
      'TICKET_ADD_COMMENT', 'TICKET_ADD_ATTACHMENT', 'TICKET_MERGE', 'TICKET_BULK_UPDATE', 'TICKET_EXPORT', 'USER_VIEW_ALL',
      'REPORT_VIEW_TICKETS', 'REPORT_VIEW_AGENT_PERFORMANCE', 'REPORT_VIEW_CSAT', 'REPORT_VIEW_SLA', 'REPORT_EXPORT',
      'FORM_VIEW', 'FORM_CREATE', 'FORM_EDIT', 'FORM_DELETE', 'FORM_ASSIGN_CONTEXT', 'FORM_VIEW_AUDIT_LOGS',
    ],
  },
  {
    module: 'Agent',
    name: 'Agent',
    code: 'AGENT',
    description: 'Handles day-to-day ticket support',
    type: 'custom',
    permissions: [
      'TICKET_VIEW_OWN', 'TICKET_CREATE', 'TICKET_EDIT', 'TICKET_CHANGE_STATUS', 'TICKET_ADD_COMMENT', 'TICKET_ADD_ATTACHMENT',
    ],
  },
];

import { Permission } from '../models/Permission';
import { Role } from '../models/Role';
import mongoose from 'mongoose';

export async function seedRolesAndPermissions() {
	try {
		// Check if roles already exist (skip seeding if they do)
		const existingRolesCount = await Role.countDocuments();
		const existingPermissionsCount = await Permission.countDocuments();
		if (existingRolesCount > 0 && existingPermissionsCount > 0) {
			console.log('ℹ️  Roles and permissions already exist, skipping seed');
			console.log(`   - ${existingRolesCount} roles found`);
			console.log(`   - ${existingPermissionsCount} permissions found`);
			return;
		}
		console.log('🌱 Seeding permissions...');
		// Clear existing permissions
		await Permission.deleteMany({});
		// Insert all permissions
		const insertedPermissions = await Permission.insertMany(helpDeskPermissions);
		console.log(`✅ Inserted ${insertedPermissions.length} permissions`);
		// Create a map of permission codes to IDs
		const permissionMap = new Map();
		insertedPermissions.forEach(perm => {
			permissionMap.set(perm.code, perm._id);
		});
		console.log('🌱 Seeding default roles...');
		// Insert default roles with permission references
		const rolesToInsert = defaultRoles.map(role => ({
			...role,
			permissions: role.permissions.map(code => permissionMap.get(code)).filter(Boolean),
		}));
		const insertedRoles = await Role.insertMany(rolesToInsert);
		console.log(`✅ Inserted ${insertedRoles.length} default roles`);
		console.log('✨ Roles and permissions seeded successfully!');
		return {
			permissions: insertedPermissions,
			roles: insertedRoles,
		};
	} catch (error) {
		console.error('❌ Error seeding roles and permissions:', error);
		throw error;
	}
}
