"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const checkOTP = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sac_helpdesk';
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ Connected to MongoDB');
        const superAdmin = await User_1.User.findOne({
            mobile: '9876543210'
        }).select('firstName lastName mobile resetPasswordOTP resetPasswordOTPExpires');
        if (!superAdmin) {
            console.log('❌ User with mobile 9876543210 not found');
            return;
        }
        console.log('📋 User OTP Information:');
        console.log('   👤 Name:', superAdmin.firstName, superAdmin.lastName);
        console.log('   📱 Mobile:', superAdmin.mobile);
        console.log('   🔐 Current OTP:', superAdmin.resetPasswordOTP || 'None');
        console.log('   ⏰ OTP Expires:', superAdmin.resetPasswordOTPExpires || 'None');
        if (superAdmin.resetPasswordOTP && superAdmin.resetPasswordOTPExpires) {
            const now = new Date();
            const expiresAt = new Date(superAdmin.resetPasswordOTPExpires);
            const isExpired = now > expiresAt;
            const minutesLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60));
            console.log('   ✅ Valid:', !isExpired);
            console.log('   ⏱️  Time left:', isExpired ? 'EXPIRED' : `${minutesLeft} minutes`);
        }
    }
    catch (error) {
        console.error('❌ Error checking OTP:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
};
checkOTP();
//# sourceMappingURL=checkOTP.js.map