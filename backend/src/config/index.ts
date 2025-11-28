/**
 * Application Configuration
 * Centralizes all environment variable access with proper validation
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

/**
 * Get JWT Secret with proper validation
 * In production: Throws error if JWT_SECRET is not set
 * In development: Uses fallback with warning
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    if (isProduction) {
      throw new Error('FATAL: JWT_SECRET environment variable must be set in production!');
    }
    console.warn('⚠️  WARNING: JWT_SECRET not set. Using development fallback. DO NOT use in production!');
    return 'dev-only-fallback-secret-change-in-production';
  }
  
  // Validate secret strength in production
  if (isProduction && secret.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be at least 32 characters in production!');
  }
  
  return secret;
};

export const config = {
  // Environment
  isProduction,
  isDevelopment,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  
  // JWT Configuration
  jwt: {
    secret: getJwtSecret(),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  
  // Database
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sac-helpdesk',
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  
  // File Upload
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(','),
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
};

export default config;
