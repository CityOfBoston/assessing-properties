import WelcomePageLayout from './WelcomePageLayout';
import type { Meta, StoryObj } from '@storybook/react';
import { WelcomeContent } from '../../components/WelcomeContent';

const meta = {
  title: 'Layouts/WelcomePageLayout',
  component: WelcomePageLayout,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WelcomePageLayout>;

export default meta;
type Story = StoryObj<typeof WelcomePageLayout>;

const SearchResults = () => (
  <div style={{ padding: '20px' }}>
    <h1>Search Results</h1>
    {Array(10).fill(null).map((_, index) => (
      <div key={index} style={{ padding: '30px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
        <h2>Result {index + 1}</h2>
        <p>
          This is a sample search result to demonstrate how the layout handles content.
          The header will stick to the top of the viewport when scrolling past the banner.
        </p>
      </div>
    ))}
  </div>
);

export const EmptyState: Story = {
  args: {
    welcomeContent: <WelcomeContent />,
    searchResults: null,
  },
};

export const WithResults: Story = {
  args: {
    welcomeContent: <WelcomeContent />,
    searchResults: <SearchResults />,
  },
}; 