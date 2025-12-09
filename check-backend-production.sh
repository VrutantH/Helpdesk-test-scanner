#!/bin/bash
# Quick Production Fix - Run on production server
# This assumes code is already pulled, just need to ensure backend is running

echo "🔍 Checking Backend Status..."

# Check if backend is running
if pm2 list | grep -q "helpdesk-backend"; then
    echo "✅ Backend process exists in PM2"
    pm2 describe helpdesk-backend
else
    echo "❌ Backend NOT in PM2!"
fi

# Check if port 3003 is listening
if sudo netstat -tlnp | grep -q ":3003"; then
    echo "✅ Port 3003 is listening"
    sudo netstat -tlnp | grep :3003
else
    echo "❌ Port 3003 NOT listening!"
fi

# Test backend health
echo ""
echo "🔍 Testing backend health..."
curl -v http://localhost:3003/api/health 2>&1 || echo "❌ Backend not responding"

# Check backend .env
echo ""
echo "🔍 Backend .env configuration:"
cat /var/www/helpdesk/backend/.env | grep NODE_ENV

# Show recent PM2 logs
echo ""
echo "📋 Recent PM2 logs:"
pm2 logs helpdesk-backend --lines 30 --nostream

echo ""
echo "🔧 To fix backend, run these commands:"
echo "cd /home/ubuntu/helpdesk/backend"
echo "npm run build"
echo "cd /var/www/helpdesk/backend"
echo "pm2 restart helpdesk-backend"
echo "pm2 logs helpdesk-backend"
