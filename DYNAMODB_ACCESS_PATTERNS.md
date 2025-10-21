# DynamoDB Single Table Design - Access Patterns

## 📊 **Table Structure**

### **Primary Table: `social-app-table`**
- **Partition Key (PK)**: String
- **Sort Key (SK)**: String
- **Billing Mode**: Pay-per-request

### **Global Secondary Index: GSI1**
- **Partition Key (GSI1PK)**: String
- **Sort Key (GSI1SK)**: String
- **Projection**: ALL

## 🗂️ **Entity Design**

### **Entity Types & Key Patterns**

#### **1. Posts**
```
PK: POST#{postId}
SK: POST
GSI1PK: FEED#{feedId}
GSI1SK: POST#{createdAt}
```

#### **2. Comments**
```
PK: POST#{postId}
SK: COMMENT#{commentId}
GSI1PK: POST#{postId}
GSI1SK: COMMENT#{createdAt}
```

#### **3. Likes**
```
PK: POST#{postId}
SK: LIKE#{userId}
GSI1PK: USER#{userId}
GSI1SK: LIKE#{createdAt}
```

#### **4. Users**
```
PK: USER#{userId}
SK: PROFILE
GSI1PK: USER#{userId}
GSI1SK: PROFILE
```

#### **5. User Posts (Owner-based)**
```
PK: USER#{userId}
SK: POST#{postId}
GSI1PK: USER#{userId}
GSI1SK: POST#{createdAt}
```

## 🔍 **Access Patterns**

### **1. Feed Operations**

#### **Get Feed Posts (Chronological)**
```typescript
// Query GSI1
{
  TableName: "social-app-table",
  IndexName: "GSI1",
  KeyConditionExpression: "GSI1PK = :feedId",
  ExpressionAttributeValues: {
    ":feedId": "FEED#GLOBAL"
  },
  ScanIndexForward: false, // Newest first
  Limit: 20
}
```

#### **Get Feed Posts by Status**
```typescript
// Query GSI1 with filter
{
  TableName: "social-app-table",
  IndexName: "GSI1",
  KeyConditionExpression: "GSI1PK = :feedId",
  FilterExpression: "ModerationStatus = :status",
  ExpressionAttributeValues: {
    ":feedId": "FEED#GLOBAL",
    ":status": "APPROVED"
  },
  ScanIndexForward: false
}
```

### **2. Post Operations**

#### **Get Single Post**
```typescript
// Get item
{
  TableName: "social-app-table",
  Key: {
    PK: "POST#post-123",
    SK: "POST"
  }
}
```

#### **Get Post with Comments**
```typescript
// Query all items for a post
{
  TableName: "social-app-table",
  KeyConditionExpression: "PK = :postId",
  ExpressionAttributeValues: {
    ":postId": "POST#post-123"
  }
}
```

#### **Get Post Comments Only**
```typescript
// Query comments for a post
{
  TableName: "social-app-table",
  KeyConditionExpression: "PK = :postId AND begins_with(SK, :commentPrefix)",
  ExpressionAttributeValues: {
    ":postId": "POST#post-123",
    ":commentPrefix": "COMMENT#"
  },
  ScanIndexForward: false
}
```

### **3. User Operations**

#### **Get User Profile**
```typescript
// Get user profile
{
  TableName: "social-app-table",
  Key: {
    PK: "USER#user-123",
    SK: "PROFILE"
  }
}
```

#### **Get User's Posts**
```typescript
// Query user's posts
{
  TableName: "social-app-table",
  KeyConditionExpression: "PK = :userId AND begins_with(SK, :postPrefix)",
  ExpressionAttributeValues: {
    ":userId": "USER#user-123",
    ":postPrefix": "POST#"
  },
  ScanIndexForward: false
}
```

