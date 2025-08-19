# STAC API Lookup Application

A web application for searching and visualizing STAC (SpatioTemporal Asset Catalog) data granules with an interactive map interface and location-based polygon search.

## Overview
Enables users to search and visualize STAC data granules over geographic areas using an interactive map interface, location search, and filtering controls with support for multiple STAC catalogs.

## Quick Start

```bash
# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Copy environment configuration
cp .env.example .env

# Start development servers
npm run dev
```

## Live Demo

**Production Application**: https://dbux6pkgkyhnp.cloudfront.net  
**API Endpoint**: https://0ff8jxqrd9.execute-api.us-west-2.amazonaws.com/prod

## Local Development

Access the application at http://localhost:5173

## Core Features

### Interactive Map Component
- **Map Library**: Leaflet with react-leaflet
- **Base Layers**: OpenStreetMap tiles
- **Drawing Tools**: Rectangle and polygon selection for area of interest (AOI)
- **Location Search**: Search locations by name with polygon visualization
- **Polygon Simplification**: Auto-simplifies complex polygons to 100 points max
- **Granule Visualization**: Display search results as colored overlays

### Search & Filter Controls
- **STAC Catalog Selector**: Dropdown to select between supported catalogs
- **Collection Filter**: Dropdown populated from selected catalog's collections
- **Date Range**: Start/end date pickers for temporal filtering
- **Cloud Cover**: Slider (0-100%) for maximum cloud coverage
- **Location Search**: Text input to search and select geographic areas by name

### Results Display
- **Real-time Granule Count**: Live counter showing number of matching items
- **Interactive Visualization**: Map overlays showing search area and results

## Supported STAC Catalogs
- **AWS Earth Search**: `https://earth-search.aws.element84.com/v1`
- **USGS Landsat**: `https://landsatlook.usgs.gov/stac-server`

## Technical Architecture

### Frontend Stack
- **Framework**: React 18+ with Vite
- **Map**: Leaflet with react-leaflet and drawing tools
- **UI Components**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Geocoding**: OpenStreetMap Nominatim integration

### Backend Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **STAC Integration**: Direct API calls with axios
- **Geocoding**: OpenStreetMap Nominatim API
- **Polygon Processing**: Turf.js for simplification

### API Endpoints
- `GET /api/catalogs` - List available STAC catalogs
- `GET /api/collections?catalog=<url>` - List collections from catalog
- `GET /api/geocode?q=<query>` - Search locations by name
- `POST /api/search` - Search STAC items with filters
- `POST /api/search/count` - Get matching item count

## User Interface Layout

```
┌─────────────────────────────────────────────────────────┐
│ Header: STAC Granule Lookup Tool                       │
├─────────────────┬───────────────────────────────────────┤
│ Filters Panel   │ Location Search: [Paris, France] [🔍] │
│                 │                                       │
│ □ STAC Catalog  │ [    Interactive Map with Polygon   ]│
│ □ Collection    │ [    Drawing Tools & Search Results ]│
│ □ Date Range    │                                       │
│ □ Cloud Cover   │                                       │
│                 │                                       │
│ [Clear Filters] │ Results: 1,234 granules found        │
└─────────────────┴───────────────────────────────────────┘
```

## Key Implementation Features

### Location Search & Polygon Processing
- **Geocoding**: OpenStreetMap Nominatim for location-to-polygon conversion
- **Simplification**: Turf.js reduces polygon complexity to ≤100 points
- **Visualization**: Red polygon overlay on map with auto-zoom
- **STAC Integration**: Simplified polygons used for catalog queries

### Multi-Catalog Support
- **Dynamic Collections**: Collections loaded based on selected catalog
- **Unified Interface**: Same UI works across different STAC endpoints
- **Error Handling**: Graceful fallbacks for catalog connectivity issues

### Performance Optimizations
- **Debounced Search**: 500ms delay on filter changes
- **Polygon Simplification**: Reduces API payload size
- **Efficient Rendering**: Optimized map updates and overlays

## Terraform Infrastructure Components

### Core Resources
- **S3 Bucket**: Static website hosting with versioning
- **CloudFront Distribution**: Global CDN with HTTPS and custom error pages
- **Origin Access Identity**: Secure S3 access from CloudFront only
- **Lambda Function**: Serverless API backend (Node.js 18.x)
- **API Gateway**: REST API with proxy integration and CORS
- **IAM Roles**: Lambda execution role with CloudWatch logging

### Security & Access
- **S3 Bucket Policy**: Restricts access to CloudFront OAI only
- **Public Access Block**: Prevents accidental public S3 access
- **Lambda Permissions**: API Gateway invoke permissions
- **HTTPS Enforcement**: CloudFront redirects HTTP to HTTPS

### Configuration
```hcl
# Key Terraform variables
variable "aws_region" {
  default = "us-west-2"
}
variable "project_name" {
  default = "stac-lookup"
}
```

### Outputs
- **frontend_url**: CloudFront distribution URL
- **api_url**: API Gateway endpoint URL  
- **s3_bucket**: S3 bucket name for deployments

## Deployment Options

### Serverless (AWS) - Currently Deployed
**Live Application**: https://dbux6pkgkyhnp.cloudfront.net

```bash
# Deploy to AWS Lambda + API Gateway + S3 + CloudFront
./deploy.sh

# Destroy resources
./destroy.sh
```

### Docker (Local)
```bash
docker build -f docker/Dockerfile -t stac-lookup .
docker run -p 3001:3001 stac-lookup
```

## Configuration

### Environment Variables
```bash
# Backend
PORT=3001
DEFAULT_STAC_ENDPOINT=https://earth-search.aws.element84.com/v1

# Frontend
VITE_API_URL=http://localhost:3001/api
VITE_MAP_DEFAULT_CENTER=[0,0]
VITE_MAP_DEFAULT_ZOOM=2
```

### GitHub Actions Secrets
For automated deployment, configure these repository secrets:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_SESSION_TOKEN=your_session_token (if using temporary credentials)
```

## CI/CD Pipeline

### Automated Workflows
- **Deploy**: Builds and deploys on push to master/main
- **Test**: Runs linting and security scans on all PRs
- **Security**: Detects secrets and runs code quality checks

### Deployment Process
1. Build React frontend and Lambda package
2. Deploy infrastructure with Terraform
3. Update frontend with API Gateway URL
4. Sync files to S3 and invalidate CloudFront
5. Output deployment URLs

### Project Structure
```
stac-lookup-app/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   └── services/      # API clients
├── backend/           # Express API server
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   └── services/      # Business logic
└── docker/            # Container configuration
```