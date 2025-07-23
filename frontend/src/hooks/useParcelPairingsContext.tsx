import React, { createContext, useContext, ReactNode } from 'react';
import { useParcelPairings } from './useParcelPairings';

// Patch: define a type that allows the search function to accept an optional threshold
type ParcelPairingsContextType = Omit<ReturnType<typeof useParcelPairings>, 'search'> & {
  search: (query: string, thresholdOverride?: number) => ReturnType<ReturnType<typeof useParcelPairings>['search']>;
};

// Create context
const ParcelPairingsContext = createContext<ParcelPairingsContextType | null>(null);

// Provider component
interface ParcelPairingsProviderProps {
  children: ReactNode;
}

export const ParcelPairingsProvider: React.FC<ParcelPairingsProviderProps> = ({ children }) => {
  const parcelPairingsData = useParcelPairings();

  // Patch: wrap search to allow threshold override
  const contextValue: ParcelPairingsContextType = {
    ...parcelPairingsData,
    search: (query: string, thresholdOverride?: number) => parcelPairingsData.search(query, thresholdOverride),
  };
  return (
    <ParcelPairingsContext.Provider value={contextValue}>
      {children}
    </ParcelPairingsContext.Provider>
  );
};

// Hook to use the context
export const useParcelPairingsContext = () => {
  const context = useContext(ParcelPairingsContext);
  if (!context) {
    throw new Error('useParcelPairingsContext must be used within a ParcelPairingsProvider');
  }
  return context;
}; 