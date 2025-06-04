import type { Meta, StoryObj } from '@storybook/react';
import WelcomePage from './WelcomePage';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof WelcomePage> = {
  title: 'Pages/WelcomePage',
  component: WelcomePage,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof WelcomePage>;

export const Default: Story = {}; 