import mongoose, { Document } from 'mongoose';
export interface ITicketForm extends Document {
    name: string;
    description?: string;
    formType: 'agent' | 'customer';
    fields: Array<{
        fieldId: string;
        required: boolean;
        visible: boolean;
        displayOrder: number;
        conditionalLogic?: {
            showIf: {
                fieldId: string;
                operator: string;
                value: string;
            }[];
        };
    }>;
    sections?: Array<{
        title: string;
        description?: string;
        fields: string[];
        displayOrder: number;
    }>;
    isDefault: boolean;
    isActive: boolean;
    createdBy?: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TicketForm: mongoose.Model<ITicketForm, {}, {}, {}, mongoose.Document<unknown, {}, ITicketForm> & ITicketForm & {
    _id: mongoose.Types.ObjectId;
}, any>;
//# sourceMappingURL=TicketForm.d.ts.map