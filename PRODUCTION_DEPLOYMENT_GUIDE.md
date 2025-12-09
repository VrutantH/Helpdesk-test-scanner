# 🚀 Production Deployment Guide - SAC Helpdesk

## ✅ Production Readiness Summary

### Fixed Issues
1. ✅ **Frontend .env** - Simplified to single file with production URLs
2. ✅ **Backend .env** - Set to NODE_ENV=production with proper configuration
3. ✅ **Vite HMR** - Fixed to work with production domain
4. ✅ **PM2 Configuration** - Updated to load from .env instead of hardcoded values
5. ✅ **JWT Secrets** - Updated with stronger values (MUST be changed before deployment)
6. ✅ **CORS Configuration** - Properly configured with production origins
7. ✅ **Database Connection** - Auto-selects production MongoDB based on NODE_ENV

---

## 🔧 Current Configuration Status

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=https://helpdesk.hubblehox.ai
VITE_WS_URL=wss://helpdesk.hubblehox.ai
```
✅ Ready for production

### Backend (`backend/.env`)
```env
NODE_ENV=production
PORT=3003
MONGODB_PRODUCTION_URI=mongodb://helpdesk-dev:hELpDEsK-DeV2025@34.14.157.13:27017/sac_helpdesk?authSource=admin
JWT_SECRET=SAC-Helpdesk-JWT-Secret-2025-CHANGE-THIS-IN-PRODUCTION-e8f9a0b1c2d3e4f5
ALLOWED_ORIGINS_PRODUCTION=https://helpdesk.hubblehox.ai,https://api.helpdesk.hubblehox.ai
```
⚠️ JWT secrets MUST be changed before deployment!

---

## 📋 Pre-Deployment Checklist

### Security (CRITICAL)
- [ ] **Change JWT_SECRET** to a cryptographically random 64+ character string
- [ ] **Change JWT_REFRESH_SECRET** to a different random string
- [ ] **Verify MongoDB credentials** are correct for production database
- [ ] **Review CORS allowed origins** - ensure only your domain is listed
- [ ] **Remove any debug console.log statements** from production code
- [ ] **Disable source maps** in production (optional for security)

### Environment Configuration
- [ ] `backend/.env` has `NODE_ENV=production`
- [ ] `frontend/.env` has production URLs (https://helpdesk.hubblehox.ai)
- [ ] All environment variables are set (no "undefined" values)
- [ ] Database connection string is correct and tested

### Build Configuration
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] Backend compiles successfully: `cd backend && npm run build`
- [ ] No TypeScript errors
- [ ] No security vulnerabilities (run `npm audit`)

### Server Infrastructure
- [ ] Server has Node.js >= 18.0.0 installed
- [ ] Server has npm >= 10.0.0 installed
- [ ] PM2 is installed globally: `npm install -g pm2`
- [ ] MongoDB is accessible from production server
- [ ] Firewall allows ports 3001 (frontend) and 3003 (backend)
- [ ] SSL certificates are installed (for HTTPS)
- [ ] Nginx is configured as reverse proxy (recommended)

---

## 🚀 Deployment Steps

### Step 1: Build the Application

Run the deployment script from the project root:

```powershell
.\deploy-production.ps1
```

This will:
- Build the backend (TypeScript → JavaScript in `backend/dist/`)
- Build the frontend (React → Static files in `frontend/dist/`)
- Create a `deploy-package/` folder with all necessary files

### Step 2: Transfer to Production Server

Copy the `deploy-package/` folder to your server:

```bash
# Using SCP (from your local machine)
scp -r deploy-package/ user@your-server:/var/www/helpdesk/

