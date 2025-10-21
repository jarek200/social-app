import { initializeEnvironment } from "@utils/environment";
import { Amplify } from "aws-amplify";

// Initialize environment configuration
const envConfig = initializeEnvironment();

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: envConfig.cognitoUserPoolId,
      userPoolClientId: envConfig.cognitoClientId,
      loginWith: {
        email: true,
        username: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: envConfig.apiUrl,
      region: envConfig.region,
      defaultAuthMode: "userPool" as const,
    },
  },
  Storage: {
    S3: {
      bucket: envConfig.s3Bucket,
      region: envConfig.region,
    },
  },
};

// Only configure Amplify if we have the required environment variables
if (envConfig.apiUrl && envConfig.cognitoUserPoolId) {
  Amplify.configure(amplifyConfig);

  if (envConfig.debugMode) {
    console.log("🔧 Amplify configured for environment:", envConfig.environment);
  }
} else {
  console.warn("⚠️ Amplify not configured - missing required environment variables");
}

export { amplifyConfig, envConfig };
