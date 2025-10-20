# Local Development Setup

## Overview
This project uses **real AWS services** for local development instead of dummy data:
- DynamoDB Local for database
- AWS Cognito (sandbox account) for authentication
- AWS AppSync (sandbox account) for GraphQL API
- AWS S3 (sandbox account) for file storage

## Prerequisites
- Docker and Docker Compose
- AWS CLI configured
- Node.js 18+ and pnpm

## Quick Start

### 1. Start DynamoDB Local
```bash
# Start DynamoDB Local and Admin UI
docker-compose up -d

# Create tables
./scripts/setup-local-dynamodb.sh
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.local.example apps/web/.env.local

# Update with your sandbox AWS credentials (already configured)
```

### 3. Run the App
```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

## Services

### DynamoDB Local
- **Endpoint**: http://localhost:8000
- **Admin UI**: http://localhost:8001
- **Data**: Stored in `./local-data/dynamodb/`

### AWS Services (Sandbox)
- **Cognito User Pool**: `eu-west-2_boO0PSf3X`
- **AppSync API**: `https://5m7pbhxsqffrvp5binqipcyu5e.appsync-api.eu-west-2.amazonaws.com/graphql`
- **S3 Bucket**: `social-app-sandbox-bucket`
- **Region**: `eu-west-2`

## Commands

```bash
# Start local services
docker-compose up -d

# Stop local services
docker-compose down

# View DynamoDB tables
aws dynamodb list-tables --endpoint-url http://localhost:8000

# Reset DynamoDB data
docker-compose down -v
rm -rf ./local-data/dynamodb
./scripts/setup-local-dynamodb.sh
```

## Testing Auth Flow

1. **Sign Up**: Visit http://localhost:4321/auth
2. **Verify Email**: Check your email for confirmation code
3. **Sign In**: Use your username and password
4. **Create Posts**: All data stored in DynamoDB Local

## No More Dummy Data! 🎉

All dummy/mock data has been removed. The app now uses:
- Real DynamoDB tables (local or sandbox)
- Real Cognito authentication
- Real AppSync GraphQL API
- Real S3 file uploads

This provides a production-like development experience!

