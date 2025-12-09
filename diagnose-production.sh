#!/bin/bash
# Diagnostic Script - Run this on production server to check status

echo "🔍 Production Server Diagnostic Report"
echo "======================================"
echo ""

echo "1️⃣  Current Git Branch and Commit:"
cd /home/ubuntu/helpdesk 2>/dev/null || cd /var/www/helpdesk 2>/dev/null || echo "❌ Project directory not found!"
git branch --show-current
git log --oneline -1
echo ""

echo "2️⃣  Backend .env Configuration:"
echo "NODE_ENV: $(grep NODE_ENV /var/www/helpdesk/backend/.env 2>/dev/null || grep NODE_ENV /home/ubuntu/helpdesk/backend/.env 2>/dev/null || echo 'NOT FOUND')"
echo ""

echo "3️⃣  PM2 Process Status:"
pm2 status || echo "❌ PM2 not running or not installed"
echo ""

echo "4️⃣  Backend Process Check:"
ps aux | grep node | grep -v grep || echo "❌ No Node processes running"
echo ""

echo "5️⃣  Port 3003 Status (Backend):"
sudo netstat -tlnp | grep :3003 || echo "❌ Nothing listening on port 3003"
echo ""

echo "6️⃣  Nginx Status:"
sudo systemctl status nginx --no-pager | head -5
echo ""

echo "7️⃣  Backend Health Check:"
curl -s http://localhost:3003/api/health || echo "❌ Backend not responding"
echo ""

echo "8️⃣  Recent Nginx Error Logs:"
sudo tail -20 /var/log/nginx/error.log
echo ""

echo "9️⃣  PM2 Logs (last 20 lines):"
pm2 logs helpdesk-backend --lines 20 --nostream || echo "❌ No PM2 logs available"
echo ""

echo "🔟  Deployed Frontend Files:"
ls -lah /var/www/helpdesk/frontend/ | head -10
echo ""

echo "======================================"
echo "✅ Diagnostic Complete"
