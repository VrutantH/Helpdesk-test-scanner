import mongoose, { Document, Schema } from 'mongoose';

export interface ICity extends Document {
  key: string;
  value: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  state: string; // Reference to state key
  country: string; // Reference to country key
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
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
    state: {
      type: String,
      required: true,
      lowercase: true
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
CitySchema.index({ key: 1 });
CitySchema.index({ state: 1, isActive: 1 });
CitySchema.index({ isActive: 1, displayOrder: 1 });

const City = mongoose.model<ICity>('City', CitySchema);

export default City;
