# AppSync Integration Guide

## Overview

This project now includes full AWS AppSync integration with GraphQL API, real-time subscriptions, and authentication. The implementation supports both production (with AWS) and demo modes for development.

## Features Implemented

### 1. GraphQL API Client (`appsyncClient.ts`)
- **Mutations**: Create posts, comments, likes
- **Queries**: List feeds, get posts, fetch comments
- **Subscriptions**: Real-time feed events
- **Authentication**: Cognito User Pool integration

### 2. Real-time Subscriptions (`realtimeService.ts`)
- Live feed updates via GraphQL subscriptions
- Event handling for posts, likes, comments
- Connection management and error handling
- Demo mode simulation

### 3. Demo Mode (`demoService.ts`)
- Local data for development without AWS
- Simulated real-time events
- Full CRUD operations with local state

### 4. Data Service (`dataService.ts`)
- Unified interface for demo and production modes
- Automatic mode detection
- Optimistic updates and error handling

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# AWS Configuration
PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
PUBLIC_COGNITO_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
PUBLIC_APPSYNC_URL=https://xxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql
PUBLIC_AWS_REGION=us-east-1
PUBLIC_S3_BUCKET=your-social-app-bucket

# Demo Mode (optional)
PUBLIC_DEMO_MODE=true
```

### Mode Detection

The app automatically detects the mode:
- **Demo Mode**: When `PUBLIC_DEMO_MODE=true` or AWS credentials are missing
- **Production Mode**: When AWS credentials are provided

## GraphQL Schema

The expected AppSync schema includes:

```graphql
type Post {
  id: ID!
  caption: String!
  photoUrl: String!
  moderationStatus: ModerationStatus!
  likeCount: Int!
  commentCount: Int!
  createdAt: AWSDateTime!
  owner: String!
  feedId: String!
}

type Comment {
  id: ID!
  postId: ID!
  owner: String!
  body: String!
  createdAt: AWSDateTime!
}

type Like {
  id: ID!
  postId: ID!
  owner: String!
  createdAt: AWSDateTime!
}

enum ModerationStatus {
  PENDING
  APPROVED
  REJECTED
}

# Mutations
type Mutation {
  createPost(input: CreatePostInput!): Post!
  createComment(input: CreateCommentInput!): Comment!
  createLike(input: CreateLikeInput!): Like!
  deleteLike(input: DeleteLikeInput!): Like!
}

# Queries
type Query {
  listPostsByFeed(feedId: ID!, sortDirection: ModelSortDirection, limit: Int): PostConnection!
  getPost(id: ID!): Post!
  listCommentsForPost(postId: ID!): CommentConnection!
  myProfile: User!
}

# Subscriptions
type Subscription {
  onFeedEvent(feedId: ID!): FeedEvent!
}

type FeedEvent {
  postId: ID!
  type: String!
  payload: AWSJSON!
  createdAt: AWSDateTime!
}
```

## Usage Examples

### Creating a Post
```typescript
import { createPost } from "@services/dataService";

const newPost = await createPost({
  caption: "Hello world!",
  photoStorageKey: "uploads/photo.jpg",
  photoUrl: "https://example.com/photo.jpg",
  feedId: "GLOBAL"
});
```

### Real-time Subscriptions
```typescript
import { realtimeOperations } from "@services/realtimeService";

// Connect to feed
realtimeOperations.connectToFeed("GLOBAL");

// Listen for events
window.addEventListener('feedEvent', (event) => {
  console.log('New feed event:', event.detail);
});
```

### Demo Mode
```typescript
import { demoOperations } from "@services/demoService";

// Create demo post
const post = await demoOperations.createPost({
  caption: "Demo post",
  photoUrl: "https://example.com/demo.jpg"
});

// Toggle like
await demoOperations.toggleLike(post.id);
```

## Components Updated

### RealtimeControls
- Shows connection status
- Displays recent real-time events
- Toggle connection on/off

### Data Service Integration
- Automatic mode switching
- Unified API for demo and production
- Error handling and loading states

## Development Workflow

1. **Start with Demo Mode**: App runs in demo mode by default
2. **Add AWS Credentials**: Set environment variables for production
3. **Test Real-time**: Use RealtimeControls to test subscriptions
4. **Deploy**: App automatically uses production mode when deployed

## Next Steps

1. Set up AWS AppSync with the provided schema
2. Configure Cognito User Pool
3. Set up S3 bucket for photo storage
4. Deploy and test with real AWS services

## Troubleshooting

### Common Issues

1. **"GraphQL client not configured"**: Missing AWS credentials or demo mode disabled
2. **"Subscription not configured"**: AppSync endpoint not accessible
3. **"No auth session available"**: Cognito not properly configured

### Debug Mode

Enable debug logging:
```typescript
// In browser console
localStorage.setItem('debug', 'appsync:*');
```

The integration provides a seamless development experience with automatic fallback to demo mode when AWS services are not available.
