#!/bin/bash

# =============================================================================
# Environment File Generator for DowellCubes
# Multi-Project Deployment (Port 8080)
# This script helps you create secure .env files for your deployment
# =============================================================================

echo "🔐 DowellCubes Environment File Generator (Multi-Project)"
echo "========================================================"

# Function to generate secure random string
generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Function to generate secure password
generate_password() {
    openssl rand -base64 16 | tr -d "=+/" | cut -c1-16
}

echo ""
echo "📝 Generating secure values..."

# Generate secure values
REDIS_PASSWORD=$(generate_password)
ACCESS_TOKEN_SECRET=$(generate_secret)
REFRESH_TOKEN_SECRET=$(generate_secret)

echo ""
echo "✅ Generated secure values:"
echo "   REDIS_PASSWORD: $REDIS_PASSWORD"
echo "   ACCESS_TOKEN_SECRET: $ACCESS_TOKEN_SECRET"
echo "   REFRESH_TOKEN_SECRET: $REFRESH_TOKEN_SECRET"

echo ""
echo "🌐 Creating .env.production file..."

# Create .env.production
cat > .env.production << EOF
# =============================================================================
# PRODUCTION ENVIRONMENT VARIABLES
# Server: 82.29.161.195
# Multi-Project Deployment (DowellCubes runs on port 8080)
# Generated on: $(date)
# =============================================================================

# =============================================================================
# ENVIRONMENT CONFIGURATION
# =============================================================================
ENV=production
PORT=5000

# =============================================================================
# SERVER URLs (Updated for multi-project deployment)
# =============================================================================
SERVER_URL=http://82.29.161.195:5000
FRONTEND_URL=http://82.29.161.195:8080

# =============================================================================
# DATABASE CONFIGURATION (Updated port)
# =============================================================================
DATABASE_URL=mongodb://dowellcubes_mongo_container:27017/dowellcubes

# =============================================================================
# REDIS CONFIGURATION (Updated port)
# =============================================================================
REDIS_HOST=dowellcubes_cache_container
REDIS_PORT=6379
REDIS_PASSWORD=$REDIS_PASSWORD

# =============================================================================
# JWT TOKEN CONFIGURATION
# =============================================================================
ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET=$REFRESH_TOKEN_SECRET

# =============================================================================
# API KEYS
# =============================================================================
DATACUBE_API_KEY=your_datacube_api_key_here

# =============================================================================
# FRONTEND CONFIGURATION (Vite Environment Variables)
# =============================================================================
VITE_SERVER_URL=http://82.29.161.195:5000/api
EOF

echo "✅ Created .env.production file"

echo ""
echo "🔧 Creating .env.development file..."

# Create .env.development
cat > .env.development << EOF
# =============================================================================
# DEVELOPMENT ENVIRONMENT VARIABLES
# Generated on: $(date)
# =============================================================================

# =============================================================================
# ENVIRONMENT CONFIGURATION
# =============================================================================
ENV=development
PORT=5000

# =============================================================================
# SERVER URLs
# =============================================================================
SERVER_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DATABASE_URL=mongodb://dowellcubes_mongo_container:27017/dowellcubes_dev

# =============================================================================
# REDIS CONFIGURATION
# =============================================================================
REDIS_HOST=dowellcubes_cache_container
REDIS_PORT=6379
REDIS_PASSWORD=dowellcubes_redis_dev_password

# =============================================================================
# JWT TOKEN CONFIGURATION
# =============================================================================
ACCESS_TOKEN_SECRET=dowellcubes_dev_access_token_secret
REFRESH_TOKEN_SECRET=dowellcubes_dev_refresh_token_secret

# =============================================================================
# API KEYS
# =============================================================================
DATACUBE_API_KEY=your_datacube_api_key_here

# =============================================================================
# FRONTEND CONFIGURATION (Vite Environment Variables)
# =============================================================================
VITE_SERVER_URL=http://localhost:5000/api
EOF

echo "✅ Created .env.development file"

echo ""
echo "🎉 Environment files created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Review the generated .env.production file"
echo "2. Update DATACUBE_API_KEY with your actual API key"
echo "3. Test the deployment with: docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "🌐 Multi-Project Deployment Info:"
echo "   - DowellCubes Frontend: http://82.29.161.195:8080"
echo "   - DowellCubes Backend: http://82.29.161.195:5000"
echo "   - Existing Project: http://82.29.161.195 (port 80)"
echo ""
echo "⚠️  IMPORTANT:"
echo "- Keep these .env files secure and never commit them to version control"
echo "- The generated secrets are unique and secure for this deployment"
echo "- Make sure to backup these files in a secure location"
echo "- Both projects can run simultaneously on the same server" 