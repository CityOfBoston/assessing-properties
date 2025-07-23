/**
 * Hook for managing parcel ID address pairings with caching and fuzzy search
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import Fuse from 'fuse.js';
import { getCurrentParcelIdAddressPairings } from './firebaseConfig';
import { indexedDBService } from './useIndexedDB';

interface ParcelPairing {
  parcelId: string;
  fullAddress: string;
}

interface UseParcelPairingsReturn {
  pairings: ParcelPairing[];
  fuse: Fuse<ParcelPairing> | null;
  isLoading: boolean;
  error: string | null;
  search: (query: string, thresholdOverride?: number) => ParcelPairing[];
  refreshCache: () => Promise<void>;
}

export function useParcelPairings(): UseParcelPairingsReturn {
  const [pairings, setPairings] = useState<ParcelPairing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Fuse.js for fuzzy searching
  const fuse = useMemo(() => {
    if (pairings.length === 0) return null;
    
    return new Fuse(pairings, {
      keys: ['fullAddress', 'parcelId'],
      threshold: 0.5, // More lenient threshold for fuzzy matching
      includeScore: true,
      minMatchCharLength: 1, // Allow single character matches
      // Enable more flexible matching
      ignoreLocation: true,
      useExtendedSearch: true,
      // Additional optimizations
      findAllMatches: false, // Stop at first match for performance
      shouldSort: true,
      distance: 100
    });
  }, [pairings]);

  // Download and parse gzipped JSON from compressed data
  const downloadAndParsePairings = async (compressedData: string): Promise<ParcelPairing[]> => {
    try {
      console.log('[useParcelPairings] Processing compressed data');
      
      // Convert base64 to ArrayBuffer
      const binaryString = atob(compressedData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Decompress using pako
      const pako = await import('pako');
      const jsonString = pako.inflate(bytes, { to: 'string' });
      
      // Parse the JSON
      const parsedPairings = JSON.parse(jsonString) as ParcelPairing[];
      
      console.log('[useParcelPairings] Successfully parsed', parsedPairings.length, 'pairings');
      return parsedPairings;
      
    } catch (err) {
      console.error('[useParcelPairings] Error processing compressed data:', err);
      throw err;
    }
  };

  // Load pairings from cache or download if needed
  const loadPairings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize IndexedDB
      await indexedDBService.init();

      // Check if cache is valid
      const isCacheValid = await indexedDBService.isCacheValid();
      
      if (isCacheValid) {
        console.log('[useParcelPairings] Loading pairings from cache');
        const cached = await indexedDBService.getPairings();
        if (cached) {
          setPairings(cached.pairings);
          setIsLoading(false);
          return;
        }
      }

      // Cache is invalid or doesn't exist, download fresh data
      console.log('[useParcelPairings] Cache invalid or missing, downloading fresh data');
      
      // Get compressed data from backend
      const { compressedData } = await getCurrentParcelIdAddressPairings();
      
      // Download and parse the pairings
      const freshPairings = await downloadAndParsePairings(compressedData);
      
      // Store in IndexedDB
      await indexedDBService.storePairings(freshPairings);
      
      // Update state
      setPairings(freshPairings);
      
    } catch (err) {
      console.error('[useParcelPairings] Error loading pairings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pairings');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to normalize address for better matching
  const normalizeAddress = (address: string): string => {
    return address.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  // Helper function to create address variations
  const createAddressVariations = (address: string): string[] => {
    const normalized = normalizeAddress(address);
    const parts = normalized.split(' ');
    
    if (parts.length < 2) return [normalized];
    
    const variations = [normalized];
    
    // Check if first part is a number (street number)
    const firstPart = parts[0];
    const isFirstPartNumber = !isNaN(Number(firstPart));
    
    if (isFirstPartNumber && parts.length >= 2) {
      // Create variation with number at the end: "20 Brentwood" -> "Brentwood 20"
      const streetName = parts.slice(1).join(' ');
      const variation = `${streetName} ${firstPart}`;
      variations.push(variation);
    }
    
    // Check if last part is a number
    const lastPart = parts[parts.length - 1];
    const isLastPartNumber = !isNaN(Number(lastPart));
    
    if (isLastPartNumber && parts.length >= 2) {
      // Create variation with number at the beginning: "Brentwood 20" -> "20 Brentwood"
      const streetName = parts.slice(0, -1).join(' ');
      const variation = `${lastPart} ${streetName}`;
      variations.push(variation);
    }
    
    return variations;
  };

  // Lightweight search function for real-time suggestions
  const search = (query: string, thresholdOverride?: number): ParcelPairing[] => {
    if (!fuse || !query.trim()) return [];

    // Input validation and sanitization
    const sanitizedQuery = query.trim().toLowerCase();

    // Protection against malicious queries
    if (sanitizedQuery.length > 200) {
      console.warn('[useParcelPairings] Query too long, truncating');
      return [];
    }

    // For very short queries (1-2 chars), use optimized simple string matching
    if (sanitizedQuery.length <= 2) {
      const results: ParcelPairing[] = [];
      const limit = 15; // Increased limit for short queries

      // For single character, be even more lenient
      if (sanitizedQuery.length === 1) {
        for (const pairing of pairings) {
          if (results.length >= limit) break;

          const address = pairing.fullAddress.toLowerCase();
          const parcelId = pairing.parcelId.toLowerCase();

          // Check if query starts any word in address or is anywhere in parcel ID
          if (address.split(' ').some(word => word.startsWith(sanitizedQuery)) ||
              parcelId.includes(sanitizedQuery)) {
            results.push(pairing);
          }
        }
      } else {
        // For 2 characters, use contains matching
        for (const pairing of pairings) {
          if (results.length >= limit) break;

          const address = pairing.fullAddress.toLowerCase();
          const parcelId = pairing.parcelId.toLowerCase();

          if (address.includes(sanitizedQuery) || parcelId.includes(sanitizedQuery)) {
            results.push(pairing);
          }
        }
      }

      return results;
    }

    // For longer queries, use a lightweight Fuse.js search
    try {
      const results = fuse.search(sanitizedQuery, {
        limit: 20 // Increased limit for better results
      });

      // Use thresholdOverride if provided, otherwise use default logic
      let scoreThreshold: number;
      if (typeof thresholdOverride === 'number') {
        scoreThreshold = thresholdOverride;
      } else {
        scoreThreshold = sanitizedQuery.length <= 4 ? 0.7 : 0.6;
      }

      // Filter by score
      let filtered = results
        .filter(result => result.score !== undefined && result.score < scoreThreshold)
        .map(result => result.item);

      // Find exact matches (case-insensitive) for parcelId or fullAddress
      const exactMatches = pairings.filter(
        p =>
          p.parcelId.toLowerCase() === sanitizedQuery ||
          p.fullAddress.toLowerCase() === sanitizedQuery
      );

      // Remove duplicates (in case Fuse already found the exact match)
      const seen = new Set<string>();
      const dedupedExact = exactMatches.filter(p => {
        const key = p.parcelId + '|' + p.fullAddress;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      filtered = [
        ...dedupedExact,
        ...filtered.filter(p => !dedupedExact.some(e => e.parcelId === p.parcelId && e.fullAddress === p.fullAddress))
      ];

      return filtered;
    } catch (error) {
      console.error('[useParcelPairings] Error in fuzzy search:', error);
      return [];
    }
  };

  // Refresh cache function
  const refreshCache = async () => {
    await indexedDBService.clearCache();
    await loadPairings();
  };

  // Load pairings on mount
  useEffect(() => {
    loadPairings();
  }, []);

  return {
    pairings,
    fuse,
    isLoading,
    error,
    search,
    refreshCache
  };
} 