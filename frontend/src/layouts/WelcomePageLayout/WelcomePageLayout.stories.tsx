import type { Meta, StoryObj } from '@storybook/react';
import WelcomePageLayout from './WelcomePageLayout';

const meta = {
  title: 'Layouts/WelcomePageLayout',
  component: WelcomePageLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WelcomePageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ 
        color: 'white', 
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1>Welcome to Properties</h1>
      </div>
    ),
  },
};

export const ShortContent: Story = {
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
          opacity: 0.9,
          marginBottom: '2rem'
        }}>
          Find detailed information about properties in Boston. Whether you're a 
          homeowner, business owner, researcher, or real estate professional, 
          use this tool to find assessed value, location, ownership, and tax 
          information for any parcel in the city.
        </p>
        <input 
          type="search"
          placeholder="Enter address or parcel ID"
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '0.5rem',
            margin: '0 auto'
          }}
        />
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    children: (
      <div style={{ 
        color: 'white', 
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Welcome to Properties
        </h1>
        <p style={{ 
          fontSize: '1.25rem',
          lineHeight: 1.5,
          opacity: 0.9,
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Find detailed information about properties in Boston. Whether you're a 
          homeowner, business owner, researcher, or real estate professional, 
          use this tool to find assessed value, location, ownership, and tax 
          information for any parcel in the city.
        </p>
        <input 
          type="search"
          placeholder="Enter address or parcel ID"
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '0.5rem',
            margin: '0 auto',
            display: 'block'
          }}
        />
        
        {/* Additional content that will cause scrolling when banner is opened */}
        <div style={{ marginTop: '4rem' }}>
          {Array(6).fill(null).map((_, index) => (
            <div key={index} style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h2 style={{ 
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: 'white'
              }}>
                Section {index + 1}
              </h2>
              <p style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                opacity: 0.9
              }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at ligula eget 
                lorem efficitur facilisis. Vivamus eget massa a nisi ultrices vestibulum. 
                Sed molestie felis ut ex ultrices, in faucibus tortor lacinia.
              </p>
              <p style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                opacity: 0.9,
                marginTop: '1rem'
              }}>
                Praesent euismod nisi vel metus vestibulum, at lacinia massa pulvinar. 
                Donec sit amet odio at nunc tincidunt malesuada nec a enim. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
}; 