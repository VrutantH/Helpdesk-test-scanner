import mongoose from 'mongoose';
import { User } from '../models/User';

const fixUserDocument = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sac_helpdesk';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Find all users with super_admin role
    const superAdmins = await User.find({ role: 'super_admin' });
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

    // Find the specific user by email
    const targetUser = await User.findOne({ email: 'admin@helpdesk.gov.in' });
    
    if (!targetUser) {
      console.log('❌ Target user not found');
      return;
    }

    console.log('\n🔧 Updating user document...');
    
    // Force update all missing fields
    const updateResult = await User.updateOne(
      { email: 'admin@helpdesk.gov.in' },
      { 
        $set: { 
          mobile: '9876543210',
          resetPasswordOTP: undefined,
          resetPasswordOTPExpires: undefined,
          resetPasswordAttempts: 0,
          resetPasswordLockedUntil: undefined
        }
      }
    );

    console.log('📊 Update Result:', updateResult);

    // Verify the update
    const updatedUser = await User.findOne({ email: 'admin@helpdesk.gov.in' });
    console.log('\n✅ After Update:');
    console.log('   📧 Email:', updatedUser?.email);
    console.log('   👤 Name:', updatedUser?.firstName, updatedUser?.lastName);
    console.log('   📱 Mobile:', updatedUser?.mobile || 'STILL MISSING');
    console.log('   🔐 OTP:', updatedUser?.resetPasswordOTP || 'None');
    console.log('   ⏰ OTP Expires:', updatedUser?.resetPasswordOTPExpires || 'None');
    console.log('   🔄 Attempts:', updatedUser?.resetPasswordAttempts);

    // Show raw document structure
    console.log('\n🔍 Raw Document (JSON):');
    console.log(JSON.stringify(updatedUser?.toObject(), null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the script
fixUserDocument();