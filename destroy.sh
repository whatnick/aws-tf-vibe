#!/bin/bash
set -e

PROJECT_NAME="stac-lookup"
AWS_REGION="us-west-2"

echo "🗑️  Destroying STAC Lookup Application..."

cd terraform

# Get S3 bucket name before destroying
S3_BUCKET=$(terraform output -raw s3_bucket 2>/dev/null || echo "")

if [ ! -z "$S3_BUCKET" ]; then
  echo "🧹 Emptying S3 bucket..."
  aws s3 rm s3://$S3_BUCKET --recursive || true
fi

echo "🏗️  Destroying infrastructure..."
terraform destroy -var="project_name=$PROJECT_NAME" -var="aws_region=$AWS_REGION" -auto-approve

echo "✅ Destruction complete!"