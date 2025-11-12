import mongoose, { Document } from 'mongoose';
export interface IIndustry extends Document {
    key: string;
    value: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Industry: mongoose.Model<IIndustry, {}, {}, {}, mongoose.Document<unknown, {}, IIndustry> & IIndustry & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Industry;
//# sourceMappingURL=Industry.d.ts.map