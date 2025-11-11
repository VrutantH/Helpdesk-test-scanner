import mongoose, { Document, Schema } from 'mongoose';

export interface ICenter extends Document {
  key: string;
  value: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  address: string;
  city: string; // Reference to city key
  state: string; // Reference to state key
  zipcode: string;
  timing: string;
  googleMapLink?: string;
  phone?: string;
  email?: string;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CenterSchema = new Schema<ICenter>(
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
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      lowercase: true
    },
    state: {
      type: String,
      required: true,
      lowercase: true
    },
    zipcode: {
      type: String,
      required: true,
      trim: true
    },
    timing: {
      type: String,
      required: true,
      trim: true
    },
    googleMapLink: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
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
CenterSchema.index({ key: 1 });
CenterSchema.index({ city: 1, isActive: 1 });
CenterSchema.index({ state: 1, isActive: 1 });
CenterSchema.index({ isActive: 1, displayOrder: 1 });

const Center = mongoose.model<ICenter>('Center', CenterSchema);

export default Center;
