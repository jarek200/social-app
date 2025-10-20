import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

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
      'import.meta.env.PUBLIC_COGNITO_USER_POOL_ID': JSON.stringify(process.env.PUBLIC_COGNITO_USER_POOL_ID || 'eu-west-2_boO0PSf3X'),
      'import.meta.env.PUBLIC_COGNITO_USER_POOL_CLIENT_ID': JSON.stringify(process.env.PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '3k945a6j9p1nb2nl6pup1epdbu'),
      'import.meta.env.PUBLIC_APPSYNC_URL': JSON.stringify(process.env.PUBLIC_APPSYNC_URL || 'https://5m7pbhxsqffrvp5binqipcyu5e.appsync-api.eu-west-2.amazonaws.com/graphql'),
      'import.meta.env.PUBLIC_AWS_REGION': JSON.stringify(process.env.PUBLIC_AWS_REGION || 'eu-west-2'),
      'import.meta.env.PUBLIC_S3_BUCKET': JSON.stringify(process.env.PUBLIC_S3_BUCKET || 'social-app-sandbox-bucket'),
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
