"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const fixUserDocument = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sac_helpdesk';
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ Connected to MongoDB');
        const superAdmins = await User_1.User.find({ role: 'super_admin' });
        console.log(`📋 Found ${superAdmins.length} super admin users:`);
        for (const admin of superAdmins) {
            console.log('\n📄 User Document:');
            console.log('   🆔 ID:', admin._id);
            console.log('   📧 Email:', admin.email);
            console.log('   👤 Name:', admin.firstName, admin.lastName);
            console.log('   📱 Mobile:', admin.mobile || 'MISSING');
            console.log('   🔐 OTP:', admin.resetPasswordOTP || 'MISSING');
            console.log('   ⏰ OTP Expires:', admin.resetPasswordOTPExpires || 'MISSING');
            console.log('   🔄 Created:', admin.createdAt);
            console.log('   📝 Updated:', admin.updatedAt);
        }
        const targetUser = await User_1.User.findOne({ email: 'admin@helpdesk.gov.in' });
        if (!targetUser) {
            console.log('❌ Target user not found');
            return;
        }
        console.log('\n🔧 Updating user document...');
        const updateResult = await User_1.User.updateOne({ email: 'admin@helpdesk.gov.in' }, {
            $set: {
                mobile: '9876543210',
                resetPasswordOTP: undefined,
                resetPasswordOTPExpires: undefined,
                resetPasswordAttempts: 0,
                resetPasswordLockedUntil: undefined
            }
        });
        console.log('📊 Update Result:', updateResult);
        const updatedUser = await User_1.User.findOne({ email: 'admin@helpdesk.gov.in' });
        console.log('\n✅ After Update:');
        console.log('   📧 Email:', updatedUser?.email);
        console.log('   👤 Name:', updatedUser?.firstName, updatedUser?.lastName);
        console.log('   📱 Mobile:', updatedUser?.mobile || 'STILL MISSING');
        console.log('   🔐 OTP:', updatedUser?.resetPasswordOTP || 'None');
        console.log('   ⏰ OTP Expires:', updatedUser?.resetPasswordOTPExpires || 'None');
        console.log('   🔄 Attempts:', updatedUser?.resetPasswordAttempts);
        console.log('\n🔍 Raw Document (JSON):');
        console.log(JSON.stringify(updatedUser?.toObject(), null, 2));
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
};
fixUserDocument();
//# sourceMappingURL=fixUserDocument.js.map