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
exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const projectSchema = new mongoose_1.Schema({
    projectId: {
        type: String,
        required: false,
        unique: true,
        uppercase: true,
    },
    name: {
        type: String,
        required: false,
        trim: true,
    },
    code: {
        type: String,
        required: false,
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: { type: String, default: 'India' },
        pincode: String,
    },
    contactInfo: {
        phone: String,
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        website: String,
    },
    region: String,
    primaryContact: {
        name: String,
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        phone: String,
        designation: String,
    },
    branding: {
        logo: String,
        colorTheme: {
            primary: { type: String, default: '#f97316' },
            secondary: { type: String, default: '#1f2937' },
            accent: { type: String, default: '#3b82f6' },
            background: { type: String, default: '#ffffff' },
        },
        headerText: String,
        footerText: String,
        domainUrl: String,
        favicon: String,
        customUrlPath: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true
        },
    },
    modules: {
        tickets: { type: Boolean, default: true },
        knowledgeBase: { type: Boolean, default: true },
        reports: { type: Boolean, default: true },
        assets: { type: Boolean, default: false },
        communication: { type: Boolean, default: true },
        analytics: { type: Boolean, default: true },
        userManagement: { type: Boolean, default: true },
        workflows: { type: Boolean, default: false },
        approvals: { type: Boolean, default: false },
        notifications: { type: Boolean, default: true },
    },
    settings: {
        defaultLanguage: { type: String, default: 'en' },
        timezone: { type: String, default: 'Asia/Kolkata' },
        dateFormat: { type: String, default: 'DD/MM/YYYY' },
        timeFormat: { type: String, default: '12h' },
        currency: { type: String, default: 'INR' },
        firstDayOfWeek: { type: Number, default: 0 },
    },
    configuration: {
        maxUsers: { type: Number, default: 100 },
        maxStorage: { type: Number, default: 10 },
        allowedDomains: [String],
        customFields: [{
                name: String,
                type: String,
                required: Boolean,
                options: [String],
            }],
        slaSettings: {
            enabled: { type: Boolean, default: false },
            defaultResponseTime: Number,
            defaultResolutionTime: Number,
        },
        securitySettings: {
            mfaRequired: { type: Boolean, default: false },
            passwordPolicy: {
                minLength: { type: Number, default: 8 },
                requireUppercase: { type: Boolean, default: true },
                requireLowercase: { type: Boolean, default: true },
                requireNumbers: { type: Boolean, default: true },
                requireSpecialChars: { type: Boolean, default: false },
                expiryDays: { type: Number, default: 90 },
            },
            sessionTimeout: { type: Number, default: 30 },
            ipWhitelist: [String],
            allowUserSignup: { type: Boolean, default: true },
            restrictSignupViaSocial: { type: Boolean, default: false },
        },
        loginSettings: {
            enableFormLogin: { type: Boolean, default: true },
            enableGoogleRecaptcha: { type: Boolean, default: false },
            socialLogins: {
                google: { type: Boolean, default: false },
                facebook: { type: Boolean, default: false },
                microsoft: { type: Boolean, default: false },
            },
            ssoSettings: {
                oauth20: { type: Boolean, default: false },
                openIdConnect: { type: Boolean, default: false },
                jwt: { type: Boolean, default: false },
            },
        },
        knowledgeBaseSettings: {
            enabled: { type: Boolean, default: false },
            kbHomeConfiguration: mongoose_1.Schema.Types.Mixed,
            articleConfiguration: mongoose_1.Schema.Types.Mixed,
            enableAIAssistance: { type: Boolean, default: false },
            enableSatisfactionFeedback: { type: Boolean, default: false },
            satisfactionFeedback: mongoose_1.Schema.Types.Mixed,
            seoSettings: mongoose_1.Schema.Types.Mixed,
        },
        customizationSettings: {
            loginPageBackgroundImage: { type: String },
            themeMode: { type: String, enum: ['light', 'dark'], default: 'light' },
            themeColor: { type: String, default: '#444ce7' },
            customCSS: { type: String },
            customJS: { type: String },
        },
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    users: {
        type: Number,
        default: 0,
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
});
projectSchema.index({ projectId: 1 });
projectSchema.index({ code: 1 });
projectSchema.index({ name: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ isActive: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.pre('save', async function (next) {
    if (this.isNew) {
        if (!this.projectId) {
            const count = await mongoose_1.default.models.Project.countDocuments();
            this.projectId = `P${String(count + 1).padStart(3, '0')}`;
        }
        if (!this.name && this.branding?.headerText) {
            this.name = this.branding.headerText;
        }
        if (!this.code && this.branding?.headerText) {
            this.code = this.branding.headerText.replace(/\s+/g, '').toUpperCase().substring(0, 10);
        }
    }
    next();
});
exports.Project = mongoose_1.default.model('Project', projectSchema);
//# sourceMappingURL=Project.js.map