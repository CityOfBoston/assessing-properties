import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Constants for paths
const USWDS_MODULE_PATH = 'node_modules/cob-uswds';
const USWDS_DIST_PATH = `${USWDS_MODULE_PATH}/dist`;
const USWDS_PACKAGES_PATH = `${USWDS_MODULE_PATH}/packages`;
const USWDS_DEST_PATH = 'assets/uswds';

export default defineConfig({
  // Core plugins
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: `${USWDS_DIST_PATH}/fonts`,
          dest: USWDS_DEST_PATH,
        },
        {
          src: `${USWDS_DIST_PATH}/img`,
          dest: USWDS_DEST_PATH,
        },
      ],
    }),
  ],
  
  // Path resolution
  resolve: {
    alias: {
      '@cob-components': path.resolve(__dirname, USWDS_PACKAGES_PATH)
    },
  },
  
  // CSS processing
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [
          path.resolve(__dirname, USWDS_PACKAGES_PATH),
        ],
      },
    },
  },
  
  // Build options
  build: {
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});