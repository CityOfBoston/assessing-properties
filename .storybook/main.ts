import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Constants for paths (matching vite.config.ts)
const USWDS_MODULE_PATH = '../node_modules/cob-uswds';
const USWDS_DIST_PATH = `${USWDS_MODULE_PATH}/dist`;
const USWDS_PACKAGES_PATH = `${USWDS_MODULE_PATH}/packages`;
const USWDS_DEST_PATH = 'assets/uswds';

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
    { from: `${USWDS_DIST_PATH}/fonts`, to: '/assets/uswds/fonts' },
    { from: `${USWDS_DIST_PATH}/img`, to: '/assets/uswds/img' },
  ],
  docs: {
    autodocs: true,
  },
  async viteFinal(config) {
    return {
      ...config,
      plugins: [
        ...(config.plugins || []),
        viteStaticCopy({
          targets: [
            {
              src: `${USWDS_DIST_PATH.replace('../', '')}/fonts`,
              dest: USWDS_DEST_PATH,
            },
            {
              src: `${USWDS_DIST_PATH.replace('../', '')}/img`,
              dest: USWDS_DEST_PATH,
            },
          ],
        }),
      ],
      resolve: {
        alias: {
          '@cob-components': path.resolve(__dirname, USWDS_PACKAGES_PATH)
        },
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
    };
  },
};

export default config;