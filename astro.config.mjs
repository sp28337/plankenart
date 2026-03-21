import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import mdx from "@astrojs/mdx";

export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    site: 'https://plankenart.ru',
    integrations: [sitemap(), mdx()],
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
    ]
});