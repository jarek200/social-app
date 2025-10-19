import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

/** @type {import('astro').AstroUserConfig} */
export default {
  srcDir: "./src",
  output: "static",
  integrations: [
    tailwind({
      applyBaseStyles: true
    }),
    preact()
  ],
  site: "https://social-app-prototype.example.com",
  experimental: {
    clientPrerender: true
  }
};
