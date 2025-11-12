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
exports.SLATracking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SLATrackingSchema = new mongoose_1.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    slaRuleId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'SLARule',
        required: true,
    },
    priorityTier: {
        type: String,
        required: true,
        enum: ['Urgent', 'High', 'Normal', 'Low'],
    },
    responseTime: {
        dueAt: {
            type: Date,
            required: true,
        },
        respondedAt: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['pending', 'met', 'breached'],
            default: 'pending',
            index: true,
        },
        breachedBy: {
            type: Number,
        },
    },
    resolutionTime: {
        dueAt: {
            type: Date,
            required: true,
        },
        resolvedAt: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['pending', 'met', 'breached'],
            default: 'pending',
            index: true,
        },
        breachedBy: {
            type: Number,
        },
    },
    escalations: [{
            level: Number,
            escalatedAt: Date,
            escalatedTo: String,
            reason: String,
        }],
    pausedDuration: {
        type: Number,
        default: 0,
    },
    pauseHistory: [{
            pausedAt: Date,
            resumedAt: Date,
            reason: String,
            pausedBy: String,
        }],
    workingHoursOnly: {
        type: Boolean,
        default: true,
    },
    excludeHolidays: {
        type: Boolean,
        default: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    collection: 'sla_tracking',
});
SLATrackingSchema.index({ 'responseTime.status': 1, 'responseTime.dueAt': 1 });
SLATrackingSchema.index({ 'resolutionTime.status': 1, 'resolutionTime.dueAt': 1 });
SLATrackingSchema.index({ ticketId: 1, isActive: 1 });
exports.SLATracking = mongoose_1.default.model('SLATracking', SLATrackingSchema);
//# sourceMappingURL=SLATracking.js.map