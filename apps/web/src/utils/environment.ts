/**
 * Frontend Environment Management
 *
 * This utility provides environment detection, configuration, and validation
 * for the frontend application across different deployment environments.
 */

export type Environment = "sandbox" | "staging" | "production" | "development";

export interface EnvironmentConfig {
  environment: Environment;
  region: string;
  isProduction: boolean;
  isStaging: boolean;
  isDevelopment: boolean;
  isSandbox: boolean;
  apiUrl: string;
  s3Bucket: string;
  cognitoUserPoolId: string;
  cognitoClientId: string;
  demoMode: boolean;
  debugMode: boolean;
  features: {
    imageProcessing: boolean;
    realTimeUpdates: boolean;
    analytics: boolean;
    errorReporting: boolean;
  };
}

/**
 * Detect the current environment based on various indicators
 */
export const detectEnvironment = (): Environment => {
  // Check for explicit environment variable first
  const explicitEnv = import.meta.env.PUBLIC_AMPLIFY_ENV as Environment;
  if (explicitEnv && ["sandbox", "staging", "production", "development"].includes(explicitEnv)) {
    return explicitEnv;
  }

  // Detect by hostname/URL
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const href = window.location.href;

    // Production indicators
    if (
      hostname.includes("prod") ||
      hostname.includes("production") ||
      hostname.includes("app.") ||
      href.includes("amazonaws.com") ||
      href.includes("cloudfront.net")
    ) {
      return "production";
    }

    // Staging indicators
    if (
      hostname.includes("staging") ||
      hostname.includes("stg") ||
      hostname.includes("preview") ||
      href.includes("amplifyapp.com")
    ) {
      return "staging";
    }

    // Development indicators
    if (
      hostname.includes("localhost") ||
      hostname.includes("127.0.0.1") ||
      hostname.includes("dev") ||
      href.includes("localhost:4321")
    ) {
      return "development";
    }
  }

  // Default to sandbox for Amplify deployments
  return "sandbox";
};

/**
 * Get environment-specific configuration
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const environment = detectEnvironment();

  // Base configuration
  const baseConfig = {
    environment,
    region: import.meta.env.PUBLIC_AWS_REGION || "eu-west-2",
    apiUrl: import.meta.env.PUBLIC_APPSYNC_URL || "",
    s3Bucket: import.meta.env.PUBLIC_S3_BUCKET || "",
    cognitoUserPoolId: import.meta.env.PUBLIC_COGNITO_USER_POOL_ID || "",
    cognitoClientId: import.meta.env.PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
    demoMode: import.meta.env.PUBLIC_DEMO_MODE === "true",
  };

  // Environment-specific overrides
  const environmentOverrides: Record<
    Environment,
    Omit<
      EnvironmentConfig,
      keyof typeof baseConfig | "isProduction" | "isStaging" | "isDevelopment" | "isSandbox"
    >
  > = {
    development: {
      debugMode: true,
      features: {
        imageProcessing: false,
        realTimeUpdates: true,
        analytics: false,
        errorReporting: false,
      },
    },
    sandbox: {
      debugMode: true,
      features: {
        imageProcessing: true,
        realTimeUpdates: true,
        analytics: false,
        errorReporting: true,
      },
    },
    staging: {
      debugMode: false,
      features: {
        imageProcessing: true,
        realTimeUpdates: true,
        analytics: true,
        errorReporting: true,
      },
    },
    production: {
      debugMode: false,
      features: {
        imageProcessing: true,
        realTimeUpdates: true,
        analytics: true,
        errorReporting: true,
      },
    },
  };

  const overrides = environmentOverrides[environment];

  return {
    ...baseConfig,
    debugMode: overrides.debugMode,
    features: overrides.features,
    isProduction: environment === "production",
    isStaging: environment === "staging",
    isDevelopment: environment === "development",
    isSandbox: environment === "sandbox",
  };
};

/**
 * Validate environment configuration
 */
