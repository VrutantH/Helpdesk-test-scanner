import mongoose, { Document } from 'mongoose';
export interface ITicket extends Document {
    _id: mongoose.Types.ObjectId;
    ticketNumber: string;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'pending';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    subcategory?: string;
    assignedTo?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    attachments: Array<{
        filename: string;
        originalName: string;
        mimetype: string;
        size: number;
        uploadedAt: Date;
    }>;
    comments: Array<{
        author: mongoose.Types.ObjectId;
        content: string;
        isInternal: boolean;
        createdAt: Date;
    }>;
    resolution?: string;
    resolvedAt?: Date;
    closedAt?: Date;
    estimatedResolutionTime?: Date;
    actualResolutionTime?: Date;
    satisfactionRating?: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Ticket: mongoose.Model<ITicket, {}, {}, {}, mongoose.Document<unknown, {}, ITicket> & ITicket & Required<{
    _id: mongoose.Types.ObjectId;
}>, any>;
//# sourceMappingURL=Ticket.d.ts.map