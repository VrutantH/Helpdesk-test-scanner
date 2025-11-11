// User Types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'agent' | 'user';

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Ticket Types
export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  assignedTo?: User;
  createdBy: User;
  attachments: Attachment[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  category: string;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: string;
  assignedTo?: string;
}

// Comment Types
export interface Comment {
  _id: string;
  content: string;
  author: User;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  isInternal?: boolean;
}

// Attachment Types
export interface Attachment {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedBy: User;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Filter and Search Types
export interface TicketFilters {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  category?: string[];
  assignedTo?: string[];
  createdBy?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SearchParams {
  query?: string;
  filters?: TicketFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Dashboard Types
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  ticketsByCategory: Record<string, number>;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  _id: string;
  type: 'ticket_created' | 'ticket_updated' | 'comment_added' | 'assignment_changed';
  description: string;
  user: User;
  ticket?: Ticket;
  createdAt: string;
}

// Socket.io Event Types
export interface SocketEvents {
  ticket_created: Ticket;
  ticket_updated: Ticket;
  comment_added: { ticketId: string; comment: Comment };
  user_typing: { ticketId: string; user: User };
  notification: {
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
  };
}