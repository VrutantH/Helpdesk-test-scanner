import mongoose, { Document } from 'mongoose';
export interface IEulaAcceptance extends Document {
    userId: mongoose.Types.ObjectId;
    userName: string;
    userEmail: string;
    userRole: string;
    ipAddress: string;
    userAgent?: string;
    eulaVersion: string;
    acceptedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const EulaAcceptance: mongoose.Model<IEulaAcceptance, {}, {}, {}, mongoose.Document<unknown, {}, IEulaAcceptance> & IEulaAcceptance & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default EulaAcceptance;
//# sourceMappingURL=EulaAcceptance.d.ts.map