import mongoose, { Document } from 'mongoose';
export interface ICenter extends Document {
    key: string;
    value: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    timing: string;
    googleMapLink?: string;
    phone?: string;
    email?: string;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Center: mongoose.Model<ICenter, {}, {}, {}, mongoose.Document<unknown, {}, ICenter> & ICenter & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Center;
//# sourceMappingURL=Center.d.ts.map