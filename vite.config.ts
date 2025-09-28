/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { extname, relative, resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  publicDir: false,
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      // input: see https://rollupjs.org/configuration-options/#input
      // entry points will be bundled to separate output chunks
      // so that we can import them individually (tree-shaking)
      // e.g. import { Result } from 'react-async-cases/Result'
      input: Object.fromEntries(
        glob
          .sync('lib/**/*.{ts,tsx}', {
            ignore: ['lib/**/*.d.ts'],
          })
          .map((file) => [
            relative('lib', file.slice(0, file.length - extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    dir: './tests',
    setupFiles: './tests/testsSetup.ts',
    css: false,
  },
});
