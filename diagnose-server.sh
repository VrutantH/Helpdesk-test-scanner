#!/bin/bash
# Diagnostic script for helpdesk server

echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== Backend Health (direct) ==="
curl -v http://localhost:3003/api/health 2>&1 | grep -E "(HTTP|Connected|status)"

echo ""
echo "=== Nginx Proxy Test ==="
curl -v http://localhost/api/health 2>&1 | grep -E "(HTTP|Connected|502|upstream)"

echo ""
echo "=== Nginx Error Logs (last 10) ==="
sudo tail -10 /var/log/nginx/error.log

echo ""
echo "=== PM2 Logs (last 20) ==="
pm2 logs --lines 20 --nostream

echo ""
echo "=== Port 3003 Status ==="
sudo netstat -tlnp | grep 3003 || sudo ss -tlnp | grep 3003

echo ""
echo "=== Nginx Sites Enabled ==="
ls -la /etc/nginx/sites-enabled/

echo ""
echo "=== Checking nginx config for helpdesk ==="
sudo nginx -T 2>&1 | grep -A 20 "helpdesk.hubblehox.ai" | head -30
