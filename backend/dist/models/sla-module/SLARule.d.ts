import mongoose, { Document } from 'mongoose';
export interface ISLARule extends Document {
    name: string;
    description?: string;
    priority?: 'Critical' | 'Urgent' | 'High' | 'Normal' | 'Low';
    responseTime: {
        value: number;
        unit: 'minutes' | 'hours' | 'days';
    };
    resolutionTime: {
        value: number;
        unit: 'minutes' | 'hours' | 'days';
    };
    isActive: boolean;
    projectIds?: mongoose.Types.ObjectId[];
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const SLARule: mongoose.Model<ISLARule, {}, {}, {}, mongoose.Document<unknown, {}, ISLARule> & ISLARule & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default SLARule;
//# sourceMappingURL=SLARule.d.ts.map