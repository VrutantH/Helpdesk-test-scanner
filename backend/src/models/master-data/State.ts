import mongoose, { Schema, Document } from 'mongoose';

export interface IState extends Document {
  key: string;
  value: string;
  country: string;
  displayOrder?: number;
  isActive: boolean;
}

const StateSchema = new Schema<IState>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  country: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'states' // Explicitly set collection name
});

export const State = mongoose.model<IState>('State', StateSchema);
