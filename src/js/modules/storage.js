/**
 * Storage Manager
 * Handles localStorage and IndexedDB for offline-first functionality
 * 
 * @author Jaime Gavilán Torrero
 * @version 1.0.0
 */

class StorageManager {
  constructor() {
    this.dbName = 'TechFixProDB';
    this.dbVersion = 1;
    this.db = null;
    this.stores = {
      tickets: 'tickets',
      repuestos: 'repuestos',
      clientes: 'clientes',
      cache: 'api_cache'
    };
  }

  /**
   * Initialize storage systems
   */
  async init() {
    try {
      await this.initIndexedDB();
      console.log('✅ Storage systems initialized');
      return true;
    } catch (error) {
      console.error('❌ Storage initialization failed:', error);
      return false;
    }
  }

  /**
   * Initialize IndexedDB
   */
  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('✅ IndexedDB connected');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains(this.stores.tickets)) {
          const ticketsStore = db.createObjectStore(this.stores.tickets, { keyPath: 'id' });
          ticketsStore.createIndex('estado', 'estado', { unique: false });
          ticketsStore.createIndex('cliente_id', 'cliente_id', { unique: false });
          ticketsStore.createIndex('fecha_creacion', 'fecha_creacion', { unique: false });
        }

        if (!db.objectStoreNames.contains(this.stores.repuestos)) {
          const repuestosStore = db.createObjectStore(this.stores.repuestos, { keyPath: 'id' });
          repuestosStore.createIndex('nombre', 'nombre', { unique: false });
          repuestosStore.createIndex('categoria', 'categoria', { unique: false });
          repuestosStore.createIndex('stock', 'stock', { unique: false });
        }

        if (!db.objectStoreNames.contains(this.stores.clientes)) {
          const clientesStore = db.createObjectStore(this.stores.clientes, { keyPath: 'id' });
          clientesStore.createIndex('email', 'email', { unique: true });
          clientesStore.createIndex('telefono', 'telefono', { unique: false });
        }

        if (!db.objectStoreNames.contains(this.stores.cache)) {
          const cacheStore = db.createObjectStore(this.stores.cache, { keyPath: 'key' });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * Save data to IndexedDB
   * @param {string} storeName - Store name
   * @param {Object} data - Data to save
   */
  async save(storeName, data) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = store.put(data);
      
      request.onsuccess = () => {
        console.log(`💾 Data saved to ${storeName}:`, data.id || data.key);
        resolve(data);
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to save to ${storeName}`));
      };
    });
  }

  /**
   * Get data from IndexedDB
   * @param {string} storeName - Store name
   * @param {string|number} key - Record key
   */
  async get(storeName, key) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to get from ${storeName}`));
      };
    });
  }

  /**
   * Get all data from store
   * @param {string} storeName - Store name
   * @param {string} indexName - Index to use (optional)
   * @param {any} indexValue - Index value to filter by (optional)
   */
  async getAll(storeName, indexName = null, indexValue = null) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      let request;
      if (indexName && indexValue !== null) {
        const index = store.index(indexName);
        request = index.getAll(indexValue);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to get all from ${storeName}`));
      };
    });
  }

  /**
   * Delete data from IndexedDB
   * @param {string} storeName - Store name
   * @param {string|number} key - Record key
   */
  async delete(storeName, key) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => {
        console.log(`🗑️ Deleted from ${storeName}:`, key);
        resolve(true);
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to delete from ${storeName}`));
      };
    });
  }

  /**
   * Clear all data from a store
   * @param {string} storeName - Store name
   */
  async clear(storeName) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        console.log(`🧹 Cleared store: ${storeName}`);
        resolve(true);
      };
      
      request.onerror = () => {
        reject(new Error(`Failed to clear ${storeName}`));
      };
    });
  }

  /**
   * Save to localStorage with error handling
   * @param {string} key - Storage key
   * @param {any} data - Data to save
   */
  setLocal(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(`techfix_${key}`, serialized);
      console.log(`💾 Saved to localStorage: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ localStorage save failed:', error);
      return false;
    }
  }

  /**
   * Get from localStorage with error handling
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if not found
   */
  getLocal(key, defaultValue = null) {
    try {
      const stored = localStorage.getItem(`techfix_${key}`);
      if (stored === null) return defaultValue;
      return JSON.parse(stored);
    } catch (error) {
      console.error('❌ localStorage get failed:', error);
      return defaultValue;
    }
  }

  /**
   * Remove from localStorage
   * @param {string} key - Storage key
   */
  removeLocal(key) {
    try {
      localStorage.removeItem(`techfix_${key}`);
      console.log(`🗑️ Removed from localStorage: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ localStorage remove failed:', error);
      return false;
    }
  }

  /**
   * Clear all TechFix data from localStorage
   */
  clearLocal() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('techfix_')) {
          localStorage.removeItem(key);
        }
      });
      console.log('🧹 Cleared localStorage');
      return true;
    } catch (error) {
      console.error('❌ localStorage clear failed:', error);
      return false;
    }
  }

  /**
   * Cache API response
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Response data
   * @param {number} ttl - Time to live in seconds
   */
  async cacheAPIResponse(endpoint, data, ttl = 300) {
    const cacheEntry = {
      key: endpoint,
      data: data,
      timestamp: Date.now(),
      ttl: ttl * 1000 // Convert to milliseconds
    };

    return this.save(this.stores.cache, cacheEntry);
  }

  /**
   * Get cached API response
   * @param {string} endpoint - API endpoint
   */
  async getCachedResponse(endpoint) {
    try {
      const cached = await this.get(this.stores.cache, endpoint);
      
      if (!cached) return null;
      
      // Check if cache is expired
      const now = Date.now();
      if (now - cached.timestamp > cached.ttl) {
        await this.delete(this.stores.cache, endpoint);
        return null;
      }
      
      console.log(`📋 Cache hit: ${endpoint}`);
      return cached.data;
    } catch (error) {
      console.error('❌ Cache get failed:', error);
      return null;
    }
  }

  /**
   * Clear expired cache entries
   */
  async cleanExpiredCache() {
    try {
      const allCached = await this.getAll(this.stores.cache);
      const now = Date.now();
      let cleaned = 0;

      for (const entry of allCached) {
        if (now - entry.timestamp > entry.ttl) {
          await this.delete(this.stores.cache, entry.key);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
      }
    } catch (error) {
      console.error('❌ Cache cleanup failed:', error);
    }
  }

  /**
   * Sync local data with server (placeholder for Sprint 2)
   */
  async syncWithServer() {
    console.log('🔄 Sync with server - Implementation pending for Sprint 2');
    return true;
  }

  /**
   * Get storage usage information
   */
  async getStorageInfo() {
    const info = {
      localStorage: {
        used: new Blob(Object.values(localStorage)).size,
        available: 5 * 1024 * 1024 // ~5MB typical limit
      },
      indexedDB: {
        available: true,
        stores: Object.keys(this.stores)
      }
    };

    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        info.quota = estimate;
      }
    } catch (error) {
      console.warn('Storage estimate not available');
    }

    return info;
  }

  /**
   * Export all data for backup
   */
  async exportData() {
    const exportData = {
      timestamp: new Date().toISOString(),
      localStorage: {},
      indexedDB: {}
    };

    // Export localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('techfix_')) {
        exportData.localStorage[key] = localStorage.getItem(key);
      }
    });

    // Export IndexedDB
    for (const storeName of Object.values(this.stores)) {
      try {
        const data = await this.getAll(storeName);
        exportData.indexedDB[storeName] = data;
      } catch (error) {
        console.warn(`Failed to export ${storeName}:`, error);
      }
    }

    return exportData;
  }
}

export default StorageManager;