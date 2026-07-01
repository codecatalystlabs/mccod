/**
 * Offline Data Service
 * Manages caching and syncing of form data for offline functionality
 */

interface CachedData {
  id: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

interface SyncQueue {
  id: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
}

class OfflineDataService {
  private dbName = 'MCCOD_DB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  /**
   * Initialize IndexedDB
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('formData')) {
          db.createObjectStore('formData', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('organisationUnits')) {
          db.createObjectStore('organisationUnits', { keyPath: 'id' });
        }

        console.log('IndexedDB object stores created');
      };
    });
  }

  /**
   * Save form data to IndexedDB
   */
  async saveFormData(id: string, data: any): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['formData'], 'readwrite');
      const store = transaction.objectStore('formData');

      const cachedData: CachedData = {
        id,
        data,
        timestamp: Date.now(),
        synced: false
      };

      const request = store.put(cachedData);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('Form data saved to IndexedDB:', id);
        resolve();
      };
    });
  }

  /**
   * Get form data from IndexedDB
   */
  async getFormData(id: string): Promise<any | null> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['formData'], 'readonly');
      const store = transaction.objectStore('formData');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
    });
  }

  /**
   * Add item to sync queue
   */
  async addToSyncQueue(action: 'create' | 'update' | 'delete', data: any): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');

      const queueItem: SyncQueue = {
        id: `${action}_${Date.now()}_${Math.random()}`,
        action,
        data,
        timestamp: Date.now(),
        retries: 0
      };

      const request = store.add(queueItem);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('Item added to sync queue:', queueItem.id);
        resolve();
      };
    });
  }

  /**
   * Get all items from sync queue
   */
  async getSyncQueue(): Promise<SyncQueue[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  /**
   * Remove item from sync queue
   */
  async removeFromSyncQueue(id: string): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        console.log('Item removed from sync queue:', id);
        resolve();
      };
    });
  }

  /**
   * Cache organisation units
   */
  async cacheOrganisationUnits(units: any[]): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['organisationUnits'], 'readwrite');
      const store = transaction.objectStore('organisationUnits');

      // Clear existing data
      store.clear();

      // Add new data
      units.forEach(unit => {
        store.add(unit);
      });

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => {
        console.log('Organisation units cached:', units.length);
        resolve();
      };
    });
  }

  /**
   * Get cached organisation units
   */
  async getCachedOrganisationUnits(): Promise<any[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['organisationUnits'], 'readonly');
      const store = transaction.objectStore('organisationUnits');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  /**
   * Clear all offline data
   */
  async clearAllData(): Promise<void> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['formData', 'syncQueue', 'organisationUnits'], 'readwrite');

      transaction.objectStore('formData').clear();
      transaction.objectStore('syncQueue').clear();
      transaction.objectStore('organisationUnits').clear();

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => {
        console.log('All offline data cleared');
        resolve();
      };
    });
  }

  /**
   * Check if online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }
}

export const offlineDataService = new OfflineDataService();

