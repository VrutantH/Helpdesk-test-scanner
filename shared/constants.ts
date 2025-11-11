export const TICKET_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const;

export const TICKET_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  USER: 'user',
} as const;

export const TICKET_CATEGORIES = [
  'Technical Support',
  'Bug Report',
  'Feature Request',
  'Account Issue',
  'Billing',
  'General Inquiry',
  'Hardware',
  'Software',
  'Network',
  'Security',
] as const;

export const PRIORITY_COLORS = {
  [TICKET_PRIORITIES.LOW]: 'bg-green-100 text-green-800',
  [TICKET_PRIORITIES.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [TICKET_PRIORITIES.HIGH]: 'bg-orange-100 text-orange-800',
  [TICKET_PRIORITIES.URGENT]: 'bg-red-100 text-red-800',
};

export const STATUS_COLORS = {
  [TICKET_STATUSES.OPEN]: 'bg-blue-100 text-blue-800',
  [TICKET_STATUSES.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [TICKET_STATUSES.RESOLVED]: 'bg-green-100 text-green-800',
  [TICKET_STATUSES.CLOSED]: 'bg-gray-100 text-gray-800',
};

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  REFRESH_TOKEN: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
  
  // Users
  USERS: '/api/users',
  USER_PROFILE: '/api/users/profile',
  
  // Tickets
  TICKETS: '/api/tickets',
  TICKET_COMMENTS: (ticketId: string) => `/api/tickets/${ticketId}/comments`,
  TICKET_ATTACHMENTS: (ticketId: string) => `/api/tickets/${ticketId}/attachments`,
  
  // Dashboard
  DASHBOARD_STATS: '/api/dashboard/stats',
  
  // File Upload
  UPLOAD: '/api/upload',
} as const;