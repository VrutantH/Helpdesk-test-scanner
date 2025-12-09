import mongoose from 'mongoose';

/**
 * Get MongoDB URI based on environment and domain
 * If running on production domain (helpdesk.hubblehox.ai), use production MongoDB
 * Otherwise use local MongoDB for development
 */
const getMongoDBUri = (): string => {
  const isProduction = process.env.NODE_ENV === 'production';
  const productionDomain = 'helpdesk.hubblehox.ai';
  
  // Check if any environment variable points to production domain
  const isProductionDomain = 
    process.env.PRODUCTION_FRONTEND_URL?.includes(productionDomain) ||
    process.env.PRODUCTION_BACKEND_URL?.includes(productionDomain) ||
    process.env.PRODUCTION_API_URL?.includes(productionDomain);
  
  // Use production MongoDB if:
  // 1. NODE_ENV is 'production' OR
  // 2. Domain is production domain
  if (isProduction || isProductionDomain) {
    const uri = process.env.MONGODB_PRODUCTION_URI;
    if (!uri) {
      console.error('❌ MONGODB_PRODUCTION_URI is not set in .env');
      console.error('Production domain detected but no production MongoDB configured');
      throw new Error('MONGODB_PRODUCTION_URI must be set for production deployments');
    }
    console.log('🔐 Using PRODUCTION MongoDB');
    return uri;
  }
  
  // Development MongoDB
  const uri = process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/sac_helpdesk';
  console.log('💾 Using LOCAL development MongoDB');
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
