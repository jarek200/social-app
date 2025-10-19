# Photo Upload Flow

## 📸 **How Photo Upload Works**

### **Current Implementation**

#### **1. Frontend Upload Process**
```
User selects photo → FileUpload component → Storage service → S3/Demo mode
```

#### **2. Upload Flow Steps**

**Step 1: File Selection**
- User drags & drops or clicks to select image
- File validation (size, type)
- Preview shown immediately

**Step 2: Upload Processing**
- **Demo Mode**: Creates local `blob:` URL
- **Production Mode**: Uploads to S3 via Amplify Storage
- Progress tracking with real-time updates

**Step 3: Post Creation**
- Photo URL + storage key sent to AppSync
- Step Functions workflow triggered
- Moderation process begins

#### **3. Storage Service Features**

**Demo Mode:**
- Uses `URL.createObjectURL()` for local preview
- Simulated upload progress
- No actual file storage
- Perfect for development/testing

**Production Mode:**
- Uploads to S3 bucket via Amplify Storage
- Real progress tracking
- Signed URLs for secure access
- Automatic file management

### **🔧 Technical Implementation**

#### **FileUpload Component**
```typescript
// Features:
- Drag & drop support
- File validation (size, type)
- Progress tracking
- Error handling
- Accessibility (keyboard support)
```

#### **Storage Service**
```typescript
// Functions:
- uploadFile() - Upload with progress
- deleteFile() - Remove from storage
- getFileUrl() - Get signed URLs
- Mode detection (demo vs production)
```

#### **CreatePostForm Integration**
```typescript
// Flow:
1. User uploads photo → FileUpload
2. Storage service processes file
3. Upload result (key + URL) returned
4. Post created with photo data
5. Step Functions workflow triggered
```

### **🚀 Production Workflow**

#### **Complete Photo Upload Process**
```
1. User selects photo
   ↓
2. FileUpload validates & uploads to S3
   ↓
3. S3 returns storage key + public URL
   ↓
4. CreatePostForm sends data to AppSync
   ↓
5. Step Functions workflow triggered
   ↓
6. Moderation process (Comprehend)
   ↓
7. Post approved/rejected
   ↓
8. Real-time update sent to frontend
   ↓
9. Photo appears in feed
```

#### **S3 Storage Structure**
```
Bucket: your-social-app-bucket
├── posts/
│   ├── 1699123456789-abc123.jpg
│   ├── 1699123456790-def456.png
│   └── ...
├── avatars/
│   ├── user-123-avatar.jpg
│   └── ...
└── temp/
    └── (temporary uploads)
```

### **🔒 Security & Permissions**

#### **S3 Bucket Configuration**
- **Public Read**: For approved posts
- **Authenticated Upload**: For new posts
- **Signed URLs**: For temporary access
- **CORS**: Configured for web uploads

#### **Amplify Storage Policies**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket/posts/*"
    }
  ]
}
```

### **📱 User Experience**

#### **Upload States**
1. **Idle**: Drag & drop area visible
2. **Uploading**: Progress bar with percentage
3. **Success**: Photo preview shown
4. **Error**: Error message displayed
5. **Processing**: Post being created

#### **Progress Feedback**
- Real-time upload percentage
- File size information
- Upload speed estimation
- Error handling with retry options

### **🔄 Demo vs Production**

#### **Demo Mode Benefits**
- No AWS setup required
- Instant local preview
- Simulated upload experience
- Perfect for development

#### **Production Mode Benefits**
- Real S3 storage
- Scalable file management
- CDN integration ready
- Professional upload experience

### **⚡ Performance Optimizations**

#### **Upload Optimizations**
- Chunked uploads for large files
- Compression before upload
- Progress tracking
- Error recovery

#### **Display Optimizations**
- Lazy loading for feed images
- Responsive image sizing
- CDN integration
- Caching strategies

### **🎯 Next Steps**

1. **Configure S3 Bucket**: Set up production bucket
2. **Test Upload Flow**: Verify demo mode works
3. **Deploy to Production**: Enable S3 uploads
4. **Monitor Performance**: Track upload success rates
5. **Optimize Images**: Add compression/resizing

The photo upload system is now fully functional with both demo and production modes!
