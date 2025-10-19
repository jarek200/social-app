# Social App Prototype

A modern, low-cost, serverless social app prototype demonstrating real-time features using AWS managed services.

## 🎯 Mission

Build a social photo-sharing app with live feeds, likes, comments, and content moderation - all running serverlessly with zero backend servers.

### Why this Architecture?
This architecture demonstrates how modern serverless systems can combine managed services like Amplify and AppSync for speed with SAM-managed Step Functions for flexibility and reliability — achieving real-time features with minimal operational overhead.

## 🧩 Key AWS Concepts Demonstrated

- **Event-driven architecture** using Step Functions + EventBridge
- **Serverless real-time data** with AppSync subscriptions
- **Schema evolution and access patterns** for DynamoDB single-table design
- **Decoupled frontend/backend** using Amplify Hosting and SAM-managed APIs
- **AI moderation pipeline** integrating Comprehend into workflows
- **Fine-grained access control** with Cognito + AppSync `@auth` rules
- **End-to-end CI/CD** with Amplify Hosting + Nx monorepo orchestration

## 🏗️ Architecture Overview

### Hybrid Approach: Amplify + SAM

**Amplify (Managed Services)**
- Authentication (Cognito)
- GraphQL API (AppSync)
- File Storage (S3)
- Hosting & CDN (CloudFront)

**SAM (Custom Workflows)**
- Step Functions Express workflows
- DynamoDB single-table design
- SNS/EventBridge notifications

**Frontend**
- Astro + Web Awesome UI
- Preact islands + Nanostores
- Real-time AppSync subscriptions

⚠️ Note: SNS/EventBridge are optional — used only when Step Functions or external systems need to publish events back to AppSync. Direct AppSync subscriptions already handle live user updates.

## 🧭 Architecture Diagram

```
                           ┌───────────────────────────────────────────┐
                           │               Amplify Hosting              │
                           │  (CDN + CI/CD + SSL via CloudFront & S3)  │
                           └───────────────────────────────────────────┘
                                              │
                    ┌─────────────────────────┼───────────────────────────┐
                    │                         │                           │
                    ▼                         ▼                           ▼
         ┌──────────────────┐      ┌────────────────────┐       ┌────────────────────┐
         │   Astro +        │      │  Amplify API       │       │  Amplify Storage   │
         │   Web Awesome UI │─────▶│  (AppSync GraphQL) │◀────▶│  (S3 Buckets)      │
         │   + Preact +     │      │  Queries, Mutations│       │  Photo Uploads via │
         │   Nanostores     │      │  Subscriptions     │       │  pre-signed URLs   │
         └──────────────────┘      └────────────────────┘       └────────────────────┘
                    │                         ▲
                    │                         │
                    │                         │ Auth (JWT)
                    │                         │
                    ▼                         │
         ┌──────────────────┐                 │
         │ Amplify Auth     │─────────────────┘
         │ (Cognito)        │
         │ Login, Tokens    │
         └──────────────────┘
                    │
                    ▼
      ┌─────────────────────────────┐
      │   AWS Step Functions (SAM)  │
      │   Express Workflows         │
      │   ─ Save Post (DynamoDB)    │
      │   ─ Moderate Caption        │
      │   ─ Notify Followers (SNS)  │
      │   ─ Publish back to AppSync │
      └─────────────────────────────┘
                    │
                    ▼
      ┌─────────────────────────────┐
      │     DynamoDB Single Table   │
      │  PK/SK model: USER#, POST#, │
      │  COMMENT#, LIKE#, FEED#     │
      └─────────────────────────────┘
                    │
                    ▼
      ┌─────────────────────────────┐
      │         Amazon SNS          │
      │  Fan-out Notifications to   │
      │  Followers / AppSync        │
      └─────────────────────────────┘
```

This architecture demonstrates a fully serverless social platform that combines Amplify's managed services for rapid development with SAM-managed workflows for advanced orchestration.

> 💡 **Portfolio Enhancement**: Consider adding a visual diagram file (`docs/architecture-diagram.drawio` or `.png`) for presentations and documentation.

