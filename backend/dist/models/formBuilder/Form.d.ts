import mongoose, { Document } from 'mongoose';
export interface IFormField {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: any[];
    defaultValue?: any;
    validation?: Record<string, any>;
    conditionalLogic?: Record<string, any>;
    constraints?: Record<string, any>;
    calculated?: boolean;
    mapping?: Record<string, any>;
}
export interface IFormVersion {
    version: number;
    fields: IFormField[];
    createdAt: Date;
    createdBy: mongoose.Types.ObjectId;
    migrationPolicy?: string;
}
export interface IForm extends Document {
    name: string;
    description?: string;
    context: string[];
    versions: IFormVersion[];
    activeVersion: number;
    auditTrail: any[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IForm, {}, {}, {}, mongoose.Document<unknown, {}, IForm> & IForm & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Form.d.ts.map