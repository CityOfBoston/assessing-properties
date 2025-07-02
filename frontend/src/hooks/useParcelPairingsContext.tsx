import React, { createContext, useContext, ReactNode } from 'react';
import { useParcelPairings } from './useParcelPairings';

// Create context
const ParcelPairingsContext = createContext<ReturnType<typeof useParcelPairings> | null>(null);

// Provider component
interface ParcelPairingsProviderProps {
  children: ReactNode;
}

export const ParcelPairingsProvider: React.FC<ParcelPairingsProviderProps> = ({ children }) => {
  const parcelPairingsData = useParcelPairings();

  return (
    <ParcelPairingsContext.Provider value={parcelPairingsData}>
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