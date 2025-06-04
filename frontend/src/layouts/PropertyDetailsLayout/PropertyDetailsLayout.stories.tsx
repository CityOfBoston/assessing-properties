import type { Meta, StoryObj } from '@storybook/react';
import PropertyDetailsLayout from './PropertyDetailsLayout';
import {
  OverviewSection,
  AttributesSection,
  PropertyValueSection,
  PropertyTaxesSection,
  AbatementsSection,
  ApprovedPermitsSection,
  ContactUsSection,
} from '@components/PropertyDetailSections';

const meta = {
  title: 'Layouts/PropertyDetailsLayout',
  component: PropertyDetailsLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PropertyDetailsLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    parcelId: '1234567890',
    sections: [
      {
        name: 'Overview',
        component: (
          <div>
            <h2>Overview Section</h2>
            <p>This is the overview section content.</p>
          </div>
        ),
      },
      {
        name: 'Details',
        component: (
          <div>
            <h2>Details Section</h2>
            <p>This is the details section content.</p>
          </div>
        ),
      },
    ],
  },
};

export const WithMultipleSections: Story = {
  args: {
    parcelId: '9876543210',
    sections: [
      {
        name: 'Overview',
        component: (
          <div>
            <h2>Overview</h2>
            <p>This property is located in the heart of Boston.</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at ligula eget 
              lorem efficitur facilisis. Vivamus eget massa a nisi ultrices vestibulum.
            </p>
          </div>
        ),
      },
      {
        name: 'Details',
        component: (
          <div>
            <h2>Property Details</h2>
            <div style={{ marginBottom: '1rem' }}>
              <h3>Building Information</h3>
              <p>Year Built: 1920</p>
              <p>Square Footage: 2,500</p>
              <p>Lot Size: 5,000 sq ft</p>
            </div>
            <div>
              <h3>Construction Details</h3>
              <p>Style: Colonial</p>
              <p>Exterior: Brick</p>
              <p>Roof: Slate</p>
            </div>
          </div>
        ),
      },
      {
        name: 'Assessment',
        component: (
          <div>
            <h2>Assessment History</h2>
            <div style={{ marginBottom: '1rem' }}>
              <h3>Current Assessment</h3>
              <p>Land Value: $400,000</p>
              <p>Building Value: $600,000</p>
              <p>Total Value: $1,000,000</p>
            </div>
            <div>
              <h3>Previous Years</h3>
              <p>2022: $950,000</p>
              <p>2021: $900,000</p>
              <p>2020: $875,000</p>
            </div>
          </div>
        ),
      },
      {
        name: 'Tax',
        component: (
          <div>
            <h2>Tax Information</h2>
            <div style={{ marginBottom: '1rem' }}>
              <h3>Current Tax Year</h3>
              <p>Tax Rate: 10.88</p>
              <p>Annual Tax: $10,880</p>
              <p>Payment Status: Current</p>
            </div>
            <div>
              <h3>Payment Schedule</h3>
              <p>Q1: February 1, 2024</p>
              <p>Q2: May 1, 2024</p>
              <p>Q3: August 1, 2024</p>
              <p>Q4: November 1, 2024</p>
            </div>
          </div>
        ),
      },
    ],
  },
};

export const WithAllSections: Story = {
  args: {
    parcelId: '1234567890',
    sections: [
      {
        name: 'Overview',
        component: <OverviewSection />,
      },
      {
        name: 'Property Value',
        component: <PropertyValueSection />,
      },
      {
        name: 'Attributes',
        component: <AttributesSection />,
      },
      {
        name: 'Property Taxes',
        component: <PropertyTaxesSection />,
      },
      {
        name: 'Abatements',
        component: <AbatementsSection />,
      },
      {
        name: 'Permits',
        component: <ApprovedPermitsSection />,
      },
      {
        name: 'Contact Us',
        component: <ContactUsSection />,
      },
    ],
  },
}; 