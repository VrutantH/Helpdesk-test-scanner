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
exports.TicketField = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TicketFieldSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    icon: {
        type: String,
        default: '📝',
    },
    labelAgentPortal: {
        type: String,
        required: true,
    },
    labelCustomerPortal: {
        type: String,
        required: true,
    },
    apiName: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['System', 'Custom'],
        default: 'Custom',
    },
    fieldType: {
        type: String,
        enum: ['text', 'dropdown', 'textarea', 'date', 'checkbox', 'number', 'email', 'phone'],
        default: 'text',
    },
    required: {
        type: Boolean,
        default: false,
    },
    visibleInAgentPortal: {
        type: Boolean,
        default: true,
    },
    visibleInCustomerPortal: {
        type: Boolean,
        default: false,
    },
    options: [{
            type: String,
        }],
    defaultValue: String,
    placeholder: String,
    helpText: String,
    validation: {
        minLength: Number,
        maxLength: Number,
        pattern: String,
        errorMessage: String,
    },
    displayOrder: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
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
    collection: 'ticket_fields',
});
TicketFieldSchema.index({ apiName: 1 });
TicketFieldSchema.index({ type: 1, isActive: 1 });
TicketFieldSchema.index({ displayOrder: 1 });
exports.TicketField = mongoose_1.default.model('TicketField', TicketFieldSchema);
//# sourceMappingURL=TicketField.js.map