import mongoose, { Document, Schema } from 'mongoose';

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

const EulaAcceptanceSchema = new Schema<IEulaAcceptance>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    userRole: {
      type: String,
      required: true,
      enum: ['admin', 'agent', 'user', 'super_admin']
    },
    ipAddress: {
      type: String,
      required: true
    },
    userAgent: {
      type: String
    },
    eulaVersion: {
      type: String,
      required: true,
      default: '1.0'
    },
    acceptedAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index for efficient queries
EulaAcceptanceSchema.index({ userId: 1, eulaVersion: 1 });
EulaAcceptanceSchema.index({ acceptedAt: -1 });

const EulaAcceptance = mongoose.model<IEulaAcceptance>('EulaAcceptance', EulaAcceptanceSchema);

export default EulaAcceptance;
