import mongoose, { Document, Schema } from 'mongoose';

export interface ITimezone extends Document {
  key: string;
  value: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  offset?: string; // e.g., "+05:30"
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TimezoneSchema = new Schema<ITimezone>(
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
    offset: {
      type: String,
      trim: true
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
TimezoneSchema.index({ key: 1 });
TimezoneSchema.index({ isActive: 1, displayOrder: 1 });

const Timezone = mongoose.model<ITimezone>('Timezone', TimezoneSchema);

export default Timezone;
