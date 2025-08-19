#!/bin/bash

# Development setup script for STAC Lookup Application

set -e

echo "🚀 Setting up STAC Lookup Application for local development..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating local environment file..."
    cat > .env.local << EOF
# Local development environment variables
NODE_ENV=development
VITE_API_URL=http://localhost:3001/api
VITE_MAP_DEFAULT_CENTER=[0,0]
VITE_MAP_DEFAULT_ZOOM=2
DEFAULT_STAC_ENDPOINT=https://earth-search.aws.element84.com/v1
PORT=3001
DEBUG=stac-lookup:*
LOG_LEVEL=debug
EOF
fi

# Build and start services
echo "🏗️  Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend service is healthy"
else
    echo "❌ Backend service is not responding"
fi

if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend service is healthy"
else
    echo "❌ Frontend service is not responding"
fi

echo ""
echo "🎉 STAC Lookup Application is ready!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3001/api"
echo "💚 Health Check: http://localhost:3001/health"
echo ""
echo "📋 Useful commands:"
echo "  docker-compose logs -f          # View logs"
echo "  docker-compose down             # Stop services"
echo "  docker-compose restart          # Restart services"
echo "  docker-compose exec backend sh  # Access backend container"
echo "  docker-compose exec frontend sh # Access frontend container"
echo ""