import mongoose, { Document } from 'mongoose';
export interface ISLATracking extends Document {
    ticketId: string;
    slaRuleId: mongoose.Types.ObjectId;
    priorityTier: 'Urgent' | 'High' | 'Normal' | 'Low';
    responseTime: {
        dueAt: Date;
        respondedAt?: Date;
        status: 'pending' | 'met' | 'breached';
        breachedBy?: number;
    };
    resolutionTime: {
        dueAt: Date;
        resolvedAt?: Date;
        status: 'pending' | 'met' | 'breached';
        breachedBy?: number;
    };
    escalations: Array<{
        level: number;
        escalatedAt: Date;
        escalatedTo: string;
        reason: string;
    }>;
    pausedDuration: number;
    pauseHistory: Array<{
        pausedAt: Date;
        resumedAt?: Date;
        reason: string;
        pausedBy: string;
    }>;
    workingHoursOnly: boolean;
    excludeHolidays: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const SLATracking: mongoose.Model<ISLATracking, {}, {}, {}, mongoose.Document<unknown, {}, ISLATracking> & ISLATracking & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=SLATracking.d.ts.map