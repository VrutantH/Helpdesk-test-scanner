import mongoose, { Schema, Document } from 'mongoose';

export interface IAttachment {
  fieldName?: string; // Field name from the online form (if applicable)
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
}

export interface IThreadAttachment {
  filename: string;
  originalName: string;
  path: string;
  mimetype: string;
  size: number;
}

export interface IThread {
  message: string;
  createdBy: mongoose.Types.ObjectId;
  attachments?: IThreadAttachment[];
  isSystemMessage?: boolean;
  createdAt: Date;
}

export interface IInternalNote {
  _id?: mongoose.Types.ObjectId;
  note: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IEscalationRecord {
  _id?: mongoose.Types.ObjectId;
  escalatedTo: mongoose.Types.ObjectId;
  escalatedBy: mongoose.Types.ObjectId;
  reason: string;
  escalatedAt: Date;
}

export interface ITicket extends Document {
  ticketNumber: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  attachments: IAttachment[];
  threads?: IThread[];
  internalNotes?: IInternalNote[];
  escalationHistory?: IEscalationRecord[];
  tags: string[];
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema({
  fieldName: { type: String }, // Optional field name from online form
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const ThreadAttachmentSchema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
});

const ThreadSchema = new Schema({
  message: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [ThreadAttachmentSchema],
  isSystemMessage: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const InternalNoteSchema = new Schema({
  note: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const EscalationRecordSchema = new Schema({
  escalatedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  escalatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  escalatedAt: { type: Date, default: Date.now },
});

const TicketSchema: Schema = new Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed', 'on-hold'],
      default: 'open',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    attachments: [AttachmentSchema],
    threads: [ThreadSchema],
    internalNotes: [InternalNoteSchema],
    escalationHistory: [EscalationRecordSchema],
    tags: [{
      type: String,
      trim: true,
    }],
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
TicketSchema.index({ createdBy: 1, createdAt: -1 });
TicketSchema.index({ assignedTo: 1, status: 1 });
TicketSchema.index({ ticketNumber: 'text', title: 'text', description: 'text' });

export const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
