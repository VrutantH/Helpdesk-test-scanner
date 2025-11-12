import mongoose, { Document } from 'mongoose';
export interface ICity extends Document {
    key: string;
    value: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    state: string;
    country: string;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const City: mongoose.Model<ICity, {}, {}, {}, mongoose.Document<unknown, {}, ICity> & ICity & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default City;
//# sourceMappingURL=City.d.ts.map