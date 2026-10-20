import { defineConfig, fontProviders, envField} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";


import preact from "@astrojs/preact";


export default defineConfig({
  env: {
  schema:{
    RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
    TURNSTILE_SITE_KEY: envField.string({ context: "client", access: "public"}),
    TURNSTILE_SECRET_KEY: envField.string({ context: "server", access: "secret"})   
  }
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ["sileo", "motion", "framer-motion"],
    },
  },


  fonts: [
    {
      provider: fontProviders.local(),
      name: "Inter",
      cssVariable: "--font-inter",
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/inter-latin-400-normal.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/inter-latin-500-normal.woff2"],
          },
          {
            weight: 600,
            style: "normal",
            src: ["./src/assets/fonts/inter-latin-600-normal.woff2"],
          },

          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/inter-latin-700-normal.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "JetBrains Mono",
      fallbacks: ["monospace"],
      cssVariable: "--font-jetbrains",
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/jetbrains-mono-latin-400-normal.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/jetbrains-mono-latin-500-normal.woff2"],
          },
          {
            weight: 600,
            style: "normal",
            src: ["./src/assets/fonts/jetbrains-mono-latin-600-normal.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Plus Jakarta Sans",
      cssVariable: "--font-plus-jakarta-sans",
      options: {
        variants: [
          {
            weight: 600,
            style: "normal",
            src: ["./src/assets/fonts/plus-jakarta-sans-latin-600-normal.woff2"],
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/plus-jakarta-sans-latin-700-normal.woff2"],
          },
          {
            weight: 800,
            style: "normal",
            src: ["./src/assets/fonts/plus-jakarta-sans-latin-800-normal.woff2"],
          },
        ],
      },
    },
  ],

  adapter: netlify({
    devFeatures: {
      images: true,
      environmentVariables: false,
      edgeFunctions: false,
    },
  }),

  integrations: [preact({ compat: true})],
});