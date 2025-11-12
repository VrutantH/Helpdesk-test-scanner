import mongoose, { Document } from 'mongoose';
export interface IRole extends Document {
    name: string;
    code: string;
    description?: string;
    type: 'system' | 'custom';
    projectId?: mongoose.Types.ObjectId;
    permissions: mongoose.Types.ObjectId[];
    agentCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Role: mongoose.Model<IRole, {}, {}, {}, mongoose.Document<unknown, {}, IRole> & IRole & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Role.d.ts.map