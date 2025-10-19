import { Amplify } from "aws-amplify";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
      loginWith: {
        email: true,
        username: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: import.meta.env.PUBLIC_APPSYNC_URL,
      region: import.meta.env.PUBLIC_AWS_REGION,
      defaultAuthMode: "userPool",
    },
  },
  Storage: {
    S3: {
      bucket: import.meta.env.PUBLIC_S3_BUCKET,
      region: import.meta.env.PUBLIC_AWS_REGION,
    },
  },
};

// Only configure Amplify if we have the required environment variables
if (import.meta.env.PUBLIC_APPSYNC_URL && import.meta.env.PUBLIC_COGNITO_USER_POOL_ID) {
  Amplify.configure(amplifyConfig);
}

export { amplifyConfig };
