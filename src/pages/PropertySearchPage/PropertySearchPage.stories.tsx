import type { Meta, StoryObj } from '@storybook/react';
import { PropertySearchPage, ResultsState } from './PropertySearchPage';

const meta = {
  title: 'Pages/PropertySearchPage',
  component: PropertySearchPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PropertySearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Initial search state - just the search form
export const InitialState: Story = {
  args: {
    resultsState: ResultsState.NONE,
  },
};

// Show error message in the search form
export const WithSearchError: Story = {
  args: {
    resultsState: ResultsState.NONE,
    errorMessage: 'Please enter a valid address or parcel ID',
  },
};

// Show "no results" help content
export const NoResultsFound: Story = {
  args: {
    resultsState: ResultsState.HELP,
    searchQuery: '123 Main St',
  },
};

// Show search results
export const WithSearchResults: Story = {
  args: {
    resultsState: ResultsState.RESULTS,
  },
}; 