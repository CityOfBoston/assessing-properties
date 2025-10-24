import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import type { LogErrorOptions, ViteDevServer } from 'vite';
import yaml from 'js-yaml';

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
  '/cob-uswds/js/uswds-init.min.js',
  '/cob-uswds/js/cob-uswds.min.js',
];

// Custom plugin to handle pre-transform errors during development mode
const uswdsErrorHandler = {
  name: 'uswds-error-handler',
  configureServer(server: ViteDevServer) {
    const originalError = server.config.logger.error;
    server.config.logger.error = (msg: string, ...args: unknown[]) => {
      if (msg.includes('uswds-init.min.js') || msg.includes('cob-uswds.min.js')) {
        return;
      }
      originalError(msg, ...args as [LogErrorOptions | undefined]);
    };
  }
};

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

    // Custom plugin to handle USWDS script errors
    uswdsErrorHandler,
    
    // YAML loader plugin
    {
      name: 'yaml-loader',
      transform(code, id) {
        if (id.endsWith('.yaml') || id.endsWith('.yml')) {
          try {
            const data = yaml.load(code, { json: true });
            return {
              code: `export default ${JSON.stringify(data, null, 2)};`,
              map: null
            };
          } catch (error) {
            this.error('Error parsing YAML: ' + error.message);
            return null;
          }
        }
      }
    },
  ],
  
  /**
   * Path resolution and aliases
   * 
   * Aliases make imports cleaner throughout the application
   */
  resolve: {
    alias: [
      // USWDS components alias
      { find: '@cob-uswds-components', replacement: path.resolve(__dirname, USWDS_PACKAGES_PATH) },
      
      // Add application-specific aliases
      { find: '@src', replacement: path.resolve(__dirname, 'src') },
      { find: '@layouts', replacement: path.resolve(__dirname, 'src/layouts') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@styles', replacement: path.resolve(__dirname, 'src/styles') },
      { find: '@containers', replacement: path.resolve(__dirname, 'src/containers') },
      { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },
      { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@types', replacement: path.resolve(__dirname, 'src/types') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
      { find: '@services', replacement: path.resolve(__dirname, 'src/services') },
      { find: '@presenters', replacement: path.resolve(__dirname, 'src/presenters') },
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.yaml', '.yml'],
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