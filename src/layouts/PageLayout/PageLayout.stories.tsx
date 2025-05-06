import PageLayout from './PageLayout';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Layouts/PageLayout',
    component: PageLayout,
    parameters: {
      layout: 'fullscreen',
    },
  } satisfies Meta<typeof PageLayout>;
  
  export default meta;
  type Story = StoryObj<typeof PageLayout>;
  
  export const LongContent: Story = {
    args: {
      children: (
        <div style={{ padding: '20px' }}>
          <h1>Page Layout Demo</h1>
          <p>
            This demo shows how the PageLayout component handles scrolling. The header will stick 
            to the top of the viewport when you scroll past the banner.
          </p>
          
          {/* Generate multiple sections to enable scrolling */}
          {Array(10).fill(null).map((_, index) => (
            <div key={index} style={{ padding: '30px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
              <h2>Section {index + 1}</h2>
              <p>
                This is a demo section to showcase the sticky header behavior of the PageLayout component.
                When scrolling down, the header will stick to the top of the viewport after the banner scrolls out of view.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at ligula eget lorem efficitur
                facilisis. Vivamus eget massa a nisi ultrices vestibulum. Sed molestie felis ut ex ultrices, 
                in faucibus tortor lacinia.
              </p>
            </div>
          ))}
        </div>
      ),
    },
  };

  export const ShortContent: Story = {
    args: {
      children: (
        <div style={{ padding: '20px' }}>
          <h1>Page Layout Demo</h1>
          <p>
            This demo shows how the PageLayout component handles scrolling. The header will stick 
            to the top of the viewport when you scroll past the banner.
          </p>
          {Array(1).fill(null).map((_, index) => (
            <div key={index} style={{ padding: '30px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
              <h2>Section {index + 1}</h2>
              <p>
                This is a demo section to showcase the sticky header behavior of the PageLayout component.
                When scrolling down, the header will stick to the top of the viewport after the banner scrolls out of view.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at ligula eget lorem efficitur
                facilisis. Vivamus eget massa a nisi ultrices vestibulum. Sed molestie felis ut ex ultrices, 
                in faucibus tortor lacinia.
              </p>
            </div>
          ))}
        </div>
      ),
    },
  };