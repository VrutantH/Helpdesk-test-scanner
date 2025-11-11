import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  code: string;
  description?: string;
  type: 'system' | 'custom';
  projectId?: mongoose.Types.ObjectId;
  permissions: mongoose.Types.ObjectId[];
  agentCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['system', 'custom'],
      default: 'custom',
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: false,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Permission',
      },
    ],
    agentCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
roleSchema.index({ code: 1, projectId: 1 }, { unique: true });
roleSchema.index({ projectId: 1 });
roleSchema.index({ type: 1 });

export const Role = mongoose.model<IRole>('Role', roleSchema);
