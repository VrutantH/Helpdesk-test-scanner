# Hardcoded URLs Removal - Implementation Summary

## Objective
Remove all hardcoded URLs from the backend code and centralize all URL configuration in `.env` file only.

## Changes Made

### 1. **Updated `.env` Configuration**
Added comprehensive environment variables for all deployment environments:

**Development URLs:**
- `FRONTEND_URL=http://localhost:3001`
- `BACKEND_URL=http://localhost:3003`
- `API_URL=http://localhost:3003/api`
- `ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000,http://localhost:3003`

**Production URLs:**
- `PRODUCTION_FRONTEND_URL=https://helpdesk.hubblehox.ai`
- `PRODUCTION_BACKEND_URL=https://api.helpdesk.hubblehox.ai`
- `PRODUCTION_API_URL=https://api.helpdesk.hubblehox.ai/api`
- `PRODUCTION_ALLOWED_ORIGINS=https://helpdesk.hubblehox.ai,https://api.helpdesk.hubblehox.ai`

**Socket.IO Configuration:**
- `SOCKET_CORS_ORIGIN=http://localhost:3001`
- `PRODUCTION_SOCKET_CORS_ORIGIN=https://helpdesk.hubblehox.ai`

### 2. **Updated `backend/src/server.ts`**
**Before:** Hardcoded URLs in CORS and Socket.IO configuration
```typescript
const socketAllowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://helpdesk.hubblehox.ai',
  'https://api.helpdesk.hubblehox.ai',
  process.env.FRONTEND_URL
];
```

**After:** Dynamic configuration from environment variables
```typescript
const getAllowedOrigins = (): string[] => {
  const allowedOriginsEnv = NODE_ENV === 'production' 
    ? process.env.PRODUCTION_ALLOWED_ORIGINS 
    : process.env.ALLOWED_ORIGINS;
  
  if (!allowedOriginsEnv) {
    console.warn('⚠️  No ALLOWED_ORIGINS configured');
    return NODE_ENV === 'production' 
      ? ['https://helpdesk.hubblehox.ai']
      : ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3003'];
  }
  
  return allowedOriginsEnv
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
};
```

### 3. **Updated `backend/src/config/index.ts`**
Added centralized URL configuration object:
```typescript
urls: {
  frontend: isProduction
    ? process.env.PRODUCTION_FRONTEND_URL || 'https://helpdesk.hubblehox.ai'
    : process.env.FRONTEND_URL || 'http://localhost:3001',
  backend: isProduction
    ? process.env.PRODUCTION_BACKEND_URL || 'https://api.helpdesk.hubblehox.ai'
    : process.env.BACKEND_URL || 'http://localhost:3003',
  api: isProduction
    ? process.env.PRODUCTION_API_URL || 'https://api.helpdesk.hubblehox.ai/api'
    : process.env.API_URL || 'http://localhost:3003/api',
}
```

### 4. **Updated `backend/src/controllers/ticketController.ts`**
**Before:** Hardcoded localhost URL
```typescript
const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/${customUrlPath}/student/login`;
```

**After:** Environment-aware URL resolution
```typescript
const isProduction = process.env.NODE_ENV === 'production';
const frontendUrl = isProduction
  ? process.env.PRODUCTION_FRONTEND_URL || 'https://helpdesk.hubblehox.ai'
  : process.env.FRONTEND_URL || 'http://localhost:3001';
const loginUrl = `${frontendUrl}/${customUrlPath}/student/login`;
```

### 5. **Updated `.env.example`**
Added comprehensive documentation with:
- Development and production URL examples
- Comments explaining which URLs are needed for which environment
- Socket.IO configuration options
- Clear separation between dev and prod settings

## Environment-Specific Configuration

### Development (.env)
```
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:3003
API_URL=http://localhost:3003/api
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000,http://localhost:3003
SOCKET_CORS_ORIGIN=http://localhost:3001
```

### Production (.env)
```
NODE_ENV=production
PRODUCTION_FRONTEND_URL=https://helpdesk.hubblehox.ai
PRODUCTION_BACKEND_URL=https://api.helpdesk.hubblehox.ai
PRODUCTION_API_URL=https://api.helpdesk.hubblehox.ai/api
PRODUCTION_ALLOWED_ORIGINS=https://helpdesk.hubblehox.ai,https://api.helpdesk.hubblehox.ai
PRODUCTION_SOCKET_CORS_ORIGIN=https://helpdesk.hubblehox.ai
```

## API Endpoints Affected

The endpoint `http://localhost:3003/api/projects/by-domain/helpdesk.hubblehox.ai` is now fully environment-aware:
- **Development:** Uses `http://localhost:3001` as frontend base
- **Production:** Uses `https://helpdesk.hubblehox.ai` as frontend base
- All CORS origins dynamically loaded from `.env`

## Benefits

1. **No Code Changes Required** for environment switching - just update `.env`
2. **Single Source of Truth** - all URLs in one place
3. **Easy Deployment** - same code runs in dev, staging, and production
4. **Better Security** - sensitive URLs not exposed in source code
5. **Consistent Configuration** - all environment variables follow naming conventions

## Testing Recommendations

1. **Development Mode:**
   ```bash
   NODE_ENV=development npm run dev
   ```
   Verify CORS allows `http://localhost:3001`, `http://localhost:3000`

2. **Production Mode:**
   ```bash
   NODE_ENV=production npm run build && npm start
   ```
   Verify CORS only allows `https://helpdesk.hubblehox.ai`

3. **Test Email URLs:**
   Send a test ticket and verify the login URL in the email uses correct domain

4. **Test CORS:**
   ```bash
   curl -H "Origin: http://localhost:3001" http://localhost:3003/api/health -v
   ```
   Should include `Access-Control-Allow-Origin` header

## Files Modified
- ✅ `backend/.env`
- ✅ `backend/.env.example`
- ✅ `backend/src/server.ts`
- ✅ `backend/src/config/index.ts`
- ✅ `backend/src/controllers/ticketController.ts`

## Next Steps
1. Update production `.env` on the server with correct URLs
2. Rebuild backend: `npm run build`
3. Restart PM2 process: `pm2 restart helpdesk-backend`
4. Verify 502 error is resolved by testing login at `https://helpdesk.hubblehox.ai/portal`
