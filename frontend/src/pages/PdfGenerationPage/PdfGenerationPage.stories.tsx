import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PdfGenerationPage from './PdfGenerationPage';

const meta = {
  title: 'Pages/PdfGenerationPage',
  component: PdfGenerationPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
          PDF Generation Page for property tax forms.
          
          ## Features
          - Two-stage flow: review and generate
          - Property details display
          - PDF viewer with print/download
          - Loading and error states
          - Responsive design
        `,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const { args } = context;
      const searchParams = new URLSearchParams(args as Record<string, string>);
      
      return (
        <MemoryRouter initialEntries={[`/form?${searchParams.toString()}`]}>
          <Routes>
            <Route path="/form" element={<Story />} />
          </Routes>
        </MemoryRouter>
      );
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PdfGenerationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResidentialExemption: Story = {
  args: {
    parcelId: '0123456789',
    formType: 'residential',
  } as any,
};

export const PersonalExemption: Story = {
  args: {
    parcelId: '0123456789',
    formType: 'personal',
  } as any,
};

export const Abatement: Story = {
  args: {
    parcelId: '0123456789',
    formType: 'abatement',
  } as any,
};

