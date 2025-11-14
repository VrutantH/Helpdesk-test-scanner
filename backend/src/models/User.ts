import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile?: string; // Mobile number for OTP verification
  role: mongoose.Types.ObjectId; // Reference to Role model
  isActive: boolean;
  lastLogin?: Date;
  eulaAccepted?: boolean; // EULA acceptance status
  eulaAcceptedAt?: Date; // When EULA was accepted
  requirePasswordSetup?: boolean; // Flag for first-time student users who need to set password via OTP
  createdAt: Date;
  updatedAt: Date;
  
  // HRMS Integration fields
  hrmsId?: number; // PeopleStrong employee ID
  employeeCode?: string; // Unique employee code from HRMS
  department?: string;
  designation?: string;
  joiningDate?: Date;
  reportingManager?: mongoose.Types.ObjectId; // Reference to another User
  
  // Project/Portal assignment
  projects?: mongoose.Types.ObjectId[]; // Multiple projects can be assigned
  
  // OTP-related fields
  resetPasswordOTP?: string;
  resetPasswordOTPExpires?: Date;
  resetPasswordAttempts?: number;
  resetPasswordLockedUntil?: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateResetPasswordOTP(): string;
  isResetPasswordLocked(): boolean;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function(this: IUser) {
      // Password is optional for new student users who haven't set it yet
      return !this.requirePasswordSetup;
    },
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
      validator: function(v: string) {
        return !v || /^[6-9]\d{9}$/.test(v); // Indian mobile number validation
      },
      message: 'Please enter a valid 10-digit mobile number'
    }
  },
  role: {
    type: Schema.Types.ObjectId,
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
  requirePasswordSetup: {
    type: Boolean,
    default: false,
  },
  // HRMS Integration fields
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
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  projects: [{
    type: Schema.Types.ObjectId,
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate reset password OTP
userSchema.methods.generateResetPasswordOTP = function(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.resetPasswordOTP = otp;
  this.resetPasswordOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

// Check if account is locked for password reset
userSchema.methods.isResetPasswordLocked = function(): boolean {
  return !!(this.resetPasswordLockedUntil && this.resetPasswordLockedUntil > new Date());
};

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });
userSchema.index({ employeeCode: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ projects: 1 });
userSchema.index({ department: 1 });
userSchema.index({ hrmsId: 1 });

export const User = mongoose.model<IUser>('User', userSchema);