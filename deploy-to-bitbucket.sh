#!/bin/bash

# Quick deployment script for Bitbucket
# Run this script after setting up your Bitbucket repository

echo "🚀 SAC Helpdesk - Bitbucket Deployment Setup"
echo "=============================================="

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: SAC Helpdesk Application"
else
    echo "✅ Git repository already initialized"
fi

# Ask for Bitbucket repository URL
read -p "Enter your Bitbucket repository URL (e.g., https://bitbucket.org/username/sac-helpdesk.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Repository URL is required"
    exit 1
fi

# Add remote if not exists
if git remote | grep -q '^origin$'; then
    echo "📝 Updating origin remote..."
    git remote set-url origin "$REPO_URL"
else
    echo "📝 Adding origin remote..."
    git remote add origin "$REPO_URL"
fi

# Push to Bitbucket
echo "📤 Pushing to Bitbucket..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to Bitbucket successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to Bitbucket → Repository Settings → Pipelines"
echo "2. Enable Pipelines"
echo "3. Add the following Repository Variables:"
echo "   - SSH_USER: Your server SSH username"
echo "   - SSH_HOST: helpdesk.hubblehox.ai"
echo "   - SSH_PRIVATE_KEY: Your SSH private key"
echo "   - SSH_KNOWN_HOSTS: Output of 'ssh-keyscan helpdesk.hubblehox.ai'"
echo ""
echo "4. Review DEPLOYMENT.md for full deployment instructions"
echo ""
echo "🎉 Happy deploying!"
