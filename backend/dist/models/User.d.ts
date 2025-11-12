import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobile?: string;
    role: mongoose.Types.ObjectId;
    isActive: boolean;
    lastLogin?: Date;
    eulaAccepted?: boolean;
    eulaAcceptedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    hrmsId?: number;
    employeeCode?: string;
    department?: string;
    designation?: string;
    joiningDate?: Date;
    reportingManager?: mongoose.Types.ObjectId;
    projects?: mongoose.Types.ObjectId[];
    resetPasswordOTP?: string;
    resetPasswordOTPExpires?: Date;
    resetPasswordAttempts?: number;
    resetPasswordLockedUntil?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateResetPasswordOTP(): string;
    isResetPasswordLocked(): boolean;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=User.d.ts.map