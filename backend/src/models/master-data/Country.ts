import mongoose, { Document, Schema } from 'mongoose';

export interface ICountry extends Document {
  key: string;
  value: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  dialCode?: string;
  code?: string; // ISO country code
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CountrySchema = new Schema<ICountry>(
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
    dialCode: {
      type: String,
      trim: true
    },
    code: {
      type: String,
      trim: true,
      uppercase: true
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
CountrySchema.index({ key: 1 });
CountrySchema.index({ isActive: 1, displayOrder: 1 });

const Country = mongoose.model<ICountry>('Country', CountrySchema);

export default Country;
