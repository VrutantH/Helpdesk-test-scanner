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
const SLARuleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    priority: {
        type: String,
        required: false,
        enum: ['Critical', 'Urgent', 'High', 'Normal', 'Low'],
    },
    responseTime: {
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
    resolutionTime: {
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
    isActive: {
        type: Boolean,
        default: true,
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
SLARuleSchema.index({ priority: 1, isActive: 1 });
SLARuleSchema.index({ projectIds: 1 });
SLARuleSchema.index({ createdAt: -1 });
const SLARule = mongoose_1.default.model('SLARule', SLARuleSchema);
exports.default = SLARule;
//# sourceMappingURL=SLARule.js.map