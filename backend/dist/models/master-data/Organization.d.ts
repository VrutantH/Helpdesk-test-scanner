import mongoose, { Document } from 'mongoose';
export interface IOrganization extends Document {
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
declare const Organization: mongoose.Model<IOrganization, {}, {}, {}, mongoose.Document<unknown, {}, IOrganization> & IOrganization & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default Organization;
//# sourceMappingURL=Organization.d.ts.map