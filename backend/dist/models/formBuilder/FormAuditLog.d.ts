import mongoose, { Document } from 'mongoose';
export interface IFormAuditLog extends Document {
    formId: mongoose.Types.ObjectId;
    action: string;
    performedBy: mongoose.Types.ObjectId;
    timestamp: Date;
    details?: Record<string, any>;
}
declare const _default: mongoose.Model<IFormAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IFormAuditLog> & IFormAuditLog & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=FormAuditLog.d.ts.map