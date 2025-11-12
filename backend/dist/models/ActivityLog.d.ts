import mongoose, { Document } from 'mongoose';
export interface IActivityLog extends Document {
    userId: mongoose.Types.ObjectId;
    userName: string;
    userEmail: string;
    action: 'create' | 'update' | 'delete' | 'edit';
    entity: string;
    entityId?: string;
    entityName?: string;
    changes?: {
        field: string;
        oldValue: any;
        newValue: any;
    }[];
    description?: string;
    ipAddress?: string;
    userAgent?: string;
    project?: mongoose.Types.ObjectId;
    projectName?: string;
    role?: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}
declare const _default: mongoose.Model<IActivityLog, {}, {}, {}, mongoose.Document<unknown, {}, IActivityLog> & IActivityLog & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=ActivityLog.d.ts.map