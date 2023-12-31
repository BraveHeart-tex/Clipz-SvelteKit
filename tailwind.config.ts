import {
  frutigerAero,
  galacticVibes,
  livelySpectrum,
  midnightVibes
} from './src/lib/themes';
import { join } from 'path';
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import forms from '@tailwindcss/forms';

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(
      require.resolve('@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  theme: {
    extend: {}
  },
  plugins: [
    typography,
    forms,
    skeleton({
      themes: {
        preset: [
          {
            name: 'crimson',
            enhancements: true
          }
        ],
        custom: [midnightVibes, galacticVibes, livelySpectrum, frutigerAero]
      }
    })
  ]
} satisfies Config;
