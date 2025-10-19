/**
 * Configuration files and environment setup
 *
 * This folder contains:
 * - .env.example - Environment variables template
 * - Environment-specific configurations
 * - Build and deployment configurations
 */

export const config = {
  // Environment configuration
  env: {
    development: {
      nodeVersion: ">=18.17",
      pnpmVersion: ">=8",
    },
    production: {
      nodeVersion: ">=18.17",
      pnpmVersion: ">=8",
    },
  },

  // Build configuration
  build: {
    outputDir: "dist",
    sourceDir: "src",
  },
};

export default config;
