import type { Meta, StoryObj } from '@storybook/react';
import { WelcomePage } from './WelcomePage';

const meta: Meta<typeof WelcomePage> = {
  title: 'Pages/WelcomePage',
  component: WelcomePage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof WelcomePage>;

export const Default: Story = {
  args: {},
}; 