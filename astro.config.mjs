// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

import { readdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The public URL of the deployed concept. Override with SITE_URL on Vercel
// if the site lives somewhere else.
const site = process.env.SITE_URL ?? 'https://driftwood.nuit.works';

// `astro dev` encodes each image on request, so it uses the fastest encoder
// settings. Builds spend the time on smaller files.
const isDev = process.argv.includes('dev');
const effort = isDev ? { avif: { effort: 0 }, webp: { effort: 0 } } : { avif: { effort: 6 }, webp: { effort: 6 } };

/**
 * astro:assets copies every imported JPEG master into dist/_astro, even when
 * only the AVIF/WebP versions are used. Remove the ones nothing references.
 *
 * @returns {import('astro').AstroIntegration}
 */
const pruneUnusedMasters = () => ({
  name: 'prune-unused-masters',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const out = fileURLToPath(dir);
      const files = await readdir(out, { recursive: true });
      const text = files.filter((f) => /\.(html|css|js|xml|txt|webmanifest|json)$/.test(f));
      let haystack = '';
      for (const f of text) haystack += await readFile(join(out, f), 'utf8');
      const masters = files.filter((f) => /_astro[\\/][^\\/]+\.(jpe?g)$/.test(f));
      let removed = 0;
      for (const f of masters) {
        const name = f.split(/[\\/]/).pop() ?? '';
        if (!haystack.includes(name)) {
          await rm(join(out, f));
          removed++;
        }
      }
      logger.info(`removed ${removed} unreferenced image masters`);
    },
  },
});

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [
    preact(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
    pruneUnusedMasters(),
  ],
  // Fetch a page as soon as the pointer rests on (or focus reaches) its link,
  // so most navigations are instant.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  image: {
    // Sharp, plus exact focal-point crops (see src/lib/focal-sharp.ts).
    // Spend a little more build time for noticeably smaller files.
    service: {
      entrypoint: './src/lib/focal-sharp.ts',
      config: effort,
    },
    // Default breakpoints are tuned for phones up to wide desktop screens.
    breakpoints: [360, 480, 640, 828, 1080, 1280, 1600, 2000, 2400],
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-serif',
      fallbacks: ['Garamond', 'Georgia', 'serif'],
      display: 'swap',
      options: {
        variants: [
          { src: ['./src/assets/fonts/cormorant-garamond-300.woff2'], weight: '300', style: 'normal' },
          { src: ['./src/assets/fonts/cormorant-garamond-400.woff2'], weight: '400', style: 'normal' },
          { src: ['./src/assets/fonts/cormorant-garamond-300-italic.woff2'], weight: '300', style: 'italic' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Jost',
      cssVariable: '--font-sans',
      fallbacks: ['Futura', 'Avenir', 'Arial', 'sans-serif'],
      display: 'swap',
      options: {
        variants: [
          { src: ['./src/assets/fonts/jost-300.woff2'], weight: '300', style: 'normal' },
          { src: ['./src/assets/fonts/jost-400.woff2'], weight: '400', style: 'normal' },
        ],
      },
    },
  ],
});
