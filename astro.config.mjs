import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	site: 'https://plankenart.ru',
	integrations: [sitemap()],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Manrope",
			cssVariable: "--font-manrope",
			weights: [500, 600, 700]
  	},
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-inter",
			weights: [500, 600, 700],
		}
	]
});
