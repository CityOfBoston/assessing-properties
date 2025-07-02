import type { Meta, StoryObj } from '@storybook/react';
import WelcomePage from './WelcomePage';
import { BrowserRouter } from 'react-router-dom';
import { ParcelPairingsProvider } from '@hooks/useParcelPairingsContext';

const meta: Meta<typeof WelcomePage> = {
  title: 'Pages/WelcomePage',
  component: WelcomePage,
  decorators: [
    (Story) => (
      <ParcelPairingsProvider>
      <BrowserRouter>
        <Story />
      </BrowserRouter>
      </ParcelPairingsProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof WelcomePage>;

export const Default: Story = {}; 