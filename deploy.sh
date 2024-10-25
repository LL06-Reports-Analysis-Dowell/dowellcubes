#!/bin/bash

# Stop and remove all running containers
echo "Stopping all running containers..."
docker stop $(docker ps -q) 2>/dev/null || echo "No running containers to stop."

# Remove all containers
echo "Removing all containers..."
docker rm $(docker ps -a -q) 2>/dev/null || echo "No containers to remove."

# Remove all Docker images
echo "Removing all images..."
docker rmi $(docker images -q) 2>/dev/null || echo "No images to remove."

# Remove all volumes
echo "Removing all volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null || echo "No volumes to remove."

# Remove unused networks
echo "Removing unused networks..."
docker network prune -f || echo "No unused networks to remove."

# Start Docker Compose services
echo "Starting Docker Compose services..."
docker-compose --env-file .env.production -f docker-compose.prod.yml up -d --build

echo "All done!"