export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const config = getEnvironmentConfig();
  const errors: string[] = [];

  // Required environment variables
  const requiredVars = [
    { key: "apiUrl", name: "PUBLIC_APPSYNC_URL" },
    { key: "s3Bucket", name: "PUBLIC_S3_BUCKET" },
    { key: "cognitoUserPoolId", name: "PUBLIC_COGNITO_USER_POOL_ID" },
    { key: "cognitoClientId", name: "PUBLIC_COGNITO_USER_POOL_CLIENT_ID" },
  ];

  for (const { key, name } of requiredVars) {
    if (!config[key as keyof EnvironmentConfig]) {
      errors.push(`Missing required environment variable: ${name}`);
    }
  }

  // Validate URLs
  if (config.apiUrl && !isValidUrl(config.apiUrl)) {
    errors.push(`Invalid API URL: ${config.apiUrl}`);
  }

  // Validate AWS region
  const validRegions = ["us-east-1", "us-west-2", "eu-west-1", "eu-west-2", "ap-southeast-1"];
  if (config.region && !validRegions.includes(config.region)) {
    errors.push(`Invalid AWS region: ${config.region}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get environment-specific API endpoints
 */
export const getApiEndpoints = () => {
  const config = getEnvironmentConfig();

  return {
    graphql: config.apiUrl,
    rest: config.apiUrl.replace("/graphql", "/rest"),
    websocket: config.apiUrl.replace("https://", "wss://").replace("/graphql", "/graphql"),
  };
};

/**
 * Get environment-specific S3 configuration
 */
export const getS3Config = () => {
  const config = getEnvironmentConfig();

  return {
    bucket: config.s3Bucket,
    region: config.region,
    baseUrl: `https://${config.s3Bucket}.s3.${config.region}.amazonaws.com`,
    cloudFrontUrl: config.isProduction
      ? `https://d1234567890.cloudfront.net`
      : `https://${config.s3Bucket}.s3.${config.region}.amazonaws.com`,
  };
};

/**
 * Get environment-specific feature flags
 */
export const getFeatureFlags = () => {
  const config = getEnvironmentConfig();

  return {
    ...config.features,
    // Additional feature flags based on environment
    enableImageProcessing: config.features.imageProcessing && !config.demoMode,
    enableRealTimeUpdates: config.features.realTimeUpdates && !config.demoMode,
    enableAnalytics: config.features.analytics && config.isProduction,
    enableErrorReporting: config.features.errorReporting && !config.isDevelopment,
    enableDebugLogging: config.debugMode,
    enablePerformanceMonitoring: config.isProduction || config.isStaging,
  };
};

/**
 * Get environment-specific logging configuration
 */
export const getLoggingConfig = () => {
  const config = getEnvironmentConfig();

  return {
    level: config.isProduction ? "error" : "debug",
    enableConsole: !config.isProduction,
    enableRemote: config.features.errorReporting,
    enablePerformance: config.isProduction || config.isStaging,
    maxLogEntries: config.isProduction ? 100 : 1000,
  };
};

/**
 * Utility function to check if URL is valid
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Environment-specific error handling
 */
export const handleEnvironmentError = (error: Error, context: string) => {
  const config = getEnvironmentConfig();

  if (config.features.errorReporting && !config.isDevelopment) {
    // Send to error reporting service
    // Example: Sentry.captureException(error, { tags: { environment: config.environment } });
  }
};

/**
 * Get environment-specific image processing configuration
 */
export const getImageProcessingConfig = () => {
  const config = getEnvironmentConfig();

  return {
    enabled: config.features.imageProcessing,
    maxFileSize: config.isProduction ? 10 * 1024 * 1024 : 5 * 1024 * 1024, // 10MB prod, 5MB others
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    quality: config.isProduction ? 90 : 85,
    maxWidth: config.isProduction ? 2560 : 1920,
    maxHeight: config.isProduction ? 1440 : 1080,
    thumbnailSize: 400,
    enableWebP: config.isProduction || config.isStaging,
    enableProgressive: config.isProduction,
  };
};

/**
 * Initialize environment configuration
 * Call this at app startup
 */
export const initializeEnvironment = (): EnvironmentConfig => {
  const config = getEnvironmentConfig();
  const validation = validateEnvironment();

  if (!validation.isValid) {
    if (config.isProduction) {
      throw new Error(`Environment validation failed: ${validation.errors.join(", ")}`);
    }
  }

  return config;
};

// Export the current environment configuration
export const environmentConfig = getEnvironmentConfig();
