import mongoose, { Document, Schema } from 'mongoose';

export interface IIndustry extends Document {
  key: string;
  value: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const IndustrySchema = new Schema<IIndustry>(
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
IndustrySchema.index({ key: 1 });
IndustrySchema.index({ isActive: 1, displayOrder: 1 });

const Industry = mongoose.model<IIndustry>('Industry', IndustrySchema);

export default Industry;
