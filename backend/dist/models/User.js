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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    mobile: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                return !v || /^[6-9]\d{9}$/.test(v);
            },
            message: 'Please enter a valid 10-digit mobile number'
        }
    },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
    eulaAccepted: {
        type: Boolean,
        default: false,
    },
    eulaAcceptedAt: {
        type: Date,
    },
    hrmsId: {
        type: Number,
        sparse: true,
    },
    employeeCode: {
        type: String,
        sparse: true,
        unique: true,
        trim: true,
    },
    department: {
        type: String,
        trim: true,
    },
    designation: {
        type: String,
        trim: true,
    },
    joiningDate: {
        type: Date,
    },
    reportingManager: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    projects: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Project',
        }],
    resetPasswordOTP: {
        type: String,
    },
    resetPasswordOTPExpires: {
        type: Date,
    },
    resetPasswordAttempts: {
        type: Number,
        default: 0,
    },
    resetPasswordLockedUntil: {
        type: Date,
    },
}, {
    timestamps: true,
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcryptjs_1.default.genSalt(12);
        this.password = await bcryptjs_1.default.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
userSchema.methods.generateResetPasswordOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.resetPasswordOTP = otp;
    this.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    return otp;
};
userSchema.methods.isResetPasswordLocked = function () {
    return !!(this.resetPasswordLockedUntil && this.resetPasswordLockedUntil > new Date());
};
userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ employeeCode: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ projects: 1 });
userSchema.index({ department: 1 });
userSchema.index({ hrmsId: 1 });
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map