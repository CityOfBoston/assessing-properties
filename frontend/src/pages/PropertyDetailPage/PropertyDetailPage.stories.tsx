import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PropertyDetailPage from './PropertyDetailPage';

const meta = {
  title: 'Pages/PropertyDetailPage',
  component: PropertyDetailPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PropertyDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithParcelId: Story = {
  parameters: {
    reactRouter: {
      searchParams: { parcelId: '1234567890' },
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
      searchParams: { parcelId: 'invalid' },
    },
  },
}; 