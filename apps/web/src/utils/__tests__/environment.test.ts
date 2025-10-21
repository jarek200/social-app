import { describe, it, expect, vi, beforeEach } from "vitest";
import { detectEnvironment, getEnvironmentConfig, validateEnvironment } from "../environment";

describe("Environment Utils", () => {
  beforeEach(() => {
    // Reset environment variables
    vi.stubGlobal("import", {
      meta: {
        env: {
          PUBLIC_AMPLIFY_ENV: undefined,
          PUBLIC_AWS_REGION: undefined,
          PUBLIC_APPSYNC_URL: undefined,
          PUBLIC_S3_BUCKET: undefined,
          PUBLIC_COGNITO_USER_POOL_ID: undefined,
          PUBLIC_COGNITO_USER_POOL_CLIENT_ID: undefined,
          PUBLIC_DEMO_MODE: undefined,
        },
      },
    });

    // Mock window object
    Object.defineProperty(window, "location", {
      value: {
        hostname: "localhost",
        href: "http://localhost:4321",
      },
      writable: true,
    });
  });

  describe("detectEnvironment", () => {
    it("should detect development environment", () => {
      const env = detectEnvironment();
      expect(env).toBe("development");
    });

    it("should detect production environment", () => {
      Object.defineProperty(window, "location", {
        value: {
          hostname: "app.example.com",
          href: "https://app.example.com",
        },
        writable: true,
      });

      const env = detectEnvironment();
      expect(env).toBe("production");
    });

    it("should detect staging environment", () => {
      Object.defineProperty(window, "location", {
        value: {
          hostname: "staging.example.com",
          href: "https://staging.example.com",
        },
        writable: true,
      });

      const env = detectEnvironment();
      expect(env).toBe("staging");
    });

    it("should use explicit environment variable", () => {
      vi.stubGlobal("import", {
        meta: {
          env: {
            PUBLIC_AMPLIFY_ENV: "production",
          },
        },
      });

      const env = detectEnvironment();
      expect(env).toBe("production");
    });
  });

  describe("getEnvironmentConfig", () => {
    it("should return development config", () => {
      const config = getEnvironmentConfig();
      expect(config.environment).toBe("development");
      expect(config.debugMode).toBe(true);
      expect(config.features.analytics).toBe(false);
    });

    it("should return production config", () => {
      vi.stubGlobal("import", {
        meta: {
          env: {
            PUBLIC_AMPLIFY_ENV: "production",
          },
        },
      });

      const config = getEnvironmentConfig();
      expect(config.environment).toBe("production");
      expect(config.debugMode).toBe(false);
      expect(config.features.analytics).toBe(true);
    });
  });

  describe("validateEnvironment", () => {
    it("should validate with all required variables", () => {
      vi.stubGlobal("import", {
        meta: {
          env: {
            PUBLIC_APPSYNC_URL: "https://api.example.com/graphql",
            PUBLIC_S3_BUCKET: "my-bucket",
            PUBLIC_COGNITO_USER_POOL_ID: "us-east-1_123456",
            PUBLIC_COGNITO_USER_POOL_CLIENT_ID: "client123",
          },
        },
      });

      const validation = validateEnvironment();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should fail validation with missing variables", () => {
      const validation = validateEnvironment();
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });

    it("should fail validation with invalid URL", () => {
      vi.stubGlobal("import", {
        meta: {
          env: {
            PUBLIC_APPSYNC_URL: "not-a-url",
            PUBLIC_S3_BUCKET: "my-bucket",
            PUBLIC_COGNITO_USER_POOL_ID: "us-east-1_123456",
            PUBLIC_COGNITO_USER_POOL_CLIENT_ID: "client123",
          },
        },
      });

      const validation = validateEnvironment();
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some((error) => error.includes("Invalid API URL"))).toBe(true);
    });
  });
});
