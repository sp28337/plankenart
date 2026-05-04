import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';

import node from "@astrojs/node";

export default defineConfig({
  vite: {
      plugins: [tailwindcss()],
  },
  security: {
    checkOrigin: false,
  },
  image: {
      service: {
          config: {
              quality: 90,
          }
      }
  },

  // site: 'https://plankenart.ru',
  site: 'https://plankenart.sp28337.site',

  integrations: [
      sitemap(), 
      markdoc(),
  ],

  fonts: [
      {
          provider: fontProviders.google(),
          name: "Manrope",
          cssVariable: "--font-manrope",
          weights: [300, 400, 500, 600, 700, 800],
          subsets: ["latin", "cyrillic"],
  },
      {
          provider: fontProviders.google(),
          name: "Inter",
          cssVariable: "--font-inter",
          weights: [500, 600, 700, 900],
          subsets: ["latin", "cyrillic"],
      }
  ],

  adapter: node({
    mode: "standalone"
  })
});