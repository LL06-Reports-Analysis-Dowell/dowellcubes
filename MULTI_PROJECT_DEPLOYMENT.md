# 🎯 Multi-Project Deployment Guide

## Overview
This guide explains how to run both **DowellCubes** and your **existing project** simultaneously on the same server (`82.29.161.195`).

## 🏗️ **Project Architecture**

### **Existing Project (SamantaScraper)**
- **Frontend**: `http://82.29.161.195` (Port 80)
- **Backend**: `http://82.29.161.195:3000` (or existing port)
- **Container Names**: `samantascraper_*`
- **Network**: `samantascraper_net`
- **Deployment Path**: `/home/SamantaScraper`

### **DowellCubes Project**
- **Frontend**: `http://82.29.161.195:8080` (Port 8080)
- **Backend**: `http://82.29.161.195:5000` (Port 5000)
- **MongoDB**: `http://82.29.161.195:27018` (Port 27018)
- **Redis**: `http://82.29.161.195:6380` (Port 6380)
- **Container Names**: `dowellcubes_*`
- **Network**: `dowellcubes_net`
- **Deployment Path**: `/opt/dowellcubes`

## 🔧 **Configuration Changes Made**

### 1. **Docker Compose Updates**
- ✅ **Container names** prefixed with `dowellcubes_`
- ✅ **Ports changed** to avoid conflicts:
  - Frontend: `5173` → `8080`
  - MongoDB: `27017` → `27018`
  - Redis: `6379` → `6380`
- ✅ **Network name** changed to `dowellcubes_net`
- ✅ **Volume names** prefixed with `dowellcubes_`

### 2. **Nginx Configuration**
- ✅ **Container references** updated to new names
- ✅ **Port configuration** updated for 8080

### 3. **Environment Variables**
- ✅ **URLs updated** for new ports
- ✅ **Container names** updated in database/Redis URLs

## 🚀 **Deployment Steps**

### **Step 1: Generate Environment Files**
```bash
# Generate new environment files with updated ports
./generate-env.sh
```

### **Step 2: Update API Key**
```bash
# Edit .env.production and update DATACUBE_API_KEY
nano .env.production
```

### **Step 3: Deploy to Server**
```bash
# Option A: Automated deployment
./deploy-to-server.sh

# Option B: Manual deployment
ssh root@82.29.161.195
cd /opt/dowellcubes
docker-compose -f docker-compose.prod.yml up -d --build
```

### **Step 4: Verify Deployment**
```bash
# Check if both projects are running
docker ps

# Test DowellCubes
curl http://82.29.161.195:8080
curl http://82.29.161.195:5000/api

# Test existing project
curl http://82.29.161.195
```

## 📊 **Monitoring & Management**

### **Check Project Status**
```bash
# DowellCubes containers
docker-compose -f /opt/dowellcubes/docker-compose.prod.yml ps

# All containers on server
docker ps

# DowellCubes logs
docker-compose -f /opt/dowellcubes/docker-compose.prod.yml logs -f
```

### **Restart Services**
```bash
# Restart DowellCubes only
cd /opt/dowellcubes
docker-compose -f docker-compose.prod.yml restart

# Restart existing project (if needed)
cd /home/SamantaScraper
docker-compose restart
```

### **Stop Services**
```bash
# Stop DowellCubes only
cd /opt/dowellcubes
docker-compose -f docker-compose.prod.yml down

# Stop existing project (if needed)
cd /home/SamantaScraper
docker-compose down
```

## 🔍 **Troubleshooting**

### **Port Conflicts**
If you get port conflicts:
```bash
# Check what's using the ports
netstat -tulpn | grep :8080
netstat -tulpn | grep :5000
netstat -tulpn | grep :27018
netstat -tulpn | grep :6380
```

### **Container Name Conflicts**
If containers with same names exist:
```bash
# Remove old containers
docker rm -f $(docker ps -aq --filter "name=dowellcubes_")

# Remove old images
docker rmi $(docker images -q --filter "reference=dowellcubes_*")
```

### **Network Conflicts**
If networks conflict:
```bash
# Remove old network
docker network rm dowellcubes_net

# Recreate network
docker network create dowellcubes_net
```

## 🌐 **Access URLs**

### **DowellCubes**
- **Frontend**: http://82.29.161.195:8080
- **Backend API**: http://82.29.161.195:5000/api
- **MongoDB**: localhost:27018 (if needed externally)
- **Redis**: localhost:6380 (if needed externally)

### **Existing Project**
- **Frontend**: http://82.29.161.195
- **Backend**: http://82.29.161.195:3000 (or existing port)

## 🔒 **Security Considerations**

1. **Separate Networks**: Each project has its own Docker network
2. **Isolated Containers**: Container names are prefixed to avoid conflicts
3. **Different Ports**: No port conflicts between projects
4. **Separate Volumes**: Data is isolated between projects

## 📝 **Maintenance**

### **Regular Updates**
```bash
# Update DowellCubes
cd /opt/dowellcubes
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build

# Update existing project (if needed)
cd /home/SamantaScraper
git pull origin main
docker-compose up -d --build
```

### **Backup Strategy**
```bash
# Backup DowellCubes data
docker exec dowellcubes_mongo_container mongodump --out /backup/dowellcubes_$(date +%Y%m%d)

# Backup existing project data (if needed)
docker exec samantascraper_mongo_container mongodump --out /backup/samantascraper_$(date +%Y%m%d)
```

## ✅ **Success Criteria**

- [ ] DowellCubes frontend accessible at http://82.29.161.195:8080
- [ ] DowellCubes backend responding at http://82.29.161.195:5000/api
- [ ] Existing project still accessible at http://82.29.161.195
- [ ] No port conflicts between projects
- [ ] Both projects running simultaneously
- [ ] All containers healthy and running 