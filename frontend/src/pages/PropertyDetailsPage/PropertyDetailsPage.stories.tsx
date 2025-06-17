import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PropertyDetailsPage from './PropertyDetailsPage';

const meta = {
  title: 'Pages/PropertyDetailsPage',
  component: PropertyDetailsPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story, context) => {
      // Get the search params from the story parameters
      const searchParams = new URLSearchParams(
        context.parameters.reactRouter?.searchParams || {}
      ).toString();
      
      return (
        <MemoryRouter initialEntries={[`/details${searchParams ? `?${searchParams}` : ''}`]}>
          <Routes>
            <Route path="/details" element={<Story />} />
          </Routes>
        </MemoryRouter>
      );
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PropertyDetailsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithParcelId: Story = {
  parameters: {
    reactRouter: {
      searchParams: {
        parcelId: '1234567890',
      },
    },
  },
};

export const WithoutParcelId: Story = {
  parameters: {
    reactRouter: {
      searchParams: {},
    },
  },
};

export const WithInvalidParcelId: Story = {
  parameters: {
    reactRouter: {
      searchParams: {
        parcelId: 'invalid',
      },
    },
  },
}; 