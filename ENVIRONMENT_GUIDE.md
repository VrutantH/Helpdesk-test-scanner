# 🔄 Environment Configuration Guide

## ✅ Current Setup: AUTOMATIC ENVIRONMENT DETECTION

Your application is now configured to **automatically detect** whether it's running locally or in production based on the hostname.

---

## 🎯 How It Works

### Frontend (Auto-Detection)
The frontend checks `window.location.hostname`:

| Access URL | Detected Hostname | API Used |
|------------|-------------------|----------|
| `http://localhost:3001` | `localhost` | `http://localhost:3003` |
| `http://127.0.0.1:3001` | `127.0.0.1` | `http://localhost:3003` |
| `https://helpdesk.hubblehox.ai` | `helpdesk.hubblehox.ai` | `https://helpdesk.hubblehox.ai` |

**Location:** `frontend/src/config/constants.ts`

### Backend (Environment-Based)
The backend uses `NODE_ENV` from `backend/.env`:

| NODE_ENV | Database | CORS Origins |
|----------|----------|--------------|
| `development` | MongoDB Local (`localhost:27017`) | `localhost:3001`, `localhost:3003` |
| `production` | MongoDB Production (`34.14.157.13:27017`) | `helpdesk.hubblehox.ai` |

---

## 🛠️ Quick Commands

### Check Current Environment
```powershell
.\check-environment.ps1
```

### Switch to Development (Local)
```powershell
.\switch-environment.ps1 development
```

### Switch to Production
```powershell
.\switch-environment.ps1 production
```

---

## 📋 Development Workflow

### 1. **Local Development** (Default)

```powershell
# Ensure you're in development mode
.\switch-environment.ps1 development

# Start backend
cd backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev

# Access at: http://localhost:3001
```

**What happens:**
- ✅ Frontend auto-detects `localhost` → uses `http://localhost:3003`
- ✅ Backend uses `NODE_ENV=development` → local MongoDB
- ✅ CORS allows `localhost:3001`

---

### 2. **Production Deployment**

```powershell
# Switch to production mode
.\switch-environment.ps1 production

# Build both frontend and backend
.\deploy-production.ps1

# Deploy to server (manual upload or CI/CD)
# On server:
# pm2 start ecosystem.config.js
```

**What happens:**
- ✅ Frontend auto-detects `helpdesk.hubblehox.ai` → uses `https://helpdesk.hubblehox.ai`
- ✅ Backend uses `NODE_ENV=production` → production MongoDB
- ✅ CORS allows `helpdesk.hubblehox.ai`

---

## 🔍 Testing Auto-Detection

### Test Localhost
1. Access: `http://localhost:3001`
2. Open browser console
3. Look for logs:
   ```
   🌐 Detected hostname: localhost
   🔗 Using API URL: http://localhost:3003
   📡 Using WebSocket URL: ws://localhost:3003
   ```
4. Check Network tab - all API calls should go to `localhost:3003`

### Test Production
1. Access: `https://helpdesk.hubblehox.ai`
2. Open browser console
3. Look for logs:
   ```
   🌐 Detected hostname: helpdesk.hubblehox.ai
   🔗 Using API URL: https://helpdesk.hubblehox.ai
   📡 Using WebSocket URL: wss://helpdesk.hubblehox.ai
   ```
4. Check Network tab - all API calls should go to `helpdesk.hubblehox.ai`

---

## ⚠️ Common Issues & Solutions

### Issue 1: "502 Bad Gateway" on localhost

**Cause:** Backend is not running or in production mode

**Solution:**
```powershell
# Check environment
.\check-environment.ps1

# Switch to development
.\switch-environment.ps1 development

# Restart backend
cd backend
npm run dev
```

---

### Issue 2: API calls going to wrong URL

**Cause:** Frontend `.env` has hardcoded URL

**Solution:**
```powershell
# Check if VITE_API_BASE_URL is uncommented in frontend/.env
# It should look like this (all commented):

# VITE_API_BASE_URL=https://helpdesk.hubblehox.ai
# VITE_API_BASE_URL=http://localhost:3003

# If it's uncommented, comment it out and restart frontend
```

---

### Issue 3: CORS errors

**Cause:** Backend `NODE_ENV` doesn't match your access method

**Solution:**
```powershell
# For local development
.\switch-environment.ps1 development

# For production
.\switch-environment.ps1 production

# Restart backend
cd backend
npm run dev  # or pm2 restart on server
```

---

## 📂 File Reference

### Configuration Files

| File | Purpose | Auto-Detects? |
|------|---------|---------------|
| `frontend/.env` | Frontend environment variables | ✅ Yes (if variables commented) |
| `backend/.env` | Backend environment variables | ❌ No (uses NODE_ENV) |
| `frontend/src/config/constants.ts` | Frontend URL auto-detection logic | ✅ Yes |
| `backend/src/server.ts` | Backend CORS and env logic | ❌ No (reads NODE_ENV) |

### Helper Scripts

| Script | Purpose |
|--------|---------|
| `check-environment.ps1` | Show current configuration |
| `switch-environment.ps1` | Switch between dev/prod |
| `deploy-production.ps1` | Build for production |
| `start-dev-servers.ps1` | Start both servers in dev mode |

---

## 🎓 Best Practices

### ✅ DO:
- Use `.\check-environment.ps1` before starting work
- Keep `.env` files out of Git (already in `.gitignore`)
- Use auto-detection (don't hardcode URLs)
- Switch to production mode only when deploying

### ❌ DON'T:
- Hardcode URLs in `.env` files (comment them out for auto-detection)
- Run `npm run dev` on production server
- Commit `.env` files to Git
- Use production MongoDB from localhost

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Run `.\switch-environment.ps1 production`
- [ ] Verify `backend/.env` has `NODE_ENV=production`
- [ ] Check JWT secrets are strong (not default values)
- [ ] Run `.\deploy-production.ps1` to build
- [ ] Upload `deploy-package/` to server
- [ ] On server: `npm ci --production` in backend folder
- [ ] On server: `pm2 start ecosystem.config.js`
- [ ] Test: Access `https://helpdesk.hubblehox.ai`
- [ ] Verify Network tab shows production URLs

---

## 📞 Quick Reference

```powershell
# Check what mode you're in
.\check-environment.ps1

# Switch to local development
.\switch-environment.ps1 development

# Switch to production
.\switch-environment.ps1 production

# Build for production
.\deploy-production.ps1

# Start dev servers
.\start-dev-servers.ps1
```

---

**Last Updated:** December 9, 2025
