import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import authRoutes from './routes/auth';
import projectAuthRoutes from './routes/projectAuth';
import userRoutes from './routes/users';
import ticketRoutes from './routes/tickets';
import eulaRoutes from './routes/eula';
import projectRoutes from './routes/projects';
import roleRoutes from './routes/roleRoutes';
import masterDataRoutes from './routes/masterData'; // Old generic routes (kept for backward compatibility)
import newMasterDataRoutes from './routes/master-data'; // New separate collection routes
import { ticketFieldRoutes, autoAssignmentRoutes } from './routes/ticket-module'; // Ticket module routes
import { slaRuleRoutes, escalationPolicyRoutes } from './routes/sla-module'; // SLA module routes
import activityLogRoutes from './routes/activityLogs'; // Activity logs routes
import integrationRoutes from './routes/integrations'; // Integration routes
import { setupSocketHandlers } from './socket/socketHandlers';
import { initializeDatabase } from './utils/dbInit';
import { seedRolesAndPermissions } from './utils/seedRolesPermissions';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3003;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting - More lenient in development
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW || '15') || 15) * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' 
    ? 1000  // 1000 requests per 15 min in development
    : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100') || 100, // 100 in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Compression and logging
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/project-auth', projectAuthRoutes);
app.use('/api/auth', eulaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', roleRoutes);
app.use('/api/master-data', masterDataRoutes); // Old generic routes (backward compatibility)
app.use('/api/masters', newMasterDataRoutes); // New separate collection routes

// Ticket Module Routes
app.use('/api/ticket-fields', ticketFieldRoutes);
app.use('/api/auto-assignments', autoAssignmentRoutes);

// SLA Module Routes
app.use('/api/sla-rules', slaRuleRoutes);
app.use('/api/escalation-policies', escalationPolicyRoutes);

// Activity Logs Routes
app.use('/api/activity-logs', activityLogRoutes);

// Integration Routes
app.use('/api/integrations', integrationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SAC Helpdesk API is running',
    timestamp: new Date().toISOString(),
  });
});

// Socket.io setup
setupSocketHandlers(io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

httpServer.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  
  // Initialize database with default data
  try {
    // Seed roles and permissions FIRST (before creating admin user)
    console.log('🔐 Initializing roles and permissions...');
    await seedRolesAndPermissions();
    
    // Then initialize database (creates admin user with role reference)
    await initializeDatabase();
  } catch (error) {
    console.error('⚠️  Database initialization failed, but server is still running');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.error('❌ Server will continue running, but this should be fixed');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('❌ Server will continue running, but this should be fixed');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export { io };
