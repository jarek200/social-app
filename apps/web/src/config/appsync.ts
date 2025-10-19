export type AppSyncConfig = {
  graphqlEndpoint: string;
  region: string;
  authMode: "AMAZON_COGNITO_USER_POOLS" | "API_KEY" | "AWS_IAM";
  apiKey?: string;
};

export const appsyncConfig: AppSyncConfig = {
  graphqlEndpoint: import.meta.env.PUBLIC_APPSYNC_URL ?? "https://example.appsync-api.us-east-1.amazonaws.com/graphql",
  region: import.meta.env.PUBLIC_AWS_REGION ?? "us-east-1",
  authMode: "AMAZON_COGNITO_USER_POOLS"
};