## 🧱 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Astro + Web Awesome + Preact + Nanostores | UI, reactivity, GraphQL client |
| **API** | AWS AppSync (GraphQL) | Mutations, queries, real-time subscriptions |
| **Workflow** | Step Functions (Express) | Content moderation, fan-out notifications |
| **Database** | DynamoDB (single-table) | Users, posts, comments, relationships |
| **Storage** | S3 + CloudFront | Photo storage and global CDN delivery |
| **Auth** | Cognito | User management, JWT tokens |
| **Notifications** | SNS / EventBridge | Push events to followers |
| **AI** | Amazon Comprehend | Sentiment analysis & moderation |
| **Hosting** | Amplify Hosting | CI/CD, SSL, global CDN |
| **IaC** | AWS SAM + Amplify CLI | Infrastructure as Code |
| **Repo** | Nx Monorepo + pnpm | Shared code, caching, fast builds |
| **Linting** | BiomeJS | Fast, consistent code quality |
| **Testing** | Vitest + Playwright | Unit & E2E testing |
| **Monitoring** | CloudWatch + X-Ray | Observability & debugging |

## ⚛️ Frontend Development Notes

### ⚙️ Framework Choices

**Astro with built-in TypeScript**
- Astro supports TypeScript out of the box — no separate configuration or compiler step needed.
- You can freely write `.ts` and `.tsx` files in your components or Preact islands.
- There's no need to set up a `tsconfig.json` manually — Astro handles type checking automatically.

**No separate TypeScript build**
- Because Astro already compiles `.ts` and `.tsx` files during the build, we keep the repo simpler by not introducing additional TypeScript tooling or strict type linting.

**No TailwindCSS**
- Instead of Tailwind, this project uses Web Awesome (the modern successor to Shoelace) for clean, accessible, web-standards-based components with built-in styling.
- This reduces dependency overhead and keeps the UI stack lightweight.

**Styling with Web Awesome**
- Web Awesome provides native theming, CSS variables, and responsive utilities — no external CSS frameworks required.
- When needed, small style overrides can be added via plain CSS modules or scoped Astro styles.

### 💡 Why this choice

- ⚡ **Faster builds** — less tooling overhead (no PostCSS/Tailwind pipelines).
- 🧩 **Simpler monorepo setup** — fewer shared dependencies to manage in Nx.
- 💬 **Standard web components** — works natively across Astro, Preact, and future frameworks.
- 🧱 **Type safety included** — Astro's integrated TS ensures strong typing with zero setup.

## 📁 Project Structure (Nx Monorepo)

```
social-app/
├── apps/
│   ├── frontend/              # Astro application
│   │   ├── src/
│   │   │   ├── components/    # Web Awesome components
│   │   │   ├── pages/         # Astro pages (dashboard, auth)
│   │   │   ├── islands/       # Preact interactive components
│   │   │   └── stores/        # Nanostores for state
│   │   ├── astro.config.mjs
│   │   └── package.json
│   └── backend/               # SAM templates
│       ├── template.yaml      # Step Functions + DynamoDB
│       └── src/               # Lambda functions (if needed)
├── packages/
│   ├── shared/                # Shared utilities
│   │   ├── src/
│   │   │   ├── graphql/       # GraphQL types, queries
│   │   │   ├── schemas/       # Zod validation schemas
│   │   │   └── utils/         # Common utilities
│   │   └── package.json
│   └── ui/                    # Reusable UI components
│       ├── src/
│       └── package.json
├── amplify/                   # Amplify configuration
│   ├── backend/               # Auth, API, Storage config
│   └── build/                 # Generated resources
├── docs/
│   ├── dynamodb-access-patterns.md
│   ├── resolver-tests.md
│   └── architecture.md
├── nx.json
├── pnpm-workspace.yaml
├── amplify.yml                # Amplify Hosting config
├── biome.json                 # Linting config
└── README.md
```

## 🚀 Features

### Core Features

#### 1. User Authentication & Profiles
- **Signup/Login** via Cognito
- **Profile management** with avatar uploads
- **Session management** with JWT tokens

#### 2. Photo Sharing
- **Secure uploads** via Amplify Storage (S3 pre-signed URLs)
- **Image optimization** and CDN delivery
- **Caption support** with rich text

#### 3. Real-Time Social Feed
- **Live feed updates** via AppSync subscriptions
- **Infinite scroll** with pagination
- **Real-time notifications** for new posts

#### 4. Interactions
- **Like system** with live counters
- **Comments** with threading support
- **Real-time updates** for all interactions

#### 5. Content Moderation
- **Automatic sentiment analysis** via Comprehend
- **Content flagging** for inappropriate material
- **Admin review queue** for flagged content

#### 6. Following System
- **Follow/unfollow users**
- **Personalized feeds** based on follows
- **Notification preferences**

### Advanced Features

#### 7. Chat/Messaging (Future)
- **Real-time chat** using AppSync subscriptions
- **Channel-based messaging**
- **Message history** and search

#### 8. Analytics (Future)
- **User engagement metrics**
- **Content performance tracking**
- **Real-time dashboards**

## 👤 User Experience Overview

This prototype focuses on simplicity, performance, and real-time interactivity.
All pages are static-first (SSG) using Astro, with dynamic "islands" powered by Preact + Nanostores for real-time updates from AppSync subscriptions.

### 🧩 Application Flow

| Step | Page | Description |
|------|------|-------------|
| 1️⃣ | Login / Signup | `/auth` | Users register or sign in via Cognito Hosted UI or Amplify Auth components. Supports email + password or federated login (Google, Apple). |
| 2️⃣ | Onboarding / Profile Setup | `/profile/setup` | After signing up, users add their display name, avatar, and bio. Profile data is stored in DynamoDB under USER#<id>. |
| 3️⃣ | Dashboard / Feed | `/feed` | The home screen shows a real-time feed of posts from followed users. Each post includes photo, caption, likes, and comment count. Subscriptions update new posts instantly. |
| 4️⃣ | Post Creation | `/create` | Users upload a photo via S3 pre-signed URL (through Amplify Storage). A caption is analyzed by Comprehend in the Step Function workflow before it appears in the feed. |
| 5️⃣ | Post Detail | `/post/:id` | Displays one post with its comments. Users can like or comment in real time. AppSync mutations trigger immediate UI updates. |
| 6️⃣ | Notifications | `/notifications` | Shows in-app notifications (likes, new followers, or comments). Pulled from NOTIF# items in DynamoDB and updated live via subscriptions. |
| 7️⃣ | User Profile Page | `/user/:username` | Displays a user's posts, follower count, and follow/unfollow button. Personalized feeds are generated from GSI queries. |
| 8️⃣ | Chat (Future) | `/chat` | Real-time private and group messaging powered by AppSync subscriptions. Messages stored under CHANNEL#<id> → MESSAGE#<timestamp>. |
| 9️⃣ | Admin Dashboard (Optional) | `/admin/moderation` | Allows admins to review flagged content detected by Amazon Comprehend or Rekognition. Step Function workflows send flagged posts to this view. |

### 🖼️ Visual Flow Summary

```
[Login / Signup] → [Profile Setup]
       ↓
    [Dashboard / Feed]
       ↓
[Create Post] → [Post Detail]
       ↓
  [Notifications] ↔ [Chat]
       ↓
 [Admin Dashboard (optional)]
```

### 🪄 UX Design Highlights

- **Astro + Web Awesome** provide fast static rendering and modern styling.
- **Preact islands** handle live-updating widgets (likes, comments, chat).
- **Nanostores** manage client-side state efficiently (auth user, feed cache, notifications).
- **Amplify Auth UI** integrates natively with Cognito for easy login.
- **Responsive layout** using Web Awesome grid + mobile-first design.
- **Lazy loading images** via S3 CloudFront URLs with CDN caching.

### 🧭 Example Pages Overview

#### 🧑‍💻 Login Page
- Clean Web Awesome form with username/password + "Sign in with Google"
- Authenticates via Amplify Auth → redirects to `/feed`

#### 🏠 Dashboard / Feed
- Infinite scroll of photo cards
- Each post: avatar, image, caption, live likes/comments counters
- "New Post" button fixed in corner → opens `/create`

#### 🖼️ Create Post
- Upload form with preview, caption text box, and category
- Step Function moderates caption → once approved, auto-updates feed

#### 💬 Post Detail
- Full-width photo, comments panel, and input box
- Likes and new comments update instantly via subscription

#### 🔔 Notifications
- Simple list UI showing who liked or commented recently
- Uses DynamoDB GSI and AppSync subscription for updates

#### 💭 Chat (future)
- Realtime chat window with channels sidebar
- Each channel uses CHANNEL#id partition key
- Messages streamed via AppSync subscriptions

#### 🛡️ Admin Moderation (future)
- Table of flagged posts with reason and moderation status
- Approve/reject buttons trigger Step Function to unflag or delete

## 💾 Data Model (DynamoDB Single-Table)

| PK | SK | GSI1PK | GSI1SK | Description |
|----|----|--------|--------|-------------|
| `USER#<id>` | `PROFILE` | - | - | User profile data |
| `USER#<id>` | `FOLLOWING#<userId>` | `USER#<userId>` | `FOLLOWER#<id>` | Follow relationships |
| `POST#<id>` | `META` | `USER#<authorId>` | `POST#<id>` | Photo post data |
| `POST#<id>` | `LIKE#<userId>` | `POST#<id>` | `LIKE#<userId>` | Like records |
| `POST#<id>` | `COMMENT#<id>` | `POST#<id>` | `COMMENT#<id>` | Comments |
| `CHANNEL#<id>` | `MESSAGE#<timestamp>` | `CHANNEL#<id>` | `MESSAGE#<timestamp>` | Chat messages |
| `USER#<id>` | `NOTIF#<id>` | - | - | User notifications |

### Access Patterns

1. **Get user profile**: `PK = USER#<id>, SK = PROFILE`
2. **Get user posts**: `GSI1PK = USER#<id>, begins_with(SK, POST#)`
3. **Get post details**: `PK = POST#<id>, SK = META`
4. **Get post likes**: `PK = POST#<id>, begins_with(SK, LIKE#)`
5. **Get post comments**: `PK = POST#<id>, begins_with(SK, COMMENT#)`
6. **Get user feed**: `PK = USER#<id>, begins_with(SK, FEED#)`
7. **Get notifications**: `PK = USER#<id>, begins_with(SK, NOTIF#)`

## 🧪 Data Schema & Resolver Quality

- **Schema Evolution:** Track changes in `docs/dynamodb-access-patterns.md`
- **Versioned Entities:** Add `entityVersion` to DynamoDB items for smooth migrations
- **Resolver Testing:** Use AppSync local emulator or Amplify mock to validate VTL templates
- **Access Pattern Validation:** Integration tests ensure each query matches the schema

## 🔄 Application Flow

### Photo Upload Flow
```
1. User selects photo → Frontend validates file
2. Generate pre-signed URL → Amplify Storage API
3. Upload to S3 → Get photoKey
4. Create post mutation → AppSync
5. Trigger Step Function → Process workflow
6. Save to DynamoDB → Moderate content
7. Notify followers → SNS
8. Emit subscription → Update feeds live
```

### Like/Comment Flow
```
1. User interaction → AppSync mutation
2. Validate permissions → Update DynamoDB
3. Emit subscription → Live UI updates
4. Optional: Notify post author → SNS
```

### Moderation Flow
```
1. New post/comment → Step Function trigger
2. Analyze content → Amazon Comprehend
3. Flag if needed → Update status
4. Notify admins → SNS/EventBridge
```

### Step Functions → AppSync Integration Example

Your Step Function can directly notify AppSync without SNS:

```json
{
  "Type": "Task",
  "Resource": "arn:aws:states:::aws-sdk:appsync:graphql",
  "Parameters": {
    "ApiId": "YOUR_API_ID",
    "Query": "mutation NotifyFollowers($msg: String!) { notifyFollowers(message: $msg) }",
    "Variables": { "msg": "Post approved!" }
  }
}
```

## 🛠️ Development Workflow

### Prerequisites
- Node.js 18+
- pnpm
- AWS CLI configured
- Amplify CLI
- SAM CLI

### Local Development

- **Frontend:** Run Astro + Amplify mock backend
  ```bash
  pnpm nx serve frontend
  amplify mock api
  ```
- **Backend:** Test Step Functions locally with SAM
  ```bash
  sam local start-lambda
  sam local start-api
  ```
- **Database:** Use DynamoDB Local or AWS LocalStack for integration tests

### Initial Setup

```bash
# Clone and setup
cd social-app
pnpm install

# Initialize Amplify (Auth, API, Storage)
amplify init
amplify add auth
amplify add api
amplify add storage
amplify add hosting
amplify push

# Setup SAM backend
cd apps/backend
sam init --runtime python3.9
sam build
sam deploy --guided
```

### Development Commands

```bash
# Frontend development
pnpm nx serve frontend

# Backend development
pnpm nx serve backend

# Run tests
pnpm nx test shared
pnpm nx e2e frontend

# Build all
pnpm nx build frontend
pnpm nx build backend

# Deploy
amplify publish  # Frontend + Amplify resources
sam deploy      # Backend resources
```

### Code Quality

```bash
# Lint and format
pnpm biome check .
pnpm biome format .

# Type checking
pnpm nx type-check frontend
```

## 🚀 Deployment Strategy

### CI/CD Pipeline

**Amplify Hosting** (Frontend)
- Git-based deployments
- Automatic builds on push
- Preview environments for PRs
- Global CDN with CloudFront

**SAM Deployments** (Backend)
- Manual deployments via CLI
- Infrastructure as Code
- Environment-specific configs

### Environments

```yaml
# amplify.yml
version: 1
applications:
  - appRoot: apps/frontend
    frontend:
      phases:
        preBuild:
          commands:
            - pnpm install --frozen-lockfile
        build:
          commands:
            - pnpm nx build frontend
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*

## 🌍 Environment Management

- Environments managed via **Amplify environments** (`amplify env add dev`)
- SAM parameter overrides (`--parameter-overrides Environment=prod`)
- Nx targets control which environment deploys:
  ```bash
  pnpm nx deploy backend --configuration=staging
  ```
- Separate Cognito + AppSync endpoints per environment

## 🔐 Security Design Principles

### Well-Architected Security Pillar

- **Least privilege:** IAM roles scoped per function (read/write separation)
- **Data minimization:** Temporary session tokens (Cognito + IAM federation)
- **Defense in depth:** Auth + @auth rules + IAM policies
- **Encryption:** S3 (AES-256), DynamoDB (KMS-managed keys)
- **Auditability:** CloudTrail for API access, X-Ray tracing

### Authentication & Authorization
- **Cognito User Pools** for user management
- **JWT tokens** for API access
- **MFA support** (optional)
- **AppSync auth rules** with `@auth` directives
- **IAM roles** for service-to-service communication
- **Pre-signed URLs** for secure file uploads

### Data Protection & Compliance
- **Encryption at rest** (DynamoDB, S3)
- **HTTPS everywhere** via CloudFront
- **GDPR compliance** for EU users

### AWS Well-Architected Alignment
- **Operational Excellence:** Nx monorepo, Amplify CI/CD automation
- **Security:** Cognito, IAM least privilege, encryption
- **Reliability:** Step Functions orchestration, retry policies
- **Performance Efficiency:** DynamoDB single-table design, AppSync subscriptions
- **Cost Optimization:** Express workflows, on-demand resources

## 📊 Monitoring & Observability

### CloudWatch Dashboards
- **AppSync metrics**: Request latency, error rates, subscription counts
- **Step Functions**: Execution success/failure rates
- **DynamoDB**: Read/write throughput, throttling
- **S3**: Storage usage, transfer costs

### Logging
- **Structured logging** in Step Functions
- **X-Ray tracing** for request tracking
- **CloudWatch Logs** for all services

### Alerts
- **Step Function failures**
- **AppSync subscription disconnects**
- **DynamoDB throttling events**

## 💰 Cost Estimation

### Monthly Costs (Light Usage - 100 users, 1000 posts)

| Service | Cost | Notes |
|---------|------|-------|
| **Amplify Hosting** | $1 | CloudFront + S3 hosting |
| **AppSync** | $2 | GraphQL requests + subscriptions |
| **Cognito** | $0 | Free tier (50k users) |
| **S3 Storage** | $0.50 | Photo storage (10GB) |
| **Step Functions** | $0.50 | Express workflow executions |
| **DynamoDB** | $1 | Read/write operations |
| **Comprehend** | $0.50 | Content moderation |
| **CloudWatch** | $0.50 | Monitoring & logs |
| **Total** | **$6.50** | Fully serverless, pay-per-use |

### Scaling Costs
- **10x users**: ~$20/month
- **100x users**: ~$150/month
- **1000x users**: ~$800/month

## 💰 Cost Optimization Strategies

- Use **AppSync HTTP resolvers** where possible (no Lambda = cheaper)
- Keep **Step Functions Express** for fast low-cost workflows
- DynamoDB **on-demand billing** for unpredictable workloads
- S3 **Intelligent-Tiering** for older photos
- Enable **CloudFront compression** to reduce transfer cost
- Use **CloudWatch metrics filters** to detect runaway executions

## 🧪 Quality & Testing Strategy

### Unit Tests
- **Frontend components** with Vitest
- **GraphQL resolvers** with Jest
- **Utility functions** in shared packages

### Integration Tests
- **API endpoints** with Supertest
- **Step Functions** with local SAM testing
- **Database operations** with DynamoDB Local

### End-to-End Tests
- **User journeys** with Playwright
- **Real-time features** with subscription testing
- **File uploads** and moderation workflows

## 🔄 Migration & Evolution

### Phase 1: MVP (4 weeks)
- User auth + profiles
- Photo upload + basic feed
- Like/comment system
- Basic moderation

### Phase 2: Enhancement (4 weeks)
- Advanced moderation (Rekognition)
- Following system
- Push notifications
- Performance optimization

### Phase 3: Scale (4 weeks)
- Chat/messaging
- Analytics dashboard
- Advanced search
- Mobile app

## 📚 Resources & References

### AWS Documentation
- [AppSync Developer Guide](https://docs.aws.amazon.com/appsync/)
- [Step Functions Best Practices](https://docs.aws.amazon.com/step-functions/)
- [DynamoDB Single-Table Design](https://docs.aws.amazon.com/amazondynamodb/)

### Amplify Resources
- [Amplify Docs](https://docs.amplify.aws/)
- [Amplify UI Components](https://ui.docs.amplify.aws/)

### Nx Resources
- [Nx Monorepo Guide](https://nx.dev/)
- [Nx + AWS Integration](https://nx.dev/recipes/aws)

## 🤝 Contributing

### Code Standards
- **BiomeJS** for linting and formatting
- **Conventional commits** for git history
- **Nx affected** commands for efficient CI

### Branch Strategy
- `main` - Production deployments
- `develop` - Integration branch
- `feature/*` - Feature branches
- `hotfix/*` - Bug fixes

### Pull Request Process
1. Create feature branch
2. Write tests
3. Update documentation
4. Create PR with description
5. Code review + approval
6. Merge to develop → main

## 📞 Support & Maintenance

### Monitoring
- **Uptime monitoring** via CloudWatch
- **Performance monitoring** via X-Ray
- **Cost monitoring** via Cost Explorer

### Incident Response
- **Alert channels** in Slack/Teams
- **Runbooks** for common issues
- **Backup strategies** for critical data

### Future Enhancements

- **S3 Object Lambda** for dynamic image resizing
- **Amazon Rekognition** for image moderation
- **Step Functions Distributed Map** for large batch operations
- **Kinesis Firehose** for event streaming & analytics
- **OpenSearch Dashboards** for analytics queries
- **AWS Pinpoint** for push/email notifications
- **Multi-region deployment**
- **Advanced caching strategies**
- **Machine learning features**
- **Mobile application**

---

## 🪪 License
MIT License © 2025 Jarek Wyprzał — Built for educational and prototype use.

## 👥 Maintainers
- **Jarek Wyprzał** — AWS Architect & Developer
- Contributions welcome via PRs!

---

*This document serves as the comprehensive guide for building and maintaining the Social App Prototype. Keep it updated as the project evolves.*