#### **Get User's Posts via GSI1**
```typescript
// Alternative: Query GSI1 for user's posts
{
  TableName: "social-app-table",
  IndexName: "GSI1",
  KeyConditionExpression: "GSI1PK = :userId",
  FilterExpression: "begins_with(GSI1SK, :postPrefix)",
  ExpressionAttributeValues: {
    ":userId": "USER#user-123",
    ":postPrefix": "POST#"
  },
  ScanIndexForward: false
}
```

### **4. Like Operations**

#### **Check if User Liked Post**
```typescript
// Check for like
{
  TableName: "social-app-table",
  Key: {
    PK: "POST#post-123",
    SK: "LIKE#user-123"
  }
}
```

#### **Get All Likes for Post**
```typescript
// Query all likes for a post
{
  TableName: "social-app-table",
  KeyConditionExpression: "PK = :postId AND begins_with(SK, :likePrefix)",
  ExpressionAttributeValues: {
    ":postId": "POST#post-123",
    ":likePrefix": "LIKE#"
  }
}
```

#### **Get User's Liked Posts**
```typescript
// Query GSI1 for user's likes
{
  TableName: "social-app-table",
  IndexName: "GSI1",
  KeyConditionExpression: "GSI1PK = :userId",
  FilterExpression: "begins_with(GSI1SK, :likePrefix)",
  ExpressionAttributeValues: {
    ":userId": "USER#user-123",
    ":likePrefix": "LIKE#"
  }
}
```

### **5. Moderation Operations**

#### **Get Pending Moderation Posts**
```typescript
// Query GSI1 for pending posts
{
  TableName: "social-app-table",
  IndexName: "GSI1",
  KeyConditionExpression: "GSI1PK = :feedId",
  FilterExpression: "ModerationStatus = :status",
  ExpressionAttributeValues: {
    ":feedId": "FEED#GLOBAL",
    ":status": "PENDING"
  },
  ScanIndexForward: false
}
```

#### **Update Post Moderation Status**
```typescript
// Update post status
{
  TableName: "social-app-table",
  Key: {
    PK: "POST#post-123",
    SK: "POST"
  },
  UpdateExpression: "SET ModerationStatus = :status, UpdatedAt = :updated",
  ExpressionAttributeValues: {
    ":status": "APPROVED",
    ":updated": "2024-01-01T00:00:00Z"
  }
}
```

### **6. Analytics Operations**

#### **Get Post Statistics**
```typescript
// Get post with counts
{
  TableName: "social-app-table",
  Key: {
    PK: "POST#post-123",
    SK: "POST"
  },
  ProjectionExpression: "Caption, LikeCount, CommentCount, CreatedAt"
}
```

#### **Get Popular Posts (by likes)**
```typescript
// Scan with filter and sort
{
  TableName: "social-app-table",
  FilterExpression: "begins_with(PK, :postPrefix) AND ModerationStatus = :status",
  ExpressionAttributeValues: {
    ":postPrefix": "POST#",
    ":status": "APPROVED"
  },
  ProjectionExpression: "PK, Caption, LikeCount, CommentCount, CreatedAt"
}
// Note: This requires application-level sorting by LikeCount
```

## 📈 **Query Performance**

### **Efficient Patterns**
- ✅ **Single Item Lookup**: `GetItem` on PK/SK
- ✅ **Feed Queries**: GSI1 with `FEED#GLOBAL`
- ✅ **User Posts**: Query on `USER#{userId}`
- ✅ **Post Comments**: Query on `POST#{postId}`

### **Optimization Considerations**
- ⚠️ **Popular Posts**: Requires scan + sort (consider separate hot posts table)
- ⚠️ **Search**: Requires scan with filters (consider OpenSearch)
- ⚠️ **Analytics**: Consider materialized views for complex aggregations

## 🔧 **Step Functions Integration**

