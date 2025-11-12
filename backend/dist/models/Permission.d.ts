import mongoose, { Document } from 'mongoose';
export interface IPermission extends Document {
    module: string;
    name: string;
    code: string;
    description?: string;
    category: 'dashboard' | 'project-management' | 'master-data' | 'rbac-setup' | 'user-management' | 'fields-forms' | 'ticket-automation' | 'approval-process' | 'workflow-role-mapping' | 'sla-escalation' | 'integrations' | 'reports' | 'audit-logs' | 'tickets';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Permission: mongoose.Model<IPermission, {}, {}, {}, mongoose.Document<unknown, {}, IPermission> & IPermission & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Permission.d.ts.map