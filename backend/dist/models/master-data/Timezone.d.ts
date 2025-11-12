import mongoose, { Document } from 'mongoose';
export interface ITimezone extends Document {
    key: string;
    value: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    offset?: string;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Timezone: mongoose.Model<ITimezone, {}, {}, {}, mongoose.Document<unknown, {}, ITimezone> & ITimezone & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Timezone;
//# sourceMappingURL=Timezone.d.ts.map