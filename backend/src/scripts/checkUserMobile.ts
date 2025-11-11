import mongoose from 'mongoose';
import { User } from '../models/User';

const checkUserMobile = async () => {
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

    if (superAdmin) {
      console.log('📋 Current User Information:');
      console.log('   👤 Name:', superAdmin.firstName, superAdmin.lastName);
      console.log('   📧 Email:', superAdmin.email);
      console.log('   📱 Mobile:', superAdmin.mobile);
      console.log('   🔐 OTP:', superAdmin.resetPasswordOTP || 'None');
      console.log('   ⏰ OTP Expires:', superAdmin.resetPasswordOTPExpires || 'None');
    } else {
      console.log('❌ Super admin user not found');
    }

    // Also check if there's a user with the new mobile number
    const userWithNewMobile = await User.findOne({ mobile: '9769406488' });
    if (userWithNewMobile) {
      console.log('\n📋 User with mobile 9769406488:');
      console.log('   👤 Name:', userWithNewMobile.firstName, userWithNewMobile.lastName);
      console.log('   📧 Email:', userWithNewMobile.email);
      console.log('   📱 Mobile:', userWithNewMobile.mobile);
    } else {
      console.log('\n❌ No user found with mobile 9769406488');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the script
checkUserMobile();