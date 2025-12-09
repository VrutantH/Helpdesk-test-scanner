# Deployment Audit Report
**Date:** November 25, 2025  
**Pipeline:** bitbucket-pipelines.yml (Original Version)

---

## ✅ DEPLOYMENT COMPATIBILITY AUDIT

### Pipeline Requirements Analysis

The `bitbucket-pipelines.yml` expects:
- **Node Version:** Node 18 (image: node:18)
- **Build Command:** `npm ci` → `npm run build`
- **Deploy Location:** `/var/www/helpdesk/backend/`
- **PM2 Process Name:** `helpdesk-backend`
- **Deployment Method:** rsync with SSH

---

## ⚠️ CRITICAL ISSUES FOUND

### 1. **Node Version Mismatch** - HIGH PRIORITY
- **Pipeline uses:** Node 18
- **Backend requires:** Node >=22.20.0 (package.json engines)
- **Server has:** Node v22.21.0
- **Impact:** Build will fail in pipeline
- **Fix Required:** Update engines in package.json OR update pipeline image

### 2. **Missing ecosystem.config.js in Deployment** - CRITICAL
- **Issue:** Pipeline only copies `dist/` and `package*.json`
- **Missing:** `ecosystem.config.js` (required by PM2)
- **Impact:** PM2 restart will fail - no config file
- **Fix Required:** Add ecosystem.config.js to rsync or create on server

### 3. **PM2 Startup Method Incompatibility** - HIGH PRIORITY
- **Pipeline command:** `pm2 restart helpdesk-backend`
- **Problem:** Restart requires process to already exist
- **First deployment:** Will fail (process doesn't exist yet)
- **Fix Required:** Use `pm2 startOrRestart` or `pm2 reload`

### 4. **Environment Variables Not Deployed** - CRITICAL
- **Issue:** `.env` file not in pipeline artifacts or rsync
- **Impact:** Backend will fail to start (missing MongoDB URI, JWT secrets)
- **Current:** Uses hardcoded values in ecosystem.config.js
- **Fix Required:** Either:
  - Use ecosystem.config.js env vars (current approach - OK)
  - OR deploy .env.production to server

---

## ✅ WHAT'S WORKING

### 1. Build Process
- ✅ TypeScript compilation configured correctly
- ✅ `npm run build` produces `dist/` directory
- ✅ All source files compile successfully

### 2. PM2 Configuration
- ✅ ecosystem.config.js exists with proper config
- ✅ Process name matches: `helpdesk-backend`
- ✅ All environment variables defined in config
- ✅ Fork mode (better than cluster for first deployment)

### 3. Directory Structure
- ✅ Source in `src/`
- ✅ Build output in `dist/`
- ✅ Entry point: `dist/server.js`

### 4. Dependencies
- ✅ All production dependencies in package.json
- ✅ `npm ci --production` will install correctly
- ✅ No missing peer dependencies

---

## 🔧 REQUIRED FIXES

### Fix 1: Node Version Alignment
**Option A - Update package.json (RECOMMENDED):**
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=10.0.0"
  }
}
```

**Option B - Update pipeline (if must use Node 22):**
```yaml
image: node:22
```

### Fix 2: Deploy ecosystem.config.js
**Add to pipeline rsync commands:**
```yaml
- rsync -avz ecosystem.config.js $SSH_USER@$SSH_HOST:/var/www/helpdesk/backend/
```

### Fix 3: PM2 Restart Command
**Change pipeline command to:**
```bash
pm2 startOrRestart ecosystem.config.js --update-env
```
OR
```bash
pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
```

### Fix 4: First-Time Deployment Setup
**On server (ONE TIME ONLY):**
```bash
# Create directory structure
sudo mkdir -p /var/www/helpdesk/backend/uploads
sudo chown -R ubuntu:ubuntu /var/www/helpdesk

# First PM2 startup
cd /var/www/helpdesk/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

---

## 📋 DEPLOYMENT CHECKLIST

### Before First Deployment:
- [ ] Fix Node version in package.json (18.0.0)
- [ ] Copy ecosystem.config.js to server manually
- [ ] Create /var/www/helpdesk directory structure
- [ ] Set proper ownership (ubuntu:ubuntu)
- [ ] Start PM2 process manually first time
- [ ] Save PM2 process list
- [ ] Setup PM2 startup script

### For Automated Deployments:
- [ ] Update rsync to include ecosystem.config.js
- [ ] Change PM2 command to `startOrRestart` or `reload`
- [ ] Verify SSH_USER and SSH_HOST variables in Bitbucket
- [ ] Verify SSH_KNOWN_HOSTS configured
- [ ] Test deployment on develop branch first

### Post-Deployment Verification:
- [ ] Check PM2 status: `pm2 status`
- [ ] Check PM2 logs: `pm2 logs helpdesk-backend --lines 50`
- [ ] Test health endpoint: `curl http://localhost:3003/api/health`
- [ ] Check nginx proxy: `curl http://localhost/api/health`
- [ ] Verify frontend can reach backend

---

## 🚨 IMMEDIATE ACTION REQUIRED

**Priority 1 - Node Version:**
Change package.json engines from Node 22 to Node 18

**Priority 2 - ecosystem.config.js:**
Either:
- Add to rsync in pipeline
- OR manually copy to server before deployment

**Priority 3 - PM2 Command:**
Change from `pm2 restart` to `pm2 reload` or `pm2 startOrRestart`

---

## 📝 RECOMMENDED DEPLOYMENT FLOW

### 1. Update Backend Package.json
```bash
# Change engines.node to ">=18.0.0"
```

### 2. Manual Server Setup (First Time)
```bash
ssh ubuntu@34.14.157.13
sudo mkdir -p /var/www/helpdesk/backend
sudo chown -R ubuntu:ubuntu /var/www/helpdesk
cd /var/www/helpdesk/backend
# Copy ecosystem.config.js manually or via git
```

### 3. Configure Bitbucket Variables
- SSH_USER = ubuntu
- SSH_HOST = 34.14.157.13
- SSH_KNOWN_HOSTS = (server fingerprint)

### 4. Run Deployment
- Push to `main` branch to trigger deployment
- Monitor pipeline logs
- Check PM2 status on server

---

## 🔍 SERVER CONFIGURATION NEEDED

### Nginx Configuration
```nginx
location /api {
    proxy_pass http://127.0.0.1:3003;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### MongoDB
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Database: `sac_helpdesk` should exist
- Connection: `mongodb://localhost:27017/sac_helpdesk`

### SSL Certificate
- Certificate exists at: `/etc/letsencrypt/live/helpdesk.hubblehox.ai/`
- Auto-renewal configured

---

## ✅ FINAL RECOMMENDATION

**Make these 3 changes to backend code:**

1. **package.json** - Change Node version to 18
2. **Add deployment script** - Create script to copy ecosystem.config.js
3. **PM2 startup** - Use reload instead of restart

**DO NOT modify bitbucket-pipelines.yml** (as requested)

All other configurations are correct and ready for deployment.
