const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    extend: {
      colors: {
        lightgreen: '#5e8332',
        darkgreen: '#21391f'
      }
    },
  },
  plugins: [],
};
