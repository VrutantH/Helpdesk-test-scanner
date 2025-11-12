import mongoose, { Document } from 'mongoose';
export interface ILanguage extends Document {
    key: string;
    value: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    code?: string;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const Language: mongoose.Model<ILanguage, {}, {}, {}, mongoose.Document<unknown, {}, ILanguage> & ILanguage & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Language;
//# sourceMappingURL=Language.d.ts.map