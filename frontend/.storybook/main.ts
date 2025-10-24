import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import fs from 'fs';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import yaml from 'js-yaml';

/**
 * USWDS Configuration
 * 
 * This configuration is for integrating the COB-USWDS design system.
 * We use relative paths to ensure assets are properly loaded in both development and production.
 */

// Path constants for USWDS assets
const USWDS_MODULE_PATH = path.resolve(__dirname, '../node_modules/cob-uswds');
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

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-viewport',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: [
    { from: path.resolve(USWDS_DIST_PATH, 'fonts'), to: 'cob-uswds/fonts' },
    { from: path.resolve(USWDS_DIST_PATH, 'img'), to: 'cob-uswds/img' },
    { from: path.resolve(USWDS_DIST_PATH, 'js'), to: 'cob-uswds/js' },
  ],
  docs: {
    autodocs: true,
  },
  async viteFinal(config) {
    // Filter out any existing YAML plugins to avoid conflicts
    const filteredPlugins = (config.plugins || []).filter((plugin: any) => {
      const pluginName = plugin && typeof plugin === 'object' && 'name' in plugin ? plugin.name : '';
      return pluginName !== 'yaml-loader' && pluginName !== 'vite:yaml';
    });

    return {
      ...config,
      base: './',
      plugins: [
        // YAML loader plugin - must be first to intercept YAML files
        {
          name: 'yaml-loader',
          enforce: 'pre',
          load(id) {
            if (id.endsWith('.yaml') || id.endsWith('.yml')) {
              try {
                const yamlContent = fs.readFileSync(id, 'utf8');
                const data = yaml.load(yamlContent, { json: true });
                return `export default ${JSON.stringify(data, null, 2)};`;
              } catch (error) {
                this.error('Error parsing YAML: ' + error.message);
                return null;
              }
            }
          }
        },
        ...filteredPlugins,
        viteStaticCopy({
          targets: USWDS_ASSETS,
          hook: 'writeBundle',
        }),
      ],
      resolve: {
        alias: {
          // USWDS components alias
          '@cob-uswds-components': path.resolve(__dirname, USWDS_PACKAGES_PATH),
          
          // Application-specific aliases
          '@src': path.resolve(__dirname, '../src'),
          '@components': path.resolve(__dirname, '../src/components'),
          '@layouts': path.resolve(__dirname, '../src/layouts'),
          '@styles': path.resolve(__dirname, '../src/styles'),
          '@containers': path.resolve(__dirname, '../src/containers'),
          '@assets': path.resolve(__dirname, '../src/assets'),
          '@hooks': path.resolve(__dirname, '../src/hooks'),
          '@pages': path.resolve(__dirname, '../src/pages'),
          '@types': path.resolve(__dirname, '../src/types'),
          '@utils': path.resolve(__dirname, '../src/utils'),
          '@services': path.resolve(__dirname, '../src/services'),
          '@presenters': path.resolve(__dirname, '../src/presenters'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.yaml', '.yml'],
      },
      css: {
        preprocessorOptions: {
          scss: {
            includePaths: [
              path.resolve(__dirname, USWDS_PACKAGES_PATH),
            ],
          },
        },
      },
      build: {
        emptyOutDir: true,
        rollupOptions: {
          external: USWDS_SCRIPTS,
        },
      },
    };
  },
};

export default config;