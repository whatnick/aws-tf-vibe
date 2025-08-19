# STAC API Lookup Application

A production-ready serverless web application for searching and visualizing STAC (SpatioTemporal Asset Catalog) granules with interactive mapping, satellite data summaries, and comprehensive test coverage.

## 🚀 Live Production Application

**Frontend**: https://dbux6pkgkyhnp.cloudfront.net  
**API**: https://0ff8jxqrd9.execute-api.us-west-2.amazonaws.com/prod  
**Repository**: https://github.com/whatnick/aws-tf-vibe

## ✨ Current Features

### Core Functionality
- **Interactive Mapping**: Leaflet-based map with drawing tools for area selection
- **Location Search**: Geocoding with polygon simplification (≤100 points)
- **Multi-Catalog Support**: AWS Earth Search and USGS Landsat catalogs
- **Satellite Data Summary**: Breakdown by Sentinel-2, Landsat, and other sources
- **Real-time Filtering**: Date range, cloud cover, and collection filters
- **Responsive Design**: Mobile-optimized with dynamic viewport sizing

### Technical Implementation
- **Serverless Architecture**: AWS Lambda + API Gateway + S3 + CloudFront
- **Modern Frontend**: React 18 + Material-UI + Vite build system
- **Comprehensive Testing**: 90% code coverage with Jest test suites
- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Security**: Pre-commit hooks, secrets detection, HTTPS enforcement

## 🏗️ Architecture

### Infrastructure (Terraform)
- **CloudFront Distribution**: Global CDN with HTTPS and custom error pages
- **S3 Bucket**: Static website hosting with OAI security
- **Lambda Function**: Node.js 18.x serverless API backend
- **API Gateway**: REST API with CORS and proxy integration
- **IAM Roles**: Least-privilege security model

### Application Stack
- **Frontend**: React + Material-UI + Leaflet + Axios
- **Backend**: Express.js + Turf.js + Axios
- **Testing**: Jest + React Testing Library + Supertest
- **Build**: Vite + Babel + ESLint

## 🧪 Quality Assurance

### Test Coverage (90% Minimum)
- **Frontend Tests**: Component rendering, user interactions, API integration
- **Backend Tests**: Route handlers, service layer, error handling
- **Mocked Dependencies**: Axios, Leaflet, external APIs
- **CI Integration**: Automated testing on all commits and PRs

### Security & Compliance
- **Secrets Detection**: Baseline scanning with detect-secrets
- **Pre-commit Hooks**: Automated linting and security checks
- **HTTPS Enforcement**: CloudFront redirects and secure headers
- **Access Control**: S3 OAI and IAM role-based permissions

## 📊 Current Status

✅ **Production Deployed**: Fully functional application live on AWS  
✅ **CI/CD Active**: Automated testing and deployment pipeline  
✅ **Test Coverage**: 90%+ coverage with comprehensive test suites  
✅ **Security Hardened**: Secrets detection and access controls  
✅ **Performance Optimized**: CloudFront CDN and responsive design  
✅ **Documentation Complete**: Comprehensive README and code comments

## 🔧 Local Development

Access the development server at http://localhost:5173

### Quick Start
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

## 🌍 Supported STAC Catalogs
- **AWS Earth Search**: `https://earth-search.aws.element84.com/v1`
- **USGS Landsat**: `https://landsatlook.usgs.gov/stac-server`

## 🎯 Key Features

### Interactive Map Component
- **Map Library**: Leaflet with react-leaflet
- **Drawing Tools**: Rectangle and polygon selection for AOI
- **Location Search**: Search locations by name with polygon visualization
- **Polygon Simplification**: Auto-simplifies complex polygons to 100 points max
- **Satellite Summary**: Visual breakdown of data sources with icons and counts

### Search & Filter Controls
- **STAC Catalog Selector**: Dropdown to select between supported catalogs
- **Collection Filter**: Dropdown populated from selected catalog's collections
- **Date Range**: Start/end date pickers for temporal filtering
- **Cloud Cover**: Slider (0-100%) for maximum cloud coverage
- **Real-time Results**: Live granule count with satellite source breakdown

## 🔌 API Endpoints
- `GET /api/catalogs` - List available STAC catalogs
- `GET /api/collections?catalog=<url>` - List collections from catalog
- `GET /api/geocode?q=<query>` - Search locations by name
- `POST /api/search` - Search STAC items with filters
- `POST /api/search/count` - Get matching item count
- `POST /api/search/summary` - Get satellite data summary

## 🏗️ Infrastructure Components

### Core AWS Resources
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

## 🚀 Deployment

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

## ⚙️ Configuration

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

## 🔄 CI/CD Pipeline

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

## 📁 Project Structure
```
stac-lookup-app/
├── .github/workflows/     # CI/CD pipelines
│   ├── deploy.yml         # Production deployment workflow
│   └── test.yml           # Testing and linting workflow
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # UI components (Map, Filters, Search)
│   │   ├── services/      # API clients and HTTP services
│   │   └── __tests__/     # Jest test suites (90% coverage)
│   ├── babel.config.js    # Babel configuration for testing
│   ├── jest.config.js     # Jest testing configuration
│   └── package.json       # Frontend dependencies and scripts
├── backend/               # Express API server (development)
│   ├── src/
│   │   ├── routes/        # API endpoints (STAC, geocoding)
│   │   ├── services/      # Business logic and external APIs
│   │   └── __tests__/     # Jest test suites (90% coverage)
│   ├── babel.config.js    # Babel configuration for ES6 modules
│   ├── jest.config.js     # Jest testing configuration
│   └── package.json       # Backend dependencies and scripts
├── lambda/                # AWS Lambda deployment (production)
│   ├── routes/            # API route handlers
│   │   └── stac.js        # STAC API endpoints with satellite summary
│   ├── __tests__/         # Lambda-specific test suites
│   │   └── index.test.js  # Express app and middleware tests
│   ├── index.js           # Lambda entry point with serverless-express
│   ├── jest.config.js     # Jest configuration with coverage
│   └── package.json       # Lambda runtime dependencies
├── terraform/             # Infrastructure as Code
│   ├── main.tf            # Core AWS resources (S3, CloudFront, Lambda)
│   ├── outputs.tf         # Infrastructure outputs (URLs, ARNs)
│   ├── variables.tf       # Configurable parameters
│   └── lambda.zip         # Packaged Lambda deployment artifact
└── docker/                # Container configuration (optional)
    └── Dockerfile         # Multi-stage build for local development
```