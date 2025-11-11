import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganizationType extends Document {
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

const OrganizationTypeSchema = new Schema<IOrganizationType>(
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
OrganizationTypeSchema.index({ key: 1 });
OrganizationTypeSchema.index({ isActive: 1, displayOrder: 1 });

const OrganizationType = mongoose.model<IOrganizationType>('OrganizationType', OrganizationTypeSchema);

export default OrganizationType;
