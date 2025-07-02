/**
 * IndexedDB service for caching parcel ID address pairings
 */

interface CachedPairings {
  id: string;
  pairings: Array<{ parcelId: string; fullAddress: string }>;
  timestamp: string;
  year: number;
}

const DB_NAME = 'AssessingPropertiesDB';
const DB_VERSION = 1;
const STORE_NAME = 'parcelIdAddressPairings';

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('year', 'year', { unique: false });
        }
      };
    });
  }

  async storePairings(pairings: Array<{ parcelId: string; fullAddress: string }>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const cachedData: CachedPairings = {
      id: 'current',
      pairings,
      timestamp: new Date().toISOString(),
      year: new Date().getFullYear()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cachedData);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getPairings(): Promise<CachedPairings | null> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get('current');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async isCacheValid(): Promise<boolean> {
    const cached = await this.getPairings();
    if (!cached) return false;

    const currentYear = new Date().getFullYear();
    return cached.year === currentYear;
  }

  async clearCache(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const transaction = this.db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const indexedDBService = new IndexedDBService(); 