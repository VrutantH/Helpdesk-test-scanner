#!/bin/bash
set -e

echo "=== Frontend Deployment Script ==="
echo "Building in /home/ubuntu/helpdesk/frontend"
cd /home/ubuntu/helpdesk/frontend
git pull origin dev
npm run build

echo ""
echo "Deploying to /var/www/helpdesk/frontend"
# Remove old files/directory
sudo rm -rf /var/www/helpdesk/frontend

# Create fresh directory
sudo mkdir -p /var/www/helpdesk/frontend

# Copy built files
sudo cp -r dist/* /var/www/helpdesk/frontend/

# Set correct permissions
sudo chown -R www-data:www-data /var/www/helpdesk/frontend
sudo chmod -R 755 /var/www/helpdesk/frontend

echo ""
echo "=== Deployment Complete ==="
ls -lh /var/www/helpdesk/frontend/
echo ""
echo "✅ Frontend deployed successfully!"
echo "Please hard refresh your browser (Ctrl+Shift+R)"
