import type { Meta, StoryObj } from '@storybook/react';
import { SearchBackground } from './SearchBackground';

const meta = {
  title: 'Components/SearchBackground',
  component: SearchBackground,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ 
        color: 'white', 
        textAlign: 'center', 
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          Welcome to Properties
        </h1>
        <p style={{ 
          fontSize: '1.25rem',
          lineHeight: 1.5,
          opacity: 0.9
        }}>
          Find detailed information about properties in Boston. Whether you're a 
          homeowner, business owner, researcher, or real estate or legal 
          professional, use this tool to find assessed value, location, 
          ownership, and tax information for any parcel in the city.
        </p>
      </div>
    ),
  },
};

export const WithSearchBar: Story = {
  args: {
    children: (
      <div style={{ 
        color: 'white', 
        textAlign: 'center', 
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          Welcome to Properties
        </h1>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '8px',
          margin: '2rem 0'
        }}>
          <input 
            type="search"
            placeholder="Enter address or parcel ID"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'white'
            }}
          />
        </div>
        <p style={{ 
          fontSize: '1.25rem',
          lineHeight: 1.5,
          opacity: 0.9
        }}>
          Find detailed information about properties in Boston. Whether you're a 
          homeowner, business owner, researcher, or real estate or legal 
          professional, use this tool to find assessed value, location, 
          ownership, and tax information for any parcel in the city.
        </p>
      </div>
    ),
  },
}; 