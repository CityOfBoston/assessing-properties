import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DateProvider } from '@hooks/useDateContext';
import { ParcelPairingsProvider } from '@hooks/useParcelPairingsContext';
import SearchResultsPage from './SearchResultsPage';

export default {
  title: 'Pages/SearchResultsPage',
  component: SearchResultsPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = () => (
  <MemoryRouter initialEntries={['/search?q=child st']}>
    <DateProvider>
      <ParcelPairingsProvider>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </ParcelPairingsProvider>
    </DateProvider>
  </MemoryRouter>
);

export const NoResults = () => (
  <MemoryRouter initialEntries={['/search?q=kkjaksdj']}>
    <DateProvider>
      <ParcelPairingsProvider>
        <Routes>
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </ParcelPairingsProvider>
    </DateProvider>
  </MemoryRouter>
); 