### **Post Creation Workflow**
```json
{
  "PK": "POST#post-123",
  "SK": "POST",
  "GSI1PK": "FEED#GLOBAL",
  "GSI1SK": "POST#2024-01-01T00:00:00Z",
  "Caption": "Hello world!",
  "PhotoStorageKey": "posts/123.jpg",
  "PhotoUrl": "https://bucket.s3.amazonaws.com/posts/123.jpg",
  "OwnerId": "user-123",
  "ModerationStatus": "PENDING",
  "LikeCount": 0,
  "CommentCount": 0,
  "CreatedAt": "2024-01-01T00:00:00Z",
  "UpdatedAt": "2024-01-01T00:00:00Z"
}
```

### **Moderation Update**
```json
{
  "ModerationStatus": "APPROVED",
  "UpdatedAt": "2024-01-01T00:05:00Z"
}
```

## 🎯 **Best Practices**

### **Key Design Principles**
1. **Hierarchical Keys**: Use consistent prefixes
2. **GSI1 for Feed**: Enables chronological queries
3. **Composite Keys**: Include timestamps for sorting
4. **Denormalization**: Store counts for performance

### **Query Optimization**
1. **Use GSI1**: For feed and user-based queries
2. **Limit Results**: Always use `Limit` parameter
3. **Pagination**: Use `ExclusiveStartKey` for large result sets
4. **Projection**: Only fetch needed attributes

### **Data Modeling**
1. **Single Table**: All entities in one table
2. **Access Patterns**: Design keys around queries
3. **GSI Strategy**: Use GSI1 for alternative access patterns
4. **Hot Keys**: Distribute load across partitions

## 📊 **Example Queries**

### **Get Recent Feed Posts**
```typescript
const getFeedPosts = async (limit = 20) => {
  const params = {
    TableName: "social-app-table",
    IndexName: "GSI1",
    KeyConditionExpression: "GSI1PK = :feedId",
    FilterExpression: "ModerationStatus = :status",
    ExpressionAttributeValues: {
      ":feedId": "FEED#GLOBAL",
      ":status": "APPROVED"
    },
    ScanIndexForward: false,
    Limit: limit
  };
  
  return await dynamodb.query(params).promise();
};
```

### **Get User's Posts**
```typescript
const getUserPosts = async (userId, limit = 20) => {
  const params = {
    TableName: "social-app-table",
    KeyConditionExpression: "PK = :userId AND begins_with(SK, :postPrefix)",
    ExpressionAttributeValues: {
      ":userId": `USER#${userId}`,
      ":postPrefix": "POST#"
    },
    ScanIndexForward: false,
    Limit: limit
  };
  
  return await dynamodb.query(params).promise();
};
```

### **Toggle Like**
```typescript
const toggleLike = async (postId, userId) => {
  const likeKey = {
    PK: `POST#${postId}`,
    SK: `LIKE#${userId}`
  };
  
  // Check if like exists
  const existing = await dynamodb.getItem({
    TableName: "social-app-table",
    Key: likeKey
  }).promise();
  
  if (existing.Item) {
    // Remove like
    await dynamodb.deleteItem({
      TableName: "social-app-table",
      Key: likeKey
    }).promise();
    
    // Decrement count
    await dynamodb.updateItem({
      TableName: "social-app-table",
      Key: { PK: `POST#${postId}`, SK: "POST" },
      UpdateExpression: "SET LikeCount = LikeCount - :one",
      ExpressionAttributeValues: { ":one": 1 }
    }).promise();
  } else {
    // Add like
    await dynamodb.putItem({
      TableName: "social-app-table",
      Item: {
        ...likeKey,
        CreatedAt: new Date().toISOString()
      }
    }).promise();
    
    // Increment count
    await dynamodb.updateItem({
      TableName: "social-app-table",
      Key: { PK: `POST#${postId}`, SK: "POST" },
      UpdateExpression: "SET LikeCount = LikeCount + :one",
      ExpressionAttributeValues: { ":one": 1 }
    }).promise();
  }
};
```

This single table design efficiently supports all the social app's access patterns while maintaining good performance and cost optimization.

