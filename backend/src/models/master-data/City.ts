import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  key: string;
  value: string;
  state: string;
  country: string;
  displayOrder?: number;
  isActive: boolean;
}

const CitySchema = new Schema<ICity>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'cities' // Explicitly set collection name
});

export const City = mongoose.model<ICity>('City', CitySchema);
