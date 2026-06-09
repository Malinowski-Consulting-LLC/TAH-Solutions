// @ts-check
import { defineConfig } from 'astro/config';

// TAH Solutions — Astro configuration
// Static site for GitHub Pages deployment. No SSR, no adapters.
// All routes are pre-rendered to HTML at build time.
export default defineConfig({
  site: 'https://www.tahsolutions.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
