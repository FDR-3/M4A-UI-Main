/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { vite as vidstack } from 'vidstack/plugins';
import { defineConfig } from 'vite';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'; // Note: This is for Rollup in production build

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
        template: {
            compilerOptions: {
                isCustomElement: (tag) => ['media-player', 'media-provider', 'media-plyr-layout'].includes(tag), 
            }
        }
    }),
    legacy(),
    vidstack()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  //Fixes warning: Module "buffer" has been externalized for browser compatibility. Cannot access "buffer.Buffer" in client code.
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  //Fixes solana .all() method/buffer issues, and "Reached maximum depth for account resolution" Error in production when contracts are called
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),
      ]
    },
  }
})
