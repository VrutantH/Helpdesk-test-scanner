"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ticketSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
ticketSchema.index({ ticketNumber: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ category: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ createdBy: 1 });
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ 'tags': 1 });
ticketSchema.index({ status: 1, priority: -1, createdAt: -1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.virtual('timeSinceCreation').get(function () {
    return Date.now() - this.createdAt.getTime();
});
ticketSchema.virtual('resolutionTime').get(function () {
    if (this.resolvedAt) {
        return this.resolvedAt.getTime() - this.createdAt.getTime();
    }
    return null;
});
ticketSchema.pre('save', async function (next) {
    if (this.isNew && !this.ticketNumber) {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const TicketModel = this.constructor;
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
    if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
        this.resolvedAt = new Date();
    }
    if (this.isModified('status') && this.status === 'closed' && !this.closedAt) {
        this.closedAt = new Date();
    }
    next();
});
ticketSchema.statics.getStatistics = async function () {
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
exports.Ticket = mongoose_1.default.model('Ticket', ticketSchema);
//# sourceMappingURL=Ticket.js.map