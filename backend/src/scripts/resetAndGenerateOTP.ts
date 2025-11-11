import mongoose from 'mongoose';
import { User } from '../models/User';

const resetRateLimit = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sac_helpdesk';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Reset rate limiting for the user
    const result = await User.updateOne(
      { mobile: '9876543210' },
      { 
        $unset: { 
          resetPasswordLockedUntil: 1 
        },
        $set: {
          resetPasswordAttempts: 0
        }
      }
    );

    console.log('🔄 Rate limit reset result:', result);

    // Now generate a new OTP
    const user = await User.findOne({ mobile: '9876543210' });
    if (user) {
      const otp = user.generateResetPasswordOTP();
      await user.save();
      
      console.log('✅ New OTP generated:');
      console.log('   🔐 OTP:', otp);
      console.log('   ⏰ Expires:', user.resetPasswordOTPExpires);
      
      // Show the complete document
      const updatedUser = await User.findOne({ mobile: '9876543210' });
      console.log('\n📄 Complete User Document:');
      console.log(JSON.stringify(updatedUser?.toObject(), null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the script
resetRateLimit();