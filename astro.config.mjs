// @ts-check
import { defineConfig } from 'astro/config';

// TAH Solutions — Astro configuration
// Static site for GitHub Pages deployment. No SSR, no adapters.
// All routes are pre-rendered to HTML at build time.
//
// `base: '/TAH-Solutions'` is set because the project is currently
// served as a GitHub Pages project page at
//   https://malinowski-consulting-llc.github.io/TAH-Solutions/
// When the custom domain tahsolutions.com is live, this can be
// removed (and `site` updated to https://tahsolutions.com).
export default defineConfig({
  site: 'https://malinowski-consulting-llc.github.io',
  base: '/TAH-Solutions',
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
