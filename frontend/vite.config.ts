import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

/**
 * USWDS Configuration
 * 
 * This configuration is for integrating the COB-USWDS design system.
 * We use relative paths to ensure assets are properly loaded in both development and production.
 */

// Path constants for USWDS assets
const USWDS_MODULE_PATH = 'node_modules/cob-uswds';
const USWDS_DIST_PATH = `${USWDS_MODULE_PATH}/dist`;
const USWDS_PACKAGES_PATH = `${USWDS_MODULE_PATH}/packages`;

// USWDS assets to copy
const USWDS_ASSETS = ['fonts', 'img', 'js'].map(folder => ({
  src: `${USWDS_DIST_PATH}/${folder}`,
  dest: 'cob-uswds',
}));

// USWDS script paths (kept external from bundling)
const USWDS_SCRIPTS = [
  './cob-uswds/js/uswds-init.min.js',
  './cob-uswds/js/cob-uswds.min.js',
];

export default defineConfig({
  /**
   * Base configuration
   * Using './' for base path instead of default '/'
   */
  base: './',
  
  /**
   * Plugins configuration
   */
  plugins: [
    // React plugin for JSX handling
    react(),
    
    // Static asset copy plugin for USWDS resources
    viteStaticCopy({
      targets: USWDS_ASSETS,
      // The writeBundle hook ensures assets are copied during the build process
      hook: 'writeBundle',
    }),
  ],
  
  /**
   * Path resolution and aliases
   * 
   * Aliases make imports cleaner throughout the application
   */
  resolve: {
    alias: {
      // USWDS components alias
      '@cob-uswds-components': path.resolve(__dirname, USWDS_PACKAGES_PATH),
      
      // Add application-specific aliases
      '@src': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@containers': path.resolve(__dirname, 'src/containers'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
  
  /**
   * CSS processing configuration
   */
  css: {
    preprocessorOptions: {
      scss: {
        // Include USWDS paths for SCSS imports
        includePaths: [
          path.resolve(__dirname, USWDS_PACKAGES_PATH),
        ],
      },
    },
  },
  
  /**
   * Build configuration
   */
  build: {
    // Clean out the dist directory every time we build
    emptyOutDir: true,
    // Rollup-specific options
    rollupOptions: {
      // Keep USWDS scripts external (not bundled)
      external: USWDS_SCRIPTS,
    },
  }
});