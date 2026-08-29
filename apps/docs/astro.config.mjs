// @ts-check
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://country-kit.vercel.app',
  integrations: [react(), vue(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
