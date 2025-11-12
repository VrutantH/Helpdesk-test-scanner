import mongoose, { Document } from 'mongoose';
export interface IMasterData extends Document {
    category: string;
    key: string;
    value: string;
    description?: string;
    displayOrder?: number;
    isActive: boolean;
    metadata?: {
        color?: string;
        icon?: string;
        [key: string]: any;
    };
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const MasterData: mongoose.Model<IMasterData, {}, {}, {}, mongoose.Document<unknown, {}, IMasterData> & IMasterData & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=MasterData.d.ts.map