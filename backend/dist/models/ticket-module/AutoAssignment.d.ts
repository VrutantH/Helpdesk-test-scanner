import mongoose, { Document } from 'mongoose';
export interface IAutoAssignment extends Document {
    ruleName: string;
    description?: string;
    allConditions: Array<{
        field: string;
        operator: string;
        value: string;
    }>;
    anyConditions: Array<{
        field: string;
        operator: string;
        value: string;
    }>;
    assignmentMode: 'round-robin-even' | 'round-robin-load';
    groupId: string;
    watchers?: string[];
    isActive: boolean;
    priority: number;
    lastModifiedBy: string;
    lastModified: Date;
    executionCount: number;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AutoAssignment: mongoose.Model<IAutoAssignment, {}, {}, {}, mongoose.Document<unknown, {}, IAutoAssignment> & IAutoAssignment & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=AutoAssignment.d.ts.map