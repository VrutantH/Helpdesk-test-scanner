import mongoose, { Document, Schema } from 'mongoose';

export interface ILanguage extends Document {
  key: string;
  value: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  code?: string; // ISO language code
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LanguageSchema = new Schema<ILanguage>(
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
    code: {
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
LanguageSchema.index({ key: 1 });
LanguageSchema.index({ isActive: 1, displayOrder: 1 });

const Language = mongoose.model<ILanguage>('Language', LanguageSchema);

export default Language;
