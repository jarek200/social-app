# SAM Stack

This stack deploys the workflow components that extend the Amplify-managed AppSync API:

- `SocialAppTable` – DynamoDB single-table (PAY_PER_REQUEST)
- `SavePostWorkflow` – Step Functions Express workflow that moderates captions
- `FeedEventsTopic` – SNS topic for fan-out to downstream processors (optional)
- `SavePostWorkflowTrigger` – Lambda invoked from AppSync mutation resolvers

## Deploy

```bash
sam build --template-file infra/sam/template.yaml
sam deploy --stack-name social-app-backend --capabilities CAPABILITY_IAM \
  --parameter-overrides AppSyncApiId=xxxxxx
```

After deployment, copy the outputs into your Amplify environment variables so the frontend can connect to the correct resources.
