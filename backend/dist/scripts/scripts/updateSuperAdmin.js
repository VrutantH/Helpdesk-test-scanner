import mongoose from 'mongoose';
import { User } from '../models/User';
const updateSuperAdmin = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sac_helpdesk';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');
        // Find the super admin user
        const superAdmin = await User.findOne({
            email: 'admin@helpdesk.gov.in',
            role: 'super_admin'
        });
        if (!superAdmin) {
            console.log('❌ Super admin user not found');
            return;
        }
        console.log('📋 Current super admin data:');
        console.log('   📧 Email:', superAdmin.email);
        console.log('   👤 Name:', superAdmin.firstName, superAdmin.lastName);
        console.log('   📱 Mobile:', superAdmin.mobile || 'NOT SET');
        console.log('   🔐 Has OTP fields:', !!superAdmin.resetPasswordOTP);
        // Update the super admin user with mobile number if not set
        if (!superAdmin.mobile) {
            superAdmin.mobile = '9876543210';
            await superAdmin.save();
            console.log('✅ Updated super admin with mobile number: 9876543210');
        }
        else {
            console.log('ℹ️  Super admin already has mobile number:', superAdmin.mobile);
        }
        // Display updated info
        const updatedAdmin = await User.findOne({
            email: 'admin@helpdesk.gov.in',
            role: 'super_admin'
        });
        console.log('\n📋 Updated super admin data:');
        console.log('   📧 Email:', updatedAdmin?.email);
        console.log('   👤 Name:', updatedAdmin?.firstName, updatedAdmin?.lastName);
        console.log('   📱 Mobile:', updatedAdmin?.mobile);
        console.log('   🔐 OTP Field:', updatedAdmin?.resetPasswordOTP || 'None');
        console.log('   ⏰ OTP Expires:', updatedAdmin?.resetPasswordOTPExpires || 'None');
    }
    catch (error) {
        console.error('❌ Error updating super admin:', error);
    }
    finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
};
// Run the script
updateSuperAdmin();
