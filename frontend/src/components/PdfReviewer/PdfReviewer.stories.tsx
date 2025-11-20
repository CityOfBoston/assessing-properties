import type { Meta, StoryObj } from '@storybook/react';
import PdfReviewer from './PdfReviewer';
import examplePdf from './example.pdf';

const meta = {
  title: 'Components/PdfReviewer',
  component: PdfReviewer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
          A component for reviewing generated PDF forms with print and download controls.
          
          ## Features
          - Embedded PDF viewer using iframe
          - Print and download functionality using IconButton
          - Responsive design
          - Accessibility support
          - Action callbacks for analytics
          
          The story uses an example PDF to demonstrate the component's functionality.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PdfReviewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pdfUrl: examplePdf,
    fileName: 'residential-exemption.pdf',
    onPrint: () => console.log('Print clicked'),
    onDownload: () => console.log('Download clicked'),
    onBack: () => console.log('Back clicked'),
    backLabel: 'Back to Property Details',
  },
};

export const AbatementForm: Story = {
  args: {
    pdfUrl: examplePdf,
    fileName: 'abatement-application.pdf',
  },
};

export const PersonalExemptionForm: Story = {
  args: {
    pdfUrl: examplePdf,
    fileName: 'personal-exemption.pdf',
  },
};

