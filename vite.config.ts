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
  //This 'define' fixes error:  ReferenceError: process is not defined at node_modules/@pythnetwork/pyth-solana-receiver/node_modules/@coral-xyz/anchor/dist/cjs/utils/common.js
  define: {
    'process.env': {},
  },
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
      //'buffer': 'rollup-plugin-node-polyfills/polyfills/buffer-es6.js',//Fixes error: The requested module '/node_modules/.vite/deps/buffer.js?v=ec4d0658' does not provide an export named 'default'. When using this line: import { Buffer } from "buffer",
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  /*//Fixes warning: Module "buffer" has been externalized for browser compatibility. Cannot access "buffer.Buffer" in client code.
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeModulesPolyfillPlugin(),
      ],
    }
  },*/
  //Fixes solana .all() method/buffer issues, and "Reached maximum depth for account resolution" Error in production when contracts are called
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),
      ]
    },
  }
})