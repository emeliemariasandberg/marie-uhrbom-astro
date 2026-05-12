import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://marieuhrbom.se',
  base: process.env.BASE_PATH || undefined,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
