import mongoose, { Document } from 'mongoose';
export interface IIntegration extends Document {
    projectId: mongoose.Types.ObjectId;
    type: 'email' | 'whatsapp' | 'sms' | 'payment' | 'ai_chatbot' | 'biometric' | 'rfid' | 'cctv';
    provider: string;
    status: 'active' | 'inactive';
    config: {
        [key: string]: string;
    };
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Integration: mongoose.Model<IIntegration, {}, {}, {}, mongoose.Document<unknown, {}, IIntegration> & IIntegration & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=Integration.d.ts.map