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
const accessLogSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    userName: {
        type: String
    },
    userEmail: {
        type: String,
        required: true,
        index: true
    },
    action: {
        type: String,
        required: true,
        enum: ['login', 'logout', 'login_failed', 'password_reset', 'forgot_password', 'session_expired'],
        index: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
        index: true
    },
    failureReason: {
        type: String
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project'
    },
    projectName: {
        type: String
    },
    role: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    sessionDuration: {
        type: Number
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed
    }
}, {
    timestamps: true
});
accessLogSchema.index({ timestamp: -1 });
accessLogSchema.index({ userId: 1, timestamp: -1 });
accessLogSchema.index({ success: 1, timestamp: -1 });
accessLogSchema.index({ action: 1, timestamp: -1 });
exports.default = mongoose_1.default.model('AccessLog', accessLogSchema);
//# sourceMappingURL=AccessLog.js.map