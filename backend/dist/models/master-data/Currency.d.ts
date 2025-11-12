import mongoose, { Document } from 'mongoose';
export interface ICurrency extends Document {
    key: string;
    value: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    symbol?: string;
    code?: string;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Currency: mongoose.Model<ICurrency, {}, {}, {}, mongoose.Document<unknown, {}, ICurrency> & ICurrency & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Currency;
//# sourceMappingURL=Currency.d.ts.map