import mongoose, { Document, Schema } from 'mongoose';

export interface ICurrency extends Document {
  key: string;
  value: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  symbol?: string;
  code?: string; // ISO currency code
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CurrencySchema = new Schema<ICurrency>(
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
    symbol: {
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
CurrencySchema.index({ key: 1 });
CurrencySchema.index({ isActive: 1, displayOrder: 1 });

const Currency = mongoose.model<ICurrency>('Currency', CurrencySchema);

export default Currency;
