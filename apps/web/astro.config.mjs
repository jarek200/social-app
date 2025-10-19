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
      'import.meta.env.PUBLIC_COGNITO_USER_POOL_ID': JSON.stringify(process.env.PUBLIC_COGNITO_USER_POOL_ID),
      'import.meta.env.PUBLIC_COGNITO_USER_POOL_CLIENT_ID': JSON.stringify(process.env.PUBLIC_COGNITO_USER_POOL_CLIENT_ID),
      'import.meta.env.PUBLIC_APPSYNC_URL': JSON.stringify(process.env.PUBLIC_APPSYNC_URL),
      'import.meta.env.PUBLIC_AWS_REGION': JSON.stringify(process.env.PUBLIC_AWS_REGION),
      'import.meta.env.PUBLIC_S3_BUCKET': JSON.stringify(process.env.PUBLIC_S3_BUCKET),
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
