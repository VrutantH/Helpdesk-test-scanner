# VM Deployment Checklist

## Pre-Deployment (Local)
- [x] Fixed form-builder → fields-forms category
- [x] Optimized JWT tokens (codes instead of objects)
- [x] Updated permission middleware
- [x] Added multi-origin CORS support
- [x] Created .env.example
- [x] Build successful locally
- [ ] Code committed to git
- [ ] Code pushed to repository

## Deployment Commands

### Step 1: Push Code
```bash
git add .
git commit -m "Fix: Multi-origin CORS + form-builder category + JWT optimization"
git push origin main
```

### Step 2: SSH to VM
```bash
ssh ubuntu@your-vm-ip
```

### Step 3: Configure Environment
```bash
cd ~/helpdesk/backend
nano .env
```

**Required .env variables:**
```
NODE_ENV=production
PORT=3003
FRONTEND_URL=https://helpdesk.hubblehox.ai
MONGODB_URI=mongodb://localhost:27017/sac_helpdesk
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Step 4: Deploy
```bash
cd ~/helpdesk/backend
git pull origin main
npm install
npm run build
pm2 restart Backend
pm2 logs Backend --lines 30
```

## Post-Deployment Verification

### Check 1: Server Started
```bash
pm2 status
# Backend should show "online"
```

### Check 2: Logs Clean
```bash
pm2 logs Backend --lines 50
# Look for:
# ✅ 128 permissions seeded successfully
# ✅ 6 roles seeded successfully
# ✅ Database initialization complete
# 🚀 Server running on port 3003
```

### Check 3: CORS Working
```bash
# From browser console on https://helpdesk.hubblehox.ai
fetch('http://your-backend-url/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
// Should NOT get CORS error (may get 401 - that's OK)
```

### Check 4: Users Can Login
- [ ] Navigate to https://helpdesk.hubblehox.ai/login
- [ ] Clear browser localStorage (F12 → Console → `localStorage.clear()`)
- [ ] Login with valid credentials
- [ ] JWT token should be ~1-2KB (not 10KB+)
- [ ] No 403 or 431 errors

## Rollback Plan

If issues occur:

```bash
cd ~/helpdesk/backend
git log --oneline -5  # Find previous commit
git checkout <previous-commit-hash>
npm run build
pm2 restart Backend
```

## Common Issues

### Issue: CORS Still Blocked
**Solution:** Check .env file has correct FRONTEND_URL
```bash
cat ~/helpdesk/backend/.env | grep FRONTEND_URL
# Should show: FRONTEND_URL=https://helpdesk.hubblehox.ai
```

### Issue: Permission Validation Error
**Solution:** Check logs for specific permission with invalid category
```bash
pm2 logs Backend | grep "validation failed"
```

### Issue: 403 Forbidden
**Solution:** Users need to clear localStorage and login again
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### Issue: 431 Header Too Large
**Solution:** User has old JWT token - clear and re-login
```javascript
localStorage.removeItem('authToken');
location.href = '/login';
```

## Success Criteria

✅ No CORS errors in browser console  
✅ Users can login successfully  
✅ All API endpoints respond (no 403/431 errors)  
✅ PM2 logs show clean startup  
✅ Permissions seeded successfully  
✅ JWT tokens are 1-2KB in size  

## Support

If issues persist:
1. Check PM2 logs: `pm2 logs Backend --lines 100`
2. Check MongoDB status: `sudo systemctl status mongod`
3. Check .env configuration
4. Verify git pull completed: `git log -1`
5. Review VM_DEPLOYMENT_FIX.md for detailed troubleshooting
