#!/bin/bash
# dev-n8n Unix helper
set -e

cd "$(dirname "$0")/../n8n-docker"

# ensure symlink for custom nodes (use relative path)
if [ ! -L custom_nodes ]; then
  ln -s ../backend/src/n8n-workflows/nodes custom_nodes
fi

echo "Starting n8n stack with Docker Compose..."
docker-compose up -d

echo "Waiting 10 seconds for services to initialize..."
sleep 10

echo "Checking n8n health endpoint..."
if curl -f http://localhost:5678/healthz; then
  echo "n8n is healthy and ready."
else
  echo "n8n failed to start correctly. Displaying logs:"
  docker-compose logs n8n
fi

echo
echo "To start the backend, run the following commands:"
echo "  cd ../backend && npm install && npm run dev"
