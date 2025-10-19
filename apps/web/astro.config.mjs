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
