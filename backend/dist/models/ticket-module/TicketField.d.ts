import mongoose, { Document } from 'mongoose';
export interface ITicketField extends Document {
    id: string;
    icon: string;
    labelAgentPortal: string;
    labelCustomerPortal: string;
    apiName: string;
    type: 'System' | 'Custom';
    fieldType: 'text' | 'dropdown' | 'textarea' | 'date' | 'checkbox' | 'number' | 'email' | 'phone';
    required: boolean;
    visibleInAgentPortal: boolean;
    visibleInCustomerPortal: boolean;
    options?: string[];
    defaultValue?: string;
    placeholder?: string;
    helpText?: string;
    validation?: {
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        errorMessage?: string;
    };
    displayOrder: number;
    isActive: boolean;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TicketField: mongoose.Model<ITicketField, {}, {}, {}, mongoose.Document<unknown, {}, ITicketField> & ITicketField & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=TicketField.d.ts.map