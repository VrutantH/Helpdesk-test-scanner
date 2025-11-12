"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const checkUserMobile = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sac_helpdesk';
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ Connected to MongoDB');
        const superAdmin = await User_1.User.findOne({
            email: 'admin@helpdesk.gov.in',
            role: 'super_admin'
        });
        if (superAdmin) {
            console.log('📋 Current User Information:');
            console.log('   👤 Name:', superAdmin.firstName, superAdmin.lastName);
            console.log('   📧 Email:', superAdmin.email);
            console.log('   📱 Mobile:', superAdmin.mobile);
            console.log('   🔐 OTP:', superAdmin.resetPasswordOTP || 'None');
            console.log('   ⏰ OTP Expires:', superAdmin.resetPasswordOTPExpires || 'None');
        }
        else {
            console.log('❌ Super admin user not found');
        }
        const userWithNewMobile = await User_1.User.findOne({ mobile: '9769406488' });
        if (userWithNewMobile) {
            console.log('\n📋 User with mobile 9769406488:');
            console.log('   👤 Name:', userWithNewMobile.firstName, userWithNewMobile.lastName);
            console.log('   📧 Email:', userWithNewMobile.email);
            console.log('   📱 Mobile:', userWithNewMobile.mobile);
        }
        else {
            console.log('\n❌ No user found with mobile 9769406488');
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
checkUserMobile();
//# sourceMappingURL=checkUserMobile.js.map