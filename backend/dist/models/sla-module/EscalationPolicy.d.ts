import mongoose, { Document } from 'mongoose';
export interface IEscalationLevel {
    level: number;
    escalateAfter: {
        value: number;
        unit: 'minutes' | 'hours' | 'days';
    };
    escalateTo: {
        type: 'user' | 'group' | 'role';
        targetId: string;
        targetName: string;
    };
    notifyMethod: ('email' | 'sms' | 'push')[];
    emailTemplate?: string;
    actions?: {
        changePriority?: 'Urgent' | 'High' | 'Normal' | 'Low';
        addWatchers?: string[];
        changeStatus?: string;
    };
}
export interface IEscalationPolicy extends Document {
    policyId: string;
    name: string;
    description?: string;
    levels: IEscalationLevel[];
    isActive: boolean;
    projectId?: mongoose.Types.ObjectId;
    projectIds?: mongoose.Types.ObjectId[];
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const EscalationPolicy: mongoose.Model<IEscalationPolicy, {}, {}, {}, mongoose.Document<unknown, {}, IEscalationPolicy> & IEscalationPolicy & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default EscalationPolicy;
//# sourceMappingURL=EscalationPolicy.d.ts.map