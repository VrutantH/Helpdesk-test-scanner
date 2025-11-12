import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new Schema({
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
        minlength: 8,
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
                return !v || /^[6-9]\d{9}$/.test(v); // Indian mobile number validation
            },
            message: 'Please enter a valid 10-digit mobile number'
        }
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'agent', 'user'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
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
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
// Generate reset password OTP
userSchema.methods.generateResetPasswordOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    this.resetPasswordOTP = otp;
    this.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return otp;
};
// Check if account is locked for password reset
userSchema.methods.isResetPasswordLocked = function () {
    return !!(this.resetPasswordLockedUntil && this.resetPasswordLockedUntil > new Date());
};
// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
export const User = mongoose.model('User', userSchema);
