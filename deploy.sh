#!/bin/bash

# Stop and remove all running containers
echo "Stopping all running containers..."
docker stop $(docker ps -aq)

echo "Removing all containers..."
docker rm $(docker ps -aq)

# Remove all Docker images
echo "Removing all images..."
docker rmi $(docker images -q)

# Remove all volumes
echo "Removing all volumes..."
docker volume rm $(docker volume ls -q)

# Clean up unused networks
echo "Removing unused networks..."
docker network prune -f

# Bring up the services using Docker Compose
echo "Starting Docker Compose services..."
docker-compose --env-file .env.production -f docker-compose.prod.yml up -d --build

echo "All done!"
