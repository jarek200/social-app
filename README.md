# Social App Prototype

Modern, serverless social photo-sharing prototype that demonstrates:

- Astro + Preact frontend powered by Nx
- AWS Amplify (Auth, AppSync, S3, Hosting)
- DynamoDB single-table design with AppSync direct resolvers
- Step Functions Express workflow for caption moderation with Amazon Comprehend

## Getting Started

```bash
npm install
npm run dev
```

The web application runs on `http://localhost:4321` and uses mocked data until you connect a real AppSync backend.

## Application Flow Routes

- `/auth` – Cognito-style sign in screen
- `/profile/setup` – Profile onboarding form
- `/` – Dashboard overview
- `/feed` – Real-time feed
- `/create` – Post creation workflow
- `/post/post-1000` – Sample post detail (dynamic route)
- `/notifications` – Live notifications list
- `/user/ava` – User profile page (also `/user/noah`, `/user/priya`)
- `/chat` – Team chat console
- `/admin/moderation` – Moderation console

## Project Structure

| Path | Description |
| --- | --- |
| `apps/web` | Astro frontend with Nanostores-powered realtime feed |
| `libs/shared` | Shared TypeScript models (keys, DTOs) |
| `amplify/api` | AppSync GraphQL schema + resolver references |
| `amplify/functions` | Lambda invoked from AppSync to start workflows |
| `infra/sam` | SAM stack for Step Functions + DynamoDB |
| `infra/dynamodb` | Data modeling notes |

## Backend Integration

1. Deploy Amplify backend (Auth, Storage, GraphQL) with the schema in `amplify/api/schema.graphql`.
2. Deploy the SAM workflow stack:
   ```bash
   sam build --template-file infra/sam/template.yaml
   sam deploy --guided
   ```
3. Configure Amplify function environment variables with the outputs (`SavePostStateMachineArn`, `FeedEventsTopicArn`).
4. Update frontend `.env` with `PUBLIC_APPSYNC_URL` and `PUBLIC_AWS_REGION`.

## Testing & Quality

- `npm run test` – Vitest for web + shared packages
- `npm run lint` – Biome linting and formatting
- `npm run format` – Automatically format codebase

## Utilities

- Seed demo data: `AWS_PROFILE=dev TABLE_NAME=... npx tsx scripts/seed-demo-data.ts`

## Next Steps

- Connect real GraphQL resolvers using Amplify codegen
- Add Rekognition image moderation to the workflow
- Expand Nx setup with mobile or admin applications
