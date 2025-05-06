import type { Meta, StoryObj } from '@storybook/react';
import { SearchHeader } from './SearchHeader';
import styles from './SearchHeader.module.scss';

const meta = {
  title: 'Components/SearchHeader',
  component: SearchHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'ASSESSING ONLINE',
    description: (
      <>
        <p>
          Assessing Online offers direct access to comprehensive property parcel data for every property in the city, including assessed value, location, ownership, and tax information. The application serves a broad range of users:
        </p>
        <ul className={styles.bulletPoints}>
          <li>
            <span className={styles.bulletLabel}>Taxpayers and Homeowners:</span> Access current property values and tax status to manage ownership responsibilities.
          </li>
          <li>
            <span className={styles.bulletLabel}>Real Estate, Business, and Legal Professionals:</span> Use reliable data to support operations, planning, and compliance.
          </li>
          <li>
            <span className={styles.bulletLabel}>Researchers and Analysts:</span> Explore GIS data for insights into demographics, land use, and development trends.
          </li>
        </ul>
      </>
    ),
  },
}; 