# Or using SFTP, FTP, or your preferred method
```

### Step 3: Server Setup

SSH into your production server:

```bash
ssh user@your-server
cd /var/www/helpdesk
```

Install backend dependencies (production only):

```bash
cd backend
npm ci --production
cd ..
```

**Note:** Frontend doesn't need `node_modules` in production - it's already built!

### Step 4: Configure Environment Variables

Create proper `.env` files:

**Backend `.env`:**
```bash
cd backend
cp .env.example .env
nano .env  # Edit with your values
```

Ensure these are set correctly:
```env
NODE_ENV=production
PORT=3003
MONGODB_PRODUCTION_URI=mongodb://your-user:your-password@your-mongodb-host:27017/sac_helpdesk?authSource=admin
JWT_SECRET=YOUR-SUPER-SECRET-RANDOM-STRING-HERE-64-CHARS-MIN
JWT_REFRESH_SECRET=YOUR-DIFFERENT-SUPER-SECRET-RANDOM-STRING-HERE
ALLOWED_ORIGINS_PRODUCTION=https://helpdesk.hubblehox.ai
```

**Frontend `.env`:**
```bash
cd ../frontend
cp .env.example .env
nano .env  # Edit with your values
```

```env
VITE_API_BASE_URL=https://helpdesk.hubblehox.ai
VITE_WS_URL=wss://helpdesk.hubblehox.ai
```

### Step 5: Start with PM2

From `/var/www/helpdesk`:

```bash
# Start both backend and frontend
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it outputs
```

### Step 6: Configure Nginx (Recommended)

Create nginx configuration `/etc/nginx/sites-available/helpdesk`:

```nginx
# Backend API Server
server {
    listen 80;
    server_name helpdesk.hubblehox.ai;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name helpdesk.hubblehox.ai;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/helpdesk.hubblehox.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/helpdesk.hubblehox.ai/privkey.pem;

    # Frontend (Serve static files)
    location / {
        root /var/www/helpdesk/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }

    # Backend API (Proxy to Node.js)
    location /api {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for long requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket Support
    location /socket.io {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # File uploads
    client_max_body_size 10M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/helpdesk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d helpdesk.hubblehox.ai
```

---

## 🔍 Verification Steps

### 1. Check Application Status

```bash
pm2 status
# Should show both processes as "online"

pm2 logs --lines 50
# Check for any errors
```

### 2. Test Backend API

```bash
curl http://localhost:3003/api/health
# Should return JSON response

curl https://helpdesk.hubblehox.ai/api/health
# Should return same response via nginx
```

### 3. Test Frontend

Open browser and navigate to:
- https://helpdesk.hubblehox.ai

Check browser console:
- ✅ No localhost URLs in Network tab
- ✅ API calls go to https://helpdesk.hubblehox.ai/api
- ✅ WebSocket connects to wss://helpdesk.hubblehox.ai
- ✅ No CORS errors

### 4. Test Database Connection

```bash
pm2 logs helpdesk-backend --lines 20 | grep MongoDB
# Should show: "✅ MongoDB Connected"
```

---

## 🛠️ Troubleshooting

### Issue: "localhost" appearing in Network tab

**Cause:** Running `npm run dev` instead of production build

**Fix:**
1. Stop dev server
2. Run `npm run build` in frontend
3. Serve built files from `frontend/dist/`

### Issue: CORS errors

**Cause:** `ALLOWED_ORIGINS_PRODUCTION` not set correctly

**Fix:**
```bash
# In backend/.env
ALLOWED_ORIGINS_PRODUCTION=https://helpdesk.hubblehox.ai
```
Then restart PM2: `pm2 restart helpdesk-backend`

### Issue: Database connection failed

**Cause:** MONGODB_PRODUCTION_URI incorrect or network issue

**Fix:**
1. Test connection manually:
   ```bash
   mongosh "mongodb://user:pass@host:27017/dbname?authSource=admin"
   ```
2. Verify firewall allows connection
3. Check MongoDB credentials

### Issue: 502 Bad Gateway (Nginx)

**Cause:** Backend not running or wrong port

**Fix:**
```bash
pm2 status
# Ensure helpdesk-backend is online

netstat -tulpn | grep 3003
# Ensure backend is listening on port 3003
```

---

## 📊 Monitoring

### PM2 Monitoring

```bash
# View logs in real-time
pm2 logs

# View specific app logs
pm2 logs helpdesk-backend
pm2 logs helpdesk-frontend

# Monitor resources
pm2 monit

# View app info
pm2 info helpdesk-backend
```

### Log Files

- Backend logs: `~/.pm2/logs/helpdesk-backend-*.log`
- Frontend logs: `~/.pm2/logs/helpdesk-frontend-*.log`
- Nginx access: `/var/log/nginx/access.log`
- Nginx errors: `/var/log/nginx/error.log`

---

## 🔄 Updating Production

When you need to deploy updates:

1. **Build locally:**
   ```powershell
   .\deploy-production.ps1
   ```

2. **Transfer updated files:**
   ```bash
   scp -r deploy-package/ user@server:/var/www/helpdesk-new/
   ```

3. **On server, backup old version:**
   ```bash
   mv /var/www/helpdesk /var/www/helpdesk-backup
   mv /var/www/helpdesk-new /var/www/helpdesk
   ```

4. **Restart PM2:**
   ```bash
   cd /var/www/helpdesk
   pm2 restart ecosystem.config.js
   ```

5. **Verify:**
   ```bash
   pm2 logs --lines 50
   curl https://helpdesk.hubblehox.ai/api/health
   ```

---

## ⚠️ Important Production Notes

### Critical: DO NOT Run Dev Server in Production!

**Problem:** Running `npm run dev` on production server causes:
- ❌ Tries to load from `node_modules/.vite/deps/`
- ❌ HMR websocket connects to localhost
- ❌ 504 Outdated Optimize Dep errors
- ❌ Massive security and performance issues

**Solution:** Always serve built files:
```bash
# Build first
cd frontend
npm run build

# Then serve the dist/ folder
npx serve dist -l 3001 -s
# OR use PM2 with the ecosystem.config.js
pm2 start ecosystem.config.js
```

### Do NOT:
- ❌ Run `npm run dev` on production server
- ❌ Use localhost URLs in production .env files
- ❌ Commit `.env` files to Git
- ❌ Use default/weak JWT secrets
- ❌ Expose MongoDB directly to internet
- ❌ Run Node.js directly (use PM2)

### DO:
- ✅ Use `npm run build` to create production builds
- ✅ Use PM2 to manage processes
- ✅ Use Nginx as reverse proxy
- ✅ Enable HTTPS/SSL
- ✅ Set strong random JWT secrets
- ✅ Monitor logs regularly
- ✅ Keep backups
- ✅ Run `npm audit` regularly

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables are set correctly
4. Test database connection separately
5. Check firewall settings

---

## 🔐 Security Recommendations

1. **Change all default secrets** before deploying
2. **Use strong passwords** for database
3. **Enable firewall** and only allow necessary ports
4. **Keep dependencies updated**: `npm audit fix`
5. **Use HTTPS only** - disable HTTP access
6. **Implement rate limiting** (already configured in backend)
7. **Regular backups** of database and uploads folder
8. **Monitor logs** for suspicious activity
9. **Use environment variables** never hardcode secrets
10. **Restrict file permissions** on .env files: `chmod 600 .env`

---

**Last Updated:** December 9, 2025
**Version:** 1.0.0
