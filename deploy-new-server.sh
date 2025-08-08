#!/bin/bash

# Deployment script for new server: 82.29.161.195
# Run this script on your new server

echo "🚀 Starting deployment to new server: 82.29.161.195"

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create project directory
echo "📁 Creating project directory..."
mkdir -p /opt/dowellcubes
cd /opt/dowellcubes

# Clone your repository (replace with your actual repo URL)
echo "📥 Cloning repository..."
git clone <YOUR_REPOSITORY_URL> .

# Create .env.production file
echo "⚙️ Creating .env.production file..."
cat > .env.production << EOF
# Environment
ENV=production
PORT=5000

# Server URLs
SERVER_URL=http://82.29.161.195:5000
FRONTEND_URL=http://82.29.161.195:5173

# Database
DATABASE_URL=mongodb://mongo_container:27017/dowellcubes

# Redis
REDIS_HOST=cache_container
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_here

# JWT Secrets (generate new ones for security)
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# API Keys
DATACUBE_API_KEY=your_datacube_api_key_here

# Frontend
VITE_SERVER_URL=http://82.29.161.195:5000/api
EOF

echo "✅ .env.production created. Please edit it with your actual values!"

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "🎉 Deployment completed!"
echo "🌐 Your application should be available at: http://82.29.161.195"
echo "📊 Check logs with: docker-compose -f docker-compose.prod.yml logs -f" 