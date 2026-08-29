// @ts-check
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://country-kit.vercel.app',
  integrations: [tailwind({ applyBaseStyles: false }), react(), vue()],
});
