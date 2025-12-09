#!/bin/bash
# Production Deployment Script
# Run this on your production server (34.14.157.13)

set -e  # Exit on any error

echo "🚀 Starting Production Deployment..."
echo "=================================="

# Navigate to project directory
cd /home/ubuntu/helpdesk

echo ""
echo "📥 Step 1: Pulling latest code from Bitbucket (main branch)..."
git fetch origin main
git checkout main
git reset --hard origin/main
git pull origin main

echo ""
echo "🔧 Step 2: Setting up Backend..."
cd backend

# Ensure .env has NODE_ENV=production
if grep -q "NODE_ENV=development" .env; then
    echo "⚠️  Updating NODE_ENV to production..."
    sed -i 's/NODE_ENV=development/NODE_ENV=production/' .env
fi

# Verify NODE_ENV
echo "✅ NODE_ENV is: $(grep NODE_ENV .env)"

# Install dependencies and build
echo "📦 Installing backend dependencies..."
npm ci

echo "🔨 Building backend..."
npm run build

echo ""
echo "🔧 Step 3: Setting up Frontend..."
cd ../frontend

# Install dependencies and build
echo "📦 Installing frontend dependencies..."
npm ci

echo "🔨 Building frontend..."
npm run build

echo ""
echo "📂 Step 4: Deploying frontend to /var/www/helpdesk/frontend..."
sudo rm -rf /var/www/helpdesk/frontend/*
sudo cp -r dist/* /var/www/helpdesk/frontend/
sudo chown -R www-data:www-data /var/www/helpdesk/frontend
sudo chmod -R 755 /var/www/helpdesk/frontend

echo ""
echo "📂 Step 5: Copying backend to /var/www/helpdesk/backend..."
cd ../backend
sudo mkdir -p /var/www/helpdesk/backend
sudo cp -r dist node_modules package.json .env /var/www/helpdesk/backend/
sudo chown -R ubuntu:ubuntu /var/www/helpdesk/backend

echo ""
echo "🔄 Step 6: Restarting services..."
cd /var/www/helpdesk/backend

# Stop existing PM2 processes
pm2 stop all || true
pm2 delete all || true

# Start backend with PM2
echo "🚀 Starting backend with PM2..."
pm2 start /home/ubuntu/helpdesk/ecosystem.config.js

# Save PM2 configuration
pm2 save

# Reload nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "✅ Deployment Complete!"
echo "=================================="
echo ""
echo "📊 Service Status:"
pm2 status

echo ""
echo "🔍 Testing backend health..."
sleep 3
curl -f http://localhost:3003/api/health || echo "⚠️  Backend health check failed!"

echo ""
echo "🌐 Your application should now be live at:"
echo "   https://helpdesk.hubblehox.ai"
echo ""
echo "📝 To view logs:"
echo "   pm2 logs helpdesk-backend"
echo "   sudo tail -f /var/log/nginx/error.log"
