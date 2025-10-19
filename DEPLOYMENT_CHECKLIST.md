# Deployment Checklist

## ✅ Current Status

### SAM Template ✅
- [x] DynamoDB table with proper schema
- [x] Step Functions workflow with AppSync integration
- [x] Lambda function for triggering workflows
- [x] SNS topic for event publishing
- [x] IAM permissions for AppSync GraphQL

### Amplify Schema ✅
- [x] GraphQL schema with @model directives
- [x] Authentication rules
- [x] Real-time subscriptions
- [x] Custom mutations for Step Functions

### Frontend Integration ✅
- [x] AppSync client with demo mode fallback
- [x] Real-time subscription service
- [x] Data service with mode detection
- [x] Environment variable configuration

## 🚀 Deployment Steps

### 1. Deploy Amplify Backend
```bash
# Initialize Amplify (if not done)
amplify init

# Deploy backend
amplify push
```

### 2. Deploy SAM Infrastructure
```bash
# Get AppSync API ID from Amplify
AMPLIFY_API_ID=$(aws appsync list-graphql-apis --query 'graphqlApis[?name==`social-app-prototype`].apiId' --output text)

# Deploy SAM stack
sam deploy --guided --parameter-overrides AppSyncApiId=$AMPLIFY_API_ID
```

### 3. Configure Environment Variables
```bash
# Get values from AWS
COGNITO_USER_POOL_ID=$(aws cognito-idp list-user-pools --max-items 1 --query 'UserPools[0].Id' --output text)
COGNITO_CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id $COGNITO_USER_POOL_ID --query 'UserPoolClients[0].ClientId' --output text)
APPSYNC_URL=$(aws appsync get-graphql-api --api-id $AMPLIFY_API_ID --query 'graphqlApi.uris.GRAPHQL' --output text)
S3_BUCKET=$(aws s3 ls | grep amplify | head -1 | awk '{print $3}')

# Update .env file
echo "PUBLIC_COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID" >> .env
echo "PUBLIC_COGNITO_USER_POOL_CLIENT_ID=$COGNITO_CLIENT_ID" >> .env
echo "PUBLIC_APPSYNC_URL=$APPSYNC_URL" >> .env
echo "PUBLIC_AWS_REGION=us-east-1" >> .env
echo "PUBLIC_S3_BUCKET=$S3_BUCKET" >> .env
```

### 4. Deploy Frontend
```bash
# Deploy to Amplify Hosting
amplify publish
```

## 🔧 Configuration Files Created

### amplify.yml
- Build configuration for Amplify Hosting
- Frontend build commands
- Artifact configuration

### amplify/backend.yml
- Backend build configuration
- Amplify CLI commands

## 🎯 Integration Points

### Step Functions → AppSync
- Publishes real-time events via GraphQL mutations
- Triggers frontend subscriptions
- Updates moderation status live

### Frontend → AppSync
- Subscribes to real-time events
- Receives live updates
- Handles moderation status changes

### Demo Mode → Production Mode
- Automatic detection based on environment variables
- Seamless transition
- No code changes required

## 🚨 Important Notes

1. **Deploy Amplify first** - SAM depends on AppSync API ID
2. **Update environment variables** - Frontend needs AWS service endpoints
3. **Test in demo mode first** - Verify functionality before production
4. **Monitor Step Functions** - Check CloudWatch logs for workflow execution

## 🔍 Verification

After deployment, verify:
- [ ] AppSync GraphQL API is accessible
- [ ] Cognito authentication works
- [ ] Step Functions workflow executes
- [ ] Real-time subscriptions receive events
- [ ] Frontend displays live updates
