/**
 * Hook for managing parcel ID address pairings with caching and fuzzy search
 */

import { useState, useEffect, useMemo } from 'react';
import Fuse, { FuseResult, IFuseOptions } from 'fuse.js';
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
    
    const options: IFuseOptions<ParcelPairing> = {
      keys: [
        { 
          name: 'fullAddress',
          weight: 1,
          getFn: (obj) => {
            // Create searchable tokens from address
            const addr = obj.fullAddress.toLowerCase()
              .replace(/\./g, '')
              .replace(/\bst\b/g, 'street')
              .replace(/\bave\b/g, 'avenue')
              .replace(/\brd\b/g, 'road');
            
            // Split into words and create searchable combinations
            const parts = addr.split(/[\s,-]+/);
            
            // Add individual words and word pairs for better matching
            const searchParts = [...parts];
            for (let i = 0; i < parts.length - 1; i++) {
              searchParts.push(`${parts[i]} ${parts[i + 1]}`);
            }
            
            // Join with special delimiter to preserve word boundaries
            return searchParts.join(' | ');
          }
        }
      ],
      threshold: 0.2, // Stricter threshold
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: false, // Consider location for better word boundary matching
      useExtendedSearch: true,
      findAllMatches: true,
      shouldSort: false,
      distance: 1000, // Large distance to find matches anywhere in tokens
      location: 0,
      fieldNormWeight: 0.1 // Reduce impact of field length
    };
    return new Fuse(pairings, options);
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

  // Helper function to normalize text for matching
  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .trim();
  };

  // Enhanced search function with improved ranking
  const search = (query: string, thresholdOverride?: number): ParcelPairing[] => {
    if (!fuse || !query.trim()) return [];

    // Input validation and sanitization
    const sanitizedQuery = query.trim().toLowerCase();

    // Protection against malicious queries
    if (sanitizedQuery.length > 200) {
      console.warn('[useParcelPairings] Query too long, truncating');
      return [];
    }

    // For very short queries (1-2 chars), use enhanced prefix matching
    if (sanitizedQuery.length <= 2) {
      const results: Array<{item: ParcelPairing; score: number}> = [];
      const seen = new Set<string>();

      for (const pairing of pairings) {
        if (results.length >= 30) break;

        // Skip duplicates
        const key = pairing.parcelId + '|' + pairing.fullAddress;
        if (seen.has(key)) continue;
        seen.add(key);

        const lowerParcelId = pairing.parcelId.toLowerCase();
        const lowerAddress = pairing.fullAddress.toLowerCase();
        let score = 1;

        // Exact matches get highest priority
        if (lowerParcelId === sanitizedQuery || lowerAddress === sanitizedQuery) {
          score = 0.1;
        }
        // Prefix matches get next priority
        else if (lowerParcelId.startsWith(sanitizedQuery) || lowerAddress.startsWith(sanitizedQuery)) {
          score = 0.3;
        }
        // Word boundary matches
        else if (lowerAddress.split(/\s+/).some(word => word.startsWith(sanitizedQuery)) ||
                 lowerParcelId.split(/\s+/).some(word => word.startsWith(sanitizedQuery))) {
          score = 0.5;
        }
        // Contains matches (lowest priority for short queries)
        else if (lowerAddress.includes(sanitizedQuery) || lowerParcelId.includes(sanitizedQuery)) {
          score = 0.7;
        }

        if (score < 1) {
          results.push({ item: pairing, score });
        }
      }

      // Sort by score and return top results
      return results
        .sort((a, b) => a.score - b.score)
        .slice(0, 20)
        .map(result => result.item);
    }

    // For longer queries, use enhanced Fuse.js search with custom ranking
    try {
      const results = fuse.search(sanitizedQuery, {
        limit: 50, // Good balance between coverage and performance
        includeScore: true
      });

      // Enhanced scoring function
      const getEnhancedScore = (result: Fuse.FuseResult<ParcelPairing>) => {
        let score = result.score || 1;
        const item = result.item;
        const lowerAddress = item.fullAddress.toLowerCase();
        
        // Split into parts and clean up
        const queryParts = sanitizedQuery.split(/[\s,]+/).filter((p: string) => p.length > 0);
        const addressParts = lowerAddress.split(/[\s,]+/).filter((p: string) => p.length > 0);
        
        // Helper function to calculate Levenshtein distance with custom weights
        const getLevenshteinDistance = (s1: string, s2: string): number => {
          const m = s1.length;
          const n = s2.length;
          const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
          
          // Initialize first row and column
          for (let i = 0; i <= m; i++) dp[i][0] = i;
          for (let j = 0; j <= n; j++) dp[0][j] = j;
          
          for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
              if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
              } else {
                // Weight insertions/deletions more heavily for structural differences
                const insertion = dp[i][j - 1] + 1.2;  // Penalize extra characters more
                const deletion = dp[i - 1][j] + 1.2;   // Penalize missing characters more
                const substitution = dp[i - 1][j - 1] + 1;  // Normal substitution weight
                dp[i][j] = Math.min(insertion, deletion, substitution);
              }
            }
          }
          return dp[m][n];
        };

        // Helper function to calculate word match quality with pattern matching
        const getWordMatchQuality = (query: string, word: string): number => {
          // Normalize strings
          query = query.toLowerCase();
          word = word.toLowerCase();
          
          // Split into parts for structural comparison
          const queryParts = query.split(/\s+/);
          const wordParts = word.split(/\s+/);
          
          // If query is a single word, compare with each word part
          if (queryParts.length === 1) {
            let bestScore = 0;
            for (const part of wordParts) {
              // Exact match
              if (query === part) {
                bestScore = 1;
                break;
              }
              
              // Calculate normalized Levenshtein distance
              const distance = getLevenshteinDistance(query, part);
              const maxLength = Math.max(query.length, part.length);
              const similarity = 1 - (distance / maxLength);
              
              // Boost score if it's a prefix match
              if (part.startsWith(query)) {
                similarity * 1.2;
              }
              
              bestScore = Math.max(bestScore, similarity);
            }
            return bestScore;
          }
          
          // For multi-word queries, compare entire strings
          const distance = getLevenshteinDistance(query, word);
          const maxLength = Math.max(query.length, word.length);
          const similarity = 1 - (distance / maxLength);
          
          // Boost score if all query words appear in order
          let allWordsMatch = true;
          let lastIndex = -1;
          for (const queryPart of queryParts) {
            const index = word.indexOf(queryPart, lastIndex + 1);
            if (index === -1) {
              allWordsMatch = false;
              break;
            }
            lastIndex = index;
          }
          
          return allWordsMatch ? similarity * 1.2 : similarity;
        };

        // Exact full address match
        if (lowerAddress === sanitizedQuery) {
          return score * 0.1; // Best possible score
        }

        // Handle single word queries (like "child")
        if (queryParts.length === 1 && !/^\d+$/.test(queryParts[0])) {
          const queryWord = queryParts[0];
          let bestMatchQuality = 0;
          
          // Find the best matching word in the address
          for (const part of addressParts) {
            const quality = getWordMatchQuality(queryWord, part);
            bestMatchQuality = Math.max(bestMatchQuality, quality);
          }
          
          // Score based on match quality
          if (bestMatchQuality > 0.9) {
            score *= 0.2; // Excellent match
          } else if (bestMatchQuality > 0.7) {
            score *= 0.4; // Good match
          } else if (bestMatchQuality > 0.5) {
            score *= 0.6; // Fair match
          } else {
            score *= 2.0; // Poor match
          }
          
          return score;
        }

        // Handle full address queries (e.g., "68 child st")
        if (/^\d+$/.test(queryParts[0])) {
          // Normalize query parts
          const normalizedQueryParts = queryParts.map(part => 
            part.replace(/\bst\b/g, 'street')
               .replace(/\bave\b/g, 'avenue')
               .replace(/\brd\b/g, 'road')
          );
          
          // Check for exact number + street match
          const queryNumberStreet = normalizedQueryParts.slice(0, 2).join(' ').toLowerCase();
          const addressNumberStreet = addressParts.slice(0, 2).join(' ').toLowerCase();

          if (queryNumberStreet === addressNumberStreet) {
            score *= 0.1; // Perfect match for number + street
            return score;
          }

          // Exact number match at start is critical
          if (addressParts[0] !== normalizedQueryParts[0]) {
            score *= 5.0; // Severely penalize wrong house numbers
            return score;
          }
          
          // Number matches, now check street name
          if (normalizedQueryParts.length > 1) {
            // Get the street name without the number and any suffix
            const queryStreet = normalizedQueryParts[1].toLowerCase(); // e.g., "child"
            const addressStreet = addressParts[1].toLowerCase(); // Should match "child"
            
            // Calculate street name match quality
            const streetMatchQuality = getWordMatchQuality(queryStreet, addressStreet);
            
            if (streetMatchQuality > 0.9) {
              score *= 0.2; // Excellent street match
            } else if (streetMatchQuality > 0.7) {
              score *= 0.4; // Good street match
            } else if (streetMatchQuality > 0.5) {
              score *= 0.6; // Fair street match
            } else {
              score *= 3.0; // Poor street match
              return score;
            }
            
            // If query includes street type (st, ave, etc), check that too
            if (normalizedQueryParts.length > 2) {
              const queryType = normalizedQueryParts[2].toLowerCase(); // e.g., "street"
              const addressType = addressParts[2]?.toLowerCase(); // Should match "street"
              
              if (addressType === queryType) {
                score *= 0.8; // Reward matching street type
              } else {
                score *= 1.1; // Smaller penalty for mismatched street type
              }
            }
          }
        }
        
        // Handle street name only queries (e.g., "child st")
        else {
          let totalMatchQuality = 0;
          let matchedWords = 0;
          
          // Check each query word against each address word
          queryParts.forEach((queryWord: string) => {
            let bestWordMatch = 0;
            addressParts.forEach((addressWord: string) => {
              const quality = getWordMatchQuality(queryWord, addressWord);
              bestWordMatch = Math.max(bestWordMatch, quality);
            });
            if (bestWordMatch > 0.5) {
              totalMatchQuality += bestWordMatch;
              matchedWords++;
            }
          });
          
          // Calculate overall match quality
          const avgMatchQuality = matchedWords > 0 ? totalMatchQuality / queryParts.length : 0;
          
          // Score based on match quality
          if (avgMatchQuality > 0.8) {
            score *= 0.3;
          } else if (avgMatchQuality > 0.6) {
            score *= 0.5;
          } else if (avgMatchQuality > 0.4) {
            score *= 0.7;
          } else {
            score *= 2.0;
          }
        }
        
        return score;
      };

      // Get all potential matches
      const allMatches = results.map(result => result.item);
      const query = sanitizedQuery.toLowerCase();
      const queryParts = query.split(/\s+/);

      // Helper to check if all query parts match in order
      const hasAllPartsInOrder = (address: string, parts: string[]): boolean => {
        let lastIndex = -1;
        for (const part of parts) {
          const index = address.indexOf(part, lastIndex + 1);
          if (index === -1) return false;
          lastIndex = index;
        }
        return true;
      };

      // Helper to check if string is a word in address with strict word boundaries
      const isWordInAddress = (word: string, address: string): boolean => {
        const wordPattern = new RegExp(`\\b${word.toLowerCase()}\\b`);
        return wordPattern.test(address.toLowerCase());
      };

      // Helper to check if string appears at a word boundary
      const isAtWordBoundary = (word: string, address: string): boolean => {
        const wordPattern = new RegExp(`\\b${word.toLowerCase()}`);
        return wordPattern.test(address.toLowerCase());
      };

      // Helper to normalize text for comparison
      const normalize = (text: string): string => {
        return text.toLowerCase()
          .replace(/\./g, '')
          .replace(/\bst\b/g, 'street')
          .replace(/\bave\b/g, 'avenue')
          .replace(/\brd\b/g, 'road')
          .trim();
      };

      // Categorize matches by priority
      const exactFull: ParcelPairing[] = [];        // Exact full address match
      const exactWords: ParcelPairing[] = [];       // All query words match exactly
      const exactWordPrefix: ParcelPairing[] = [];  // Exact word matches for all but last word, prefix match for last
      const startsWith: ParcelPairing[] = [];       // Address starts with query
      const containsAllWords: ParcelPairing[] = []; // All query words present in order
      const containsSomeWords: ParcelPairing[] = []; // Some query words present
      const other: ParcelPairing[] = [];            // Other fuzzy matches

      for (const match of allMatches) {
        const address = normalize(match.fullAddress);
        const addressWords = address.split(/\s+/);

        // Exact full match
        if (address === normalize(query)) {
          exactFull.push(match);
          continue;
        }

        // Check for exact word matches
        const queryWords = queryParts.map(normalize);
        const normalizedQuery = normalize(query);
        
        // Single word query needs special handling
        if (queryWords.length === 1) {
          const queryWord = queryWords[0];
          
          // Exact word match
          if (isWordInAddress(queryWord, address)) {
            exactWords.push(match);
            continue;
          }
          
          // Word boundary prefix match
          if (isAtWordBoundary(queryWord, address)) {
            exactWordPrefix.push(match);
            continue;
          }
        } else {
          // Multi-word queries
          
          // All words match exactly
          if (queryWords.every(qWord => isWordInAddress(qWord, address))) {
            exactWords.push(match);
            continue;
          }
          
          // All words except last match exactly, last is prefix
          const lastWord = queryWords[queryWords.length - 1];
          if (queryWords.slice(0, -1).every(qWord => isWordInAddress(qWord, address)) &&
              isAtWordBoundary(lastWord, address)) {
            exactWordPrefix.push(match);
            continue;
          }
        }

        // Starts with query at word boundary
        if (isAtWordBoundary(normalizedQuery, address)) {
          startsWith.push(match);
          continue;
        }

        // Contains all query words in order at word boundaries
        if (hasAllPartsInOrder(address, queryWords)) {
          containsAllWords.push(match);
          continue;
        }

        // Contains some query words as complete words
        if (queryWords.some(part => isWordInAddress(part, address))) {
          containsSomeWords.push(match);
          continue;
        }

        // Other matches
        other.push(match);
      }

      // Combine all groups in strict priority order
      const rankedResults = [
        ...exactFull,           // Perfect matches first
        ...exactWords,          // All words match exactly
        ...exactWordPrefix,     // Exact matches with prefix
        ...startsWith,          // Starts with query
        ...containsAllWords,    // All words present in order
        ...containsSomeWords,   // Some words match
        ...other               // Other fuzzy matches
      ];

      return rankedResults;
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