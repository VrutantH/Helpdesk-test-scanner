import mongoose, { Document, Schema } from 'mongoose';

export interface IState extends Document {
  key: string;
  value: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  country: string; // Reference to country key
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StateSchema = new Schema<IState>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    country: {
      type: String,
      required: true,
      default: 'india',
      lowercase: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
StateSchema.index({ key: 1 });
StateSchema.index({ isActive: 1, displayOrder: 1 });
StateSchema.index({ country: 1 });

const State = mongoose.model<IState>('State', StateSchema);

export default State;
