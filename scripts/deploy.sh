#!/bin/bash
set -e

PROJECT_NAME="stac-lookup"
AWS_REGION="us-west-2"

echo "🚀 Deploying STAC Lookup Application..."

# Build frontend
echo "📦 Building frontend..."
cd ../frontend
npm ci
VITE_API_URL="https://API_GATEWAY_URL/prod/api" npm run build
cd ..

# Package Lambda
echo "📦 Packaging Lambda function..."
cd lambda
npm ci --production
zip -r ../terraform/lambda.zip . -x "*.git*" "node_modules/.cache/*"
cd ..

# Deploy infrastructure
echo "🏗️  Deploying infrastructure..."
cd terraform
terraform init
terraform plan -var="project_name=$PROJECT_NAME" -var="aws_region=$AWS_REGION"
terraform apply -var="project_name=$PROJECT_NAME" -var="aws_region=$AWS_REGION" -auto-approve

# Get outputs
API_URL=$(terraform output -raw api_url)
S3_BUCKET=$(terraform output -raw s3_bucket)
FRONTEND_URL=$(terraform output -raw frontend_url)

echo "🔄 Updating frontend with API URL..."
cd frontend
sed -i.bak "s|https://API_GATEWAY_URL/prod/api|$API_URL/api|g" dist/assets/*.js
rm -f dist/assets/*.js.bak

# Upload frontend to S3
echo "📤 Uploading frontend to S3..."
aws s3 sync dist/ s3://$S3_BUCKET --delete

echo "✅ Deployment complete!"
echo "🌐 Frontend URL: $FRONTEND_URL"
echo "🔗 API URL: $API_URL"