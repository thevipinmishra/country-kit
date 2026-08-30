// @ts-check
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import starlightThemeNova from 'starlight-theme-nova';

const SITE = 'https://country-kit.vercel.app';
const DESCRIPTION =
  'ISO 3166-1 country data for TypeScript: codes, names, E.164 calling codes, UN M49 regions, IANA ccTLDs, ISO 4217 currencies, and SVG flags.';

const sidebar = [
  { label: 'Playground', link: '/' },
  { label: 'Getting started', slug: 'getting-started' },
  { label: 'Examples', link: '/examples/' },
  { label: 'Explorer', link: '/explorer/' },
  { label: 'Flags', link: '/flags/' },
  { label: 'API', slug: 'api' },
  { label: 'Data', slug: 'data' },
  { label: 'Changelog', slug: 'changelog' },
];

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: 'country-kit',
      description: DESCRIPTION,
      logo: {
        src: './src/assets/logo.svg',
        alt: 'country-kit',
      },
      favicon: '/favicon.svg',
      pagination: true,
      pagefind: true,
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/thevipinmishra/country-kit',
        },
      ],
      sidebar,
      plugins: [
        starlightThemeNova({
          nav: [
            { label: 'npm', href: 'https://www.npmjs.com/package/country-kit' },
          ],
        }),
      ],
      customCss: [
        '@fontsource/ibm-plex-sans/latin-400.css',
        '@fontsource/ibm-plex-sans/latin-500.css',
        '@fontsource/ibm-plex-sans/latin-600.css',
        '@fontsource/ibm-plex-mono/latin-400.css',
        '@fontsource/ibm-plex-mono/latin-500.css',
        './src/styles/global.css',
      ],
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#141210' } },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          content: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'country-kit',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Node.js',
            softwareVersion: '2.0.0',
            description: DESCRIPTION,
            url: SITE,
            downloadUrl: 'https://www.npmjs.com/package/country-kit',
            installUrl: 'https://www.npmjs.com/package/country-kit',
            codeRepository: 'https://github.com/thevipinmishra/country-kit',
            license: 'https://opensource.org/licenses/ISC',
            programmingLanguage: ['TypeScript', 'JavaScript'],
            author: { '@type': 'Person', name: 'Vipin Mishra' },
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        },
      ],
    }),
    react(),
    vue(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
