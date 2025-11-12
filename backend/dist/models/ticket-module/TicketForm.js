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
exports.TicketForm = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TicketFormSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    formType: {
        type: String,
        enum: ['agent', 'customer'],
        required: true,
    },
    fields: [{
            fieldId: {
                type: String,
                required: true,
            },
            required: {
                type: Boolean,
                default: false,
            },
            visible: {
                type: Boolean,
                default: true,
            },
            displayOrder: {
                type: Number,
                default: 0,
            },
            conditionalLogic: {
                showIf: [{
                        fieldId: String,
                        operator: String,
                        value: String,
                    }],
            },
        }],
    sections: [{
            title: String,
            description: String,
            fields: [String],
            displayOrder: Number,
        }],
    isDefault: {
        type: Boolean,
        default: false,
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
    collection: 'ticket_forms',
});
TicketFormSchema.index({ formType: 1, isActive: 1 });
TicketFormSchema.index({ isDefault: 1 });
exports.TicketForm = mongoose_1.default.model('TicketForm', TicketFormSchema);
//# sourceMappingURL=TicketForm.js.map