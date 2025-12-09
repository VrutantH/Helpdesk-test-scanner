import mongoose from 'mongoose';

/**
 * Get MongoDB URI based on NODE_ENV
 * If NODE_ENV=production -> use MONGODB_PRODUCTION_URI
 * Otherwise -> use MONGODB_LOCAL_URI
 */
const getMongoDBUri = (): string => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    const uri = process.env.MONGODB_PRODUCTION_URI;
    if (!uri) {
      console.error('❌ MONGODB_PRODUCTION_URI is not set in .env');
      throw new Error('MONGODB_PRODUCTION_URI must be set for production deployments');
    }
    console.log('🔐 Using PRODUCTION MongoDB (from MONGODB_PRODUCTION_URI)');
    return uri;
  }
  
  // Development MongoDB
  const uri = process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/sac_helpdesk';
  console.log('💾 Using LOCAL development MongoDB (from MONGODB_LOCAL_URI)');
  return uri;
};

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = getMongoDBUri();
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
