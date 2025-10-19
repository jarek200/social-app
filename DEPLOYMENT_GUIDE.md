# Pre-Deployment Setup Guide

This guide will help you prepare your social app for AWS deployment by setting up the missing functionality locally.

## ✅ What's Been Implemented

### 1. Authentication Integration
- **Cognito Auth Service** (`src/services/auth.ts`)
- **Auth Form Component** (`src/components/AuthForm.tsx`)
- **JWT Token Handling** with Amplify
- **User Session Management**

### 2. File Upload System
- **S3 Upload Service** (`src/services/storage.ts`)
- **File Upload Component** (`src/components/FileUpload.tsx`)
- **Pre-signed URL Generation**
- **Progress Tracking & Error Handling**

### 3. Backend Connection
- **AppSync Client** (`src/services/appsyncClient.ts`)
- **GraphQL Operations** (queries, mutations, subscriptions)
- **Real-time Subscriptions**
- **Authentication Headers**

### 4. Database Operations
- **Data Service** (`src/services/dataService.ts`)
- **CRUD Operations** for posts, comments, likes
- **Real-time Updates**
- **Optimistic UI Updates**

### 5. Environment Configuration
- **Environment Variables** (`.env.example`, `.env.local`)
- **Amplify Configuration** (`src/config/amplify.ts`)
- **App Initialization** (`src/components/AppInitializer.tsx`)

## 🚀 Next Steps Before Deployment

### Step 1: Install Dependencies
```bash
cd /Users/jarekwyprzal/dev/social-app
pnpm install
```

### Step 2: Configure Environment Variables
1. Copy the example environment file:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

2. Fill in your AWS values in `apps/web/.env.local`:
   ```bash
   # After deploying Amplify backend, get these values:
   PUBLIC_APPSYNC_URL=https://your-api-id.appsync-api.us-east-1.amazonaws.com/graphql
   PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
   PUBLIC_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   PUBLIC_S3_BUCKET=your-social-app-bucket
   ```

### Step 3: Deploy Backend Infrastructure
1. **Deploy Amplify Backend**:
   ```bash
   # In your AWS Console, create Amplify app with:
   # - Authentication (Cognito)
   # - GraphQL API (AppSync)
   # - Storage (S3)
   # - Hosting
   ```

2. **Deploy SAM Stack**:
   ```bash
   cd infra/sam
   sam build --template-file template.yaml
   sam deploy --guided
   ```

3. **Get Output Values**:
   - Note the `SavePostStateMachineArn`
   - Note the `FeedEventsTopicArn`
   - Note the `DynamoTableName`

### Step 4: Configure Amplify Function
1. **Update Lambda Environment Variables**:
   ```bash
   # In AWS Console, update the SavePostWorkflowTrigger function:
   SAVE_POST_STATE_MACHINE_ARN=arn:aws:states:...
   FEED_TOPIC_ARN=arn:aws:sns:...
   APPSYNC_API_ID=your-api-id
   ```

### Step 5: Test Locally
```bash
# Start development server
pnpm dev

# Test authentication
# Test file upload
# Test post creation
# Test real-time updates
```

## 🔧 Key Features Now Available

### Authentication
- **Sign Up/Sign In** with Cognito
- **JWT Token Management**
- **Session Persistence**
- **Protected Routes**

### File Upload
- **Drag & Drop Interface**
- **Progress Tracking**
- **Error Handling**
- **S3 Integration**

### Real-time Features
- **Live Feed Updates**
- **Post Moderation**
- **Comment Notifications**
- **Like Updates**

### Data Management
- **Persistent Storage**
- **Optimistic Updates**
- **Error Recovery**
- **Real-time Sync**

## 🐛 Troubleshooting

### Common Issues

1. **"No authenticated user" errors**:
   - Check Cognito configuration
   - Verify environment variables
   - Ensure user is signed in

2. **"Upload failed" errors**:
   - Check S3 bucket permissions
   - Verify bucket name in env vars
   - Check CORS configuration

3. **"GraphQL errors"**:
   - Verify AppSync URL
   - Check authentication headers
   - Ensure schema matches

4. **"Subscription failed"**:
   - Check WebSocket connection
   - Verify auth mode
   - Check network connectivity

### Debug Mode
```bash
# Enable debug logging
export DEBUG=amplify:*
pnpm dev
```

## 📋 Deployment Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Amplify backend deployed
- [ ] SAM stack deployed
- [ ] Lambda environment variables set
- [ ] Local testing completed
- [ ] Authentication working
- [ ] File upload working
- [ ] Real-time features working
- [ ] Error handling tested

## 🎯 Ready for Production

Once all steps are completed, your app will have:
- ✅ Full authentication system
- ✅ File upload with S3
- ✅ Real-time backend connection
- ✅ Persistent data storage
- ✅ Error handling
- ✅ Production-ready architecture

You can now deploy to AWS with confidence!
