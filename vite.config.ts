import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
    // ...,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  envDir: './env',
  server: {
    host: true,
    hmr: true,
    port: 3000,
  },
  preview: {
    port: 4000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    modulePreload: { polyfill: true },
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const packageName = id.split('node_modules/')[1].split('/')[0];
            // const knownEmptyPackages = [
            // 	'detect-node-es',
            // 	'goober',
            // 	'html-parse-stringify',
            // 	'react-scan',
            // 	'solid-js',
            // 	'void-elements',
            // ];

            // // Avoid creating chunks for known empty packages
            // if (knownEmptyPackages.includes(packageName)) {
            // 	return;
            // }

            return packageName;
          }
        },
      },
    },
  },
});
