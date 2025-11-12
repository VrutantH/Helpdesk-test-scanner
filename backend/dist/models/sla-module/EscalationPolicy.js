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
const mongoose_1 = __importStar(require("mongoose"));
const EscalationLevelSchema = new mongoose_1.Schema({
    level: {
        type: Number,
        required: true,
        min: 1,
    },
    escalateAfter: {
        value: {
            type: Number,
            required: true,
            min: 1,
        },
        unit: {
            type: String,
            required: true,
            enum: ['minutes', 'hours', 'days'],
        },
    },
    escalateTo: {
        type: {
            type: String,
            required: true,
            enum: ['user', 'group', 'role'],
        },
        targetId: {
            type: String,
            required: true,
        },
        targetName: {
            type: String,
            required: true,
        },
    },
    notifyMethod: [
        {
            type: String,
            enum: ['email', 'sms', 'push'],
        },
    ],
    emailTemplate: {
        type: String,
    },
    actions: {
        changePriority: {
            type: String,
            enum: ['Urgent', 'High', 'Normal', 'Low'],
        },
        addWatchers: [String],
        changeStatus: String,
    },
}, { _id: false });
const EscalationPolicySchema = new mongoose_1.Schema({
    policyId: {
        type: String,
        required: false,
        unique: true,
        uppercase: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    levels: [EscalationLevelSchema],
    isActive: {
        type: Boolean,
        default: true,
    },
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
    },
    projectIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Project',
        },
    ],
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
EscalationPolicySchema.pre('save', async function (next) {
    if (this.isNew && !this.policyId) {
        const EscalationPolicyModel = this.constructor;
        const lastPolicy = await EscalationPolicyModel.findOne().sort({ policyId: -1 });
        let sequence = 1;
        if (lastPolicy && lastPolicy.policyId) {
            const lastSequence = parseInt(lastPolicy.policyId.replace('ESC', ''));
            if (!isNaN(lastSequence)) {
                sequence = lastSequence + 1;
            }
        }
        this.policyId = `ESC${sequence.toString().padStart(4, '0')}`;
    }
    next();
});
EscalationPolicySchema.index({ policyId: 1 });
EscalationPolicySchema.index({ isActive: 1 });
EscalationPolicySchema.index({ projectId: 1 });
EscalationPolicySchema.index({ projectIds: 1 });
EscalationPolicySchema.index({ createdAt: -1 });
const EscalationPolicy = mongoose_1.default.model('EscalationPolicy', EscalationPolicySchema);
exports.default = EscalationPolicy;
//# sourceMappingURL=EscalationPolicy.js.map