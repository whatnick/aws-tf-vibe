#!/bin/bash
set -e

echo "🧪 Running test suite for STAC Lookup Application..."

# Start services if not running
echo "🚀 Starting Docker services..."
docker-compose up -d

# Wait for backend to be ready
echo "⏳ Waiting for backend..."
sleep 10

# Test backend
echo "📦 Testing backend..."
docker-compose exec -T backend npm test

# Test frontend (if running)
echo "🎨 Testing frontend..."
if docker-compose ps frontend | grep -q "Up"; then
  docker-compose exec -T frontend npm test
else
  echo "⚠️  Frontend not running, skipping tests"
fi

echo "✅ All tests completed!"