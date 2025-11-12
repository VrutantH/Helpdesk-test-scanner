import mongoose, { Document } from 'mongoose';
export interface IAccessLog extends Document {
    userId?: mongoose.Types.ObjectId;
    userName?: string;
    userEmail: string;
    action: 'login' | 'logout' | 'login_failed' | 'password_reset' | 'forgot_password' | 'session_expired';
    success: boolean;
    failureReason?: string;
    ipAddress?: string;
    userAgent?: string;
    project?: mongoose.Types.ObjectId;
    projectName?: string;
    role?: string;
    timestamp: Date;
    sessionDuration?: number;
    metadata?: Record<string, any>;
}
declare const _default: mongoose.Model<IAccessLog, {}, {}, {}, mongoose.Document<unknown, {}, IAccessLog> & IAccessLog & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=AccessLog.d.ts.map