import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte'],
  preprocess: [vitePreprocess()],
  exclude: ['svelte-sonner'],

  kit: {
    adapter: adapter(),
    alias: {
      $: './'
    }
  }
};
export default config;
