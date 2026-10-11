// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Set SITE_URL to the real public deployment URL when building.
const site = process.env.SITE_URL;
if (site && !/^https?:\/\//.test(site)) throw new Error('SITE_URL must be an absolute HTTP(S) URL');
export default defineConfig({
  site,
  vite: {
    plugins: [tailwindcss()],
  },
});
