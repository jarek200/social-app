import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";
import { loadEnv } from "vite";

// Get environment from process.env or default to 'sandbox'
const environment = process.env.NODE_ENV || 'sandbox';

// Load .env variables for the current mode (Amplify copies config.env -> .env)
const env = loadEnv(environment, process.cwd(), "");

/** @type {import('astro').AstroUserConfig} */
export default {
  srcDir: "./src",
  output: "static",
  server: {
    port: 4321,
    host: true,
  },
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
    preact(),
  ],
  site: "https://social-app-prototype.example.com",
  experimental: {
    clientPrerender: true,
  },
  vite: {
    define: {
      // Environment-specific configuration
      'import.meta.env.PUBLIC_AMPLIFY_ENV': JSON.stringify(env.PUBLIC_AMPLIFY_ENV || environment),
      'import.meta.env.PUBLIC_COGNITO_USER_POOL_ID': JSON.stringify(env.PUBLIC_COGNITO_USER_POOL_ID || process.env.PUBLIC_COGNITO_USER_POOL_ID || 'eu-west-2_boO0PSf3X'),
      'import.meta.env.PUBLIC_COGNITO_USER_POOL_CLIENT_ID': JSON.stringify(env.PUBLIC_COGNITO_USER_POOL_CLIENT_ID || process.env.PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '3k945a6j9p1nb2nl6pup1epdbu'),
      'import.meta.env.PUBLIC_APPSYNC_URL': JSON.stringify(env.PUBLIC_APPSYNC_URL || process.env.PUBLIC_APPSYNC_URL || 'https://5m7pbhxsqffrvp5binqipcyu5e.appsync-api.eu-west-2.amazonaws.com/graphql'),
      'import.meta.env.PUBLIC_AWS_REGION': JSON.stringify(env.PUBLIC_AWS_REGION || process.env.PUBLIC_AWS_REGION || 'eu-west-2'),
      'import.meta.env.PUBLIC_S3_BUCKET': JSON.stringify(env.PUBLIC_S3_BUCKET || process.env.PUBLIC_S3_BUCKET || 'social-app-sandbox-bucket'),
      'import.meta.env.PUBLIC_DEMO_MODE': JSON.stringify(env.PUBLIC_DEMO_MODE || process.env.PUBLIC_DEMO_MODE || 'false'),
    },
    resolve: {
      alias: {
        "@components": "/src/components",
        "@pages": "/src/pages",
        "@stores": "/src/stores",
        "@utils": "/src/utils",
        "@layouts": "/src/layouts",
        "@config": "/src/config",
        "@services": "/src/services",
        "@web": "/src",
      },
    },
  },
};
