"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const resetRateLimit = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sac_helpdesk';
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ Connected to MongoDB');
        const result = await User_1.User.updateOne({ mobile: '9876543210' }, {
            $unset: {
                resetPasswordLockedUntil: 1
            },
            $set: {
                resetPasswordAttempts: 0
            }
        });
        console.log('🔄 Rate limit reset result:', result);
        const user = await User_1.User.findOne({ mobile: '9876543210' });
        if (user) {
            const otp = user.generateResetPasswordOTP();
            await user.save();
            console.log('✅ New OTP generated:');
            console.log('   🔐 OTP:', otp);
            console.log('   ⏰ Expires:', user.resetPasswordOTPExpires);
            const updatedUser = await User_1.User.findOne({ mobile: '9876543210' });
            console.log('\n📄 Complete User Document:');
            console.log(JSON.stringify(updatedUser?.toObject(), null, 2));
        }
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
};
resetRateLimit();
//# sourceMappingURL=resetAndGenerateOTP.js.map