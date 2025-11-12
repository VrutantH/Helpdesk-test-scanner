import mongoose, { Document } from 'mongoose';
export interface IOrganizationType extends Document {
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
declare const OrganizationType: mongoose.Model<IOrganizationType, {}, {}, {}, mongoose.Document<unknown, {}, IOrganizationType> & IOrganizationType & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default OrganizationType;
//# sourceMappingURL=OrganizationType.d.ts.map