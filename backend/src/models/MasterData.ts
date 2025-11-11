import mongoose, { Document, Schema } from 'mongoose';

export interface IMasterData extends Document {
  category: string; // 'organizationType', 'industry', 'region', 'country', etc.
  key: string; // Unique identifier within category
  value: string; // Display value
  description?: string;
  displayOrder?: number;
  isActive: boolean;
  metadata?: {
    color?: string;
    icon?: string;
    [key: string]: any;
  };
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const masterDataSchema = new Schema<IMasterData>({
  category: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  key: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Compound index for category + key uniqueness
masterDataSchema.index({ category: 1, key: 1 }, { unique: true });

// Index for active records
masterDataSchema.index({ category: 1, isActive: 1, displayOrder: 1 });

export const MasterData = mongoose.model<IMasterData>('MasterData', masterDataSchema);
