import type { Meta, StoryObj } from '@storybook/react';
import SearchResultsLayout from './SearchResultsLayout';

const meta = {
  title: 'Layouts/SearchResultsLayout',
  component: SearchResultsLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchResultsLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchContent: (
      <div style={{ 
        color: 'white', 
        textAlign: 'center',
        padding: '1rem'
      }}>
        <input 
          type="search"
          placeholder="Search"
          style={{ width: '100%', maxWidth: '600px' }}
        />
      </div>
    ),
    children: (
      <div>
        <h2>Results will appear here</h2>
      </div>
    ),
  },
};

export const WithContent: Story = {
  args: {
    searchContent: (
      <div style={{ 
        color: 'white', 
        textAlign: 'center',
        padding: '1rem'
      }}>
        <input 
          type="search"
          placeholder="123 Main St"
          style={{ width: '100%', maxWidth: '600px' }}
        />
      </div>
    ),
    children: (
      <div>
        <h2>Search Results</h2>
        <div style={{ marginTop: '1rem' }}>
          {Array(5).fill(null).map((_, index) => (
            <div key={index} style={{ 
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid #ddd'
            }}>
              <h3>Result {index + 1}</h3>
              <p>Sample property information would appear here.</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
}; 