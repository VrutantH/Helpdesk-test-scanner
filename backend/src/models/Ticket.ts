import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  ticketNumber: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  subcategory?: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  attachments: Array<{
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    uploadedAt: Date;
  }>;
  comments: Array<{
    author: mongoose.Types.ObjectId;
    content: string;
    isInternal: boolean;
    createdAt: Date;
  }>;
  resolution?: string;
  resolvedAt?: Date;
  closedAt?: Date;
  estimatedResolutionTime?: Date;
  actualResolutionTime?: Date;
  satisfactionRating?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>({
  ticketNumber: {
    type: String,
    unique: true,
    match: [/^TKT-\d{8}-\d{4}$/, 'Invalid ticket number format']
  },
  title: {
    type: String,
    required: [true, 'Ticket title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Ticket description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'in_progress', 'resolved', 'closed', 'pending'],
      message: 'Status must be one of: open, in_progress, resolved, closed, pending'
    },
    default: 'open'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Priority must be one of: low, medium, high, urgent'
    },
    default: 'medium'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters']
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters']
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    type: String,
    trim: true,
    maxlength: [2000, 'Resolution cannot exceed 2000 characters']
  },
  resolvedAt: {
    type: Date
  },
  closedAt: {
    type: Date
  },
  estimatedResolutionTime: {
    type: Date
  },
  actualResolutionTime: {
    type: Date
  },
  satisfactionRating: {
    type: Number,
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ticketSchema.index({ ticketNumber: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ category: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ createdBy: 1 });
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ 'tags': 1 });

// Compound indexes
ticketSchema.index({ status: 1, priority: -1, createdAt: -1 });
ticketSchema.index({ assignedTo: 1, status: 1 });

// Virtual for time since creation
ticketSchema.virtual('timeSinceCreation').get(function(this: ITicket) {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for resolution time
ticketSchema.virtual('resolutionTime').get(function(this: ITicket) {
  if (this.resolvedAt) {
    return this.resolvedAt.getTime() - this.createdAt.getTime();
  }
  return null;
});

// Pre-save middleware to generate ticket number
ticketSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Find the last ticket created today
    const TicketModel = this.constructor as mongoose.Model<ITicket>;
    const lastTicket = await TicketModel.findOne({
      ticketNumber: new RegExp(`^TKT-${dateStr}-`)
    }).sort({ ticketNumber: -1 });
    
    let sequence = 1;
    if (lastTicket) {
      const lastSequence = parseInt(lastTicket.ticketNumber.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }
    
    this.ticketNumber = `TKT-${dateStr}-${sequence.toString().padStart(4, '0')}`;
  }
  
  // Auto-set resolution time when status changes to resolved
  if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  
  // Auto-set closed time when status changes to closed
  if (this.isModified('status') && this.status === 'closed' && !this.closedAt) {
    this.closedAt = new Date();
  }
  
  next();
});

// Static method to get ticket statistics
ticketSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const priorityStats = await this.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return { statusStats: stats, priorityStats };
};

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);