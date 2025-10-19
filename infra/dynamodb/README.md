# DynamoDB Single Table Design

| Entity | Partition Key (`PK`) | Sort Key (`SK`) | GSI1PK | GSI1SK | Notes |
| --- | --- | --- | --- | --- | --- |
| User profile | `USER#{userId}` | `PROFILE` | n/a | n/a | Owner metadata for feeds |
| Post | `POST#{postId}` | `POST` | `FEED#{feedId}` | `POST#{createdAt}` | Backed by AppSync `Post` type |
| Comment | `POST#{postId}` | `COMMENT#{commentId}` | `POST#{postId}` | `COMMENT#{createdAt}` | Sorted per post |
| Like | `POST#{postId}` | `LIKE#{userId}` | `LIKE#{userId}` | `POST#{createdAt}` | Enables "liked by me" lookups |
| Feed item | `FEED#{userId}` | `POST#{createdAt}` | `FEED#{userId}` | `POST#{createdAt}` | Materialized followers feed |

This layout optimizes the following access patterns:

- Fetch a viewer's feed (`GSI1` with `FEED#{viewerId}`)
- Fetch likes/comments for a post (primary index scan on `PK = POST#id`)
- Fetch user's posts (`GSI1` keyed by `FEED#GLOBAL` or `FEED#{userId}`)

The Step Functions workflow writes posts with `PENDING` moderation status, then transitions
them to `APPROVED` or `REJECTED`. Additional fan-out workers can project items into
per-follower feeds by putting records with `PK = FEED#{followerId}`.
