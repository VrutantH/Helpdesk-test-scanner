import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeBaseArticle extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  displayOrder: number;
  isActive: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeBaseArticleSchema = new Schema<IKnowledgeBaseArticle>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  notHelpfulCount: {
    type: Number,
    default: 0
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
KnowledgeBaseArticleSchema.index({ projectId: 1, status: 1, isActive: 1 });
KnowledgeBaseArticleSchema.index({ projectId: 1, category: 1 });
KnowledgeBaseArticleSchema.index({ title: 'text', content: 'text' }); // Text search

export const KnowledgeBaseArticle = mongoose.model<IKnowledgeBaseArticle>('KnowledgeBaseArticle', KnowledgeBaseArticleSchema);
