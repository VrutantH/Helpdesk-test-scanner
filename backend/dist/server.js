"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const notFound_1 = require("./middleware/notFound");
const auth_1 = __importDefault(require("./routes/auth"));
const projectAuth_1 = __importDefault(require("./routes/projectAuth"));
const users_1 = __importDefault(require("./routes/users"));
const tickets_1 = __importDefault(require("./routes/tickets"));
const eula_1 = __importDefault(require("./routes/eula"));
const projects_1 = __importDefault(require("./routes/projects"));
const roleRoutes_1 = __importDefault(require("./routes/roleRoutes"));
const masterData_1 = __importDefault(require("./routes/masterData"));
const master_data_1 = __importDefault(require("./routes/master-data"));
const slaRuleRoutes_1 = __importDefault(require("./routes/sla-module/slaRuleRoutes"));
const escalationPolicyRoutes_1 = __importDefault(require("./routes/sla-module/escalationPolicyRoutes"));
const activityLogs_1 = __importDefault(require("./routes/activityLogs"));
const accessLogs_1 = __importDefault(require("./routes/accessLogs"));
const socketHandlers_1 = require("./socket/socketHandlers");
const dbInit_1 = require("./utils/dbInit");
const seedRolesPermissions_1 = require("./utils/seedRolesPermissions");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3001',
        methods: ['GET', 'POST'],
    },
});
exports.io = io;
const PORT = process.env.PORT || 3003;
(0, database_1.connectDB)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW || '15') || 15) * 60 * 1000,
    max: process.env.NODE_ENV === 'development'
        ? 1000
        : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100') || 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use('/api/auth', auth_1.default);
app.use('/api/project-auth', projectAuth_1.default);
app.use('/api/auth', eula_1.default);
app.use('/api/users', users_1.default);
app.use('/api/tickets', tickets_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api', roleRoutes_1.default);
app.use('/api/master-data', masterData_1.default);
app.use('/api/masters', master_data_1.default);
app.use('/api/sla-rules', slaRuleRoutes_1.default);
app.use('/api/escalation-policies', escalationPolicyRoutes_1.default);
app.use('/api/activity-logs', activityLogs_1.default);
app.use('/api/access-logs', accessLogs_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'SAC Helpdesk API is running',
        timestamp: new Date().toISOString(),
    });
});
(0, socketHandlers_1.setupSocketHandlers)(io);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
httpServer.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    try {
        console.log('🔐 Initializing roles and permissions...');
        await (0, seedRolesPermissions_1.seedRolesAndPermissions)();
        await (0, dbInit_1.initializeDatabase)();
    }
    catch (error) {
        console.error('⚠️  Database initialization failed, but server is still running');
    }
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    console.error('❌ Server will continue running, but this should be fixed');
});
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.error('❌ Server will continue running, but this should be fixed');
});
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
//# sourceMappingURL=server.js.map