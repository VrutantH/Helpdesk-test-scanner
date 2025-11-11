import mongoose, { Document, Schema } from 'mongoose';

export interface IDateFormat extends Document {
  key: string;
  value: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  format?: string; // e.g., "DD/MM/YYYY"
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DateFormatSchema = new Schema<IDateFormat>(
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
    format: {
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
DateFormatSchema.index({ key: 1 });
DateFormatSchema.index({ isActive: 1, displayOrder: 1 });

const DateFormat = mongoose.model<IDateFormat>('DateFormat', DateFormatSchema);

export default DateFormat;
