import mongoose, { Document } from 'mongoose';
export interface ICountry extends Document {
    key: string;
    value: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    dialCode?: string;
    code?: string;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Country: mongoose.Model<ICountry, {}, {}, {}, mongoose.Document<unknown, {}, ICountry> & ICountry & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Country;
//# sourceMappingURL=Country.d.ts.map