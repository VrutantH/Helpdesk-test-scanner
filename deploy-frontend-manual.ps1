# Manual frontend deployment script
Write-Host "Connecting to server..." -ForegroundColor Cyan

ssh ubuntu@34.14.157.13 @"
set -e
echo "=== Checking current state ==="
ls -la /var/www/helpdesk/ || echo "/var/www/helpdesk doesn't exist"
file /var/www/helpdesk/frontend 2>/dev/null || echo "frontend doesn't exist"

echo ""
echo "=== Building frontend ==="
cd /home/ubuntu/helpdesk/frontend
git pull
npm run build

echo ""
echo "=== Deploying to nginx root ==="
# Remove if it's a file
sudo rm -f /var/www/helpdesk/frontend

# Create directory structure
sudo mkdir -p /var/www/helpdesk/frontend

# Copy files
sudo cp -r dist/* /var/www/helpdesk/frontend/

# Set permissions
sudo chown -R www-data:www-data /var/www/helpdesk/frontend
sudo chmod -R 755 /var/www/helpdesk/frontend

echo ""
echo "=== Verifying deployment ==="
ls -la /var/www/helpdesk/frontend/
cat /var/www/helpdesk/frontend/index.html | head -5

echo ""
echo "✅ Deployment complete!"
"@
