#!/bin/bash

# =============================================================================
# Deployment Script for DowellCubes
# Server: 82.29.161.195
# =============================================================================

SERVER_IP="82.29.161.195"
SERVER_USER="root"
PROJECT_DIR="/opt/dowellcubes"

echo "🚀 Starting deployment to server: $SERVER_IP"
echo "=============================================="

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please run ./generate-env.sh first to create the environment files."
    exit 1
fi

echo "✅ Environment files found"

# Step 1: SSH into server and prepare environment
echo ""
echo "📦 Step 1: Preparing server environment..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
    echo "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    
    echo "Installing Docker if not present..."
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
    fi
    
    echo "Installing Docker Compose if not present..."
    if ! command -v docker-compose &> /dev/null; then
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    echo "Creating project directory..."
    sudo mkdir -p /opt/dowellcubes
    sudo chown $USER:$USER /opt/dowellcubes
EOF

# Step 2: Copy project files to server
echo ""
echo "📁 Step 2: Copying project files to server..."
rsync -avz --exclude='.git' --exclude='node_modules' --exclude='.DS_Store' ./ $SERVER_USER@$SERVER_IP:$PROJECT_DIR/

# Step 3: SSH into server and deploy
echo ""
echo "🔨 Step 3: Building and deploying application..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
    cd /opt/dowellcubes
    
    echo "Stopping any existing containers..."
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    echo "Removing old images..."
    docker system prune -f
    
    echo "Building and starting services..."
    docker-compose -f docker-compose.prod.yml up -d --build
    
    echo "Waiting for services to start..."
    sleep 30
    
    echo "Checking container status..."
    docker-compose -f docker-compose.prod.yml ps
    
    echo "Checking logs for any errors..."
    docker-compose -f docker-compose.prod.yml logs --tail=20
EOF

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "🌐 Your application should be available at:"
echo "   Frontend: http://$SERVER_IP:8080"
echo "   Backend API: http://$SERVER_IP:5000/api"
echo ""
echo "📊 To check logs and status:"
echo "   ssh $SERVER_USER@$SERVER_IP"
echo "   cd $PROJECT_DIR"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🔧 To restart services:"
echo "   docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose -f docker-compose.prod.yml down" 