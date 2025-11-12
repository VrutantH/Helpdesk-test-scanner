import mongoose, { Document } from 'mongoose';
export interface IDateFormat extends Document {
    key: string;
    value: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    format?: string;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const DateFormat: mongoose.Model<IDateFormat, {}, {}, {}, mongoose.Document<unknown, {}, IDateFormat> & IDateFormat & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default DateFormat;
//# sourceMappingURL=DateFormat.d.ts.map