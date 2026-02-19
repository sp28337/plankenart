import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	site: 'https://plankenart.ru',
	integrations: [sitemap()],
});
