import type { Meta, StoryObj } from '@storybook/react';
import PropertyValuesBarChart from './PropertyValuesBarChart';

const meta: Meta<typeof PropertyValuesBarChart> = {
  title: 'Components/PropertyValuesBarChart',
  component: PropertyValuesBarChart,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PropertyValuesBarChart>;

export const Default: Story = {
  args: {
    title: 'Property Value History',
    value: '$478,500',
    data: [
      { year: 2019, value: 425000 },
      { year: 2020, value: 432000 },
      { year: 2021, value: 445000 },
      { year: 2022, value: 460000 },
      { year: 2023, value: 478500 },
    ],
  },
};

export const WithDifferentValues: Story = {
  args: {
    title: 'Property Value History',
    value: '$523,750',
    data: [
      { year: 2019, value: 485000 },
      { year: 2020, value: 492000 },
      { year: 2021, value: 498500 },
      { year: 2022, value: 510000 },
      { year: 2023, value: 523750 },
    ],
  },
};

export const WithMillionDollarValues: Story = {
  args: {
    title: 'Property Value History',
    value: '$1.15M',
    data: [
      { year: 2019, value: 1025000 },
      { year: 2020, value: 1040000 },
      { year: 2021, value: 1065000 },
      { year: 2022, value: 1100000 },
      { year: 2023, value: 1150000 },
    ],
  },
};

export const WithMoreYears: Story = {
  args: {
    title: 'Property Value History',
    value: '$495,250',
    data: [
      { year: 2018, value: 410000 },
      { year: 2019, value: 418000 },
      { year: 2020, value: 425000 },
      { year: 2021, value: 435000 },
      { year: 2022, value: 450000 },
      { year: 2023, value: 495250 },
    ],
  },
}; 