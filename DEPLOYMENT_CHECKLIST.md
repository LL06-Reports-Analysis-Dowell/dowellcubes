# 🚀 Deployment Checklist for Server: 82.29.161.195

## Pre-Deployment Setup

### 1. Server Preparation
- [ ] SSH into your server: `ssh root@82.29.161.195`
- [ ] Update system packages: `sudo apt update && sudo apt upgrade -y`
- [ ] Install Docker: `curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh`
- [ ] Install Docker Compose: `sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose`
- [ ] Add user to docker group: `sudo usermod -aG docker $USER`
- [ ] Logout and login again for group changes to take effect

### 2. Project Setup
- [ ] Create project directory: `mkdir -p /opt/dowellcubes && cd /opt/dowellcubes`
- [ ] Clone your repository: `git clone <YOUR_REPOSITORY_URL> .`
- [ ] Copy the updated files:
  - `nginx/nginx.conf` (updated for new IP)
  - `docker-compose.prod.yml` (removed SSL references)

### 3. Environment Configuration
- [ ] **Option A: Use automated script (Recommended)**
  ```bash
  ./generate-env.sh
  ```
- [ ] **Option B: Manual creation**
  ```bash
  cp .env.production.template .env.production
  # Then edit .env.production with your actual values
  ```

### 4. Security Setup
- [ ] Generate secure passwords for:
  - `REDIS_PASSWORD`
  - `ACCESS_TOKEN_SECRET`
  - `REFRESH_TOKEN_SECRET`
- [ ] Update `.env.production` with actual values
- [ ] Ensure `.env.production` is not committed to git (check `.gitignore`)

## Deployment Steps

### 5. Build and Deploy
- [ ] Navigate to project directory: `cd /opt/dowellcubes`
- [ ] Build and start services: `docker-compose -f docker-compose.prod.yml up -d --build`
- [ ] Check if all containers are running: `docker-compose -f docker-compose.prod.yml ps`
- [ ] Check logs for any errors: `docker-compose -f docker-compose.prod.yml logs -f`

### 6. Verification
- [ ] Test frontend: `curl http://82.29.161.195`
- [ ] Test backend API: `curl http://82.29.161.195/api/health` (or similar endpoint)
- [ ] Check if all services are accessible:
  - Frontend: http://82.29.161.195
  - Backend API: http://82.29.161.195/api
  - MongoDB: localhost:27017 (if needed externally)

## Post-Deployment

### 7. Monitoring and Maintenance
- [ ] Set up log monitoring: `docker-compose -f docker-compose.prod.yml logs -f`
- [ ] Check resource usage: `docker stats`
- [ ] Set up automatic restarts (already configured in docker-compose)
- [ ] Consider setting up a process manager like PM2 or systemd for the host

### 8. SSL/HTTPS Setup (Optional)
- [ ] Install Certbot: `sudo apt install certbot`
- [ ] Generate SSL certificate: `sudo certbot certonly --standalone -d your-domain.com`
- [ ] Update nginx.conf with SSL configuration
- [ ] Update docker-compose.prod.yml to include SSL volumes
- [ ] Restart nginx container

### 9. Backup Strategy
- [ ] Set up database backups: `docker exec mongo_container mongodump --out /backup`
- [ ] Set up automated backup scripts
- [ ] Test backup restoration process

## Troubleshooting

### Common Issues
- [ ] Port conflicts: Check if ports 80, 5000, 5173, 27017, 6379 are available
- [ ] Permission issues: Ensure docker group membership
- [ ] Memory issues: Check available RAM and swap
- [ ] Disk space: Ensure sufficient disk space for containers and data

### Useful Commands
```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f [service_name]

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Remove all containers and volumes (clean slate)
docker-compose -f docker-compose.prod.yml down -v
docker system prune -a
```

## Success Criteria
- [ ] Frontend accessible at http://82.29.161.195
- [ ] Backend API responding at http://82.29.161.195/api
- [ ] All containers running without errors
- [ ] Database connection established
- [ ] Redis connection working
- [ ] Application functionality tested 