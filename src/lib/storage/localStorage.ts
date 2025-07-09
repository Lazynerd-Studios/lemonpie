// Enhanced Local Storage utility with versioning, compression, and encryption
export interface StorageOptions {
  version?: number;
  encrypt?: boolean;
  compress?: boolean;
  ttl?: number; // Time to live in milliseconds
  namespace?: string;
  onError?: (error: Error, key: string) => void;
  onMigration?: (oldVersion: number, newVersion: number, data: any) => any;
}

export interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  version: number;
  ttl?: number;
  encrypted?: boolean;
  compressed?: boolean;
}

export interface StorageStats {
  totalKeys: number;
  totalSize: number;
  availableSpace: number;
  usedSpace: number;
  largestKey: string;
  largestSize: number;
  oldestKey: string;
  oldestTimestamp: number;
}

// Storage quota management
export class StorageQuotaManager {
  private static readonly QUOTA_THRESHOLD = 0.8; // 80% of available space
  private static readonly CLEANUP_PERCENTAGE = 0.3; // Clean up 30% of old data
  
  static async getQuotaInfo(): Promise<{ usage: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    }
    
    // Fallback estimation
    const used = this.calculateUsedSpace();
    const quota = 5 * 1024 * 1024; // 5MB fallback
    
    return { usage: used, quota };
  }
  
  static async isQuotaExceeded(): Promise<boolean> {
    const { usage, quota } = await this.getQuotaInfo();
    return usage / quota > this.QUOTA_THRESHOLD;
  }
  
  static async cleanupOldData(): Promise<void> {
    const keys = Object.keys(localStorage);
    const items: Array<{ key: string; timestamp: number; size: number }> = [];
    
    for (const key of keys) {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '{}');
        if (item.timestamp) {
          items.push({
            key,
            timestamp: item.timestamp,
            size: localStorage.getItem(key)?.length || 0
          });
        }
      } catch {
        // Invalid JSON, skip
      }
    }
    
    // Sort by timestamp (oldest first)
    items.sort((a, b) => a.timestamp - b.timestamp);
    
    // Remove oldest items
    const itemsToRemove = Math.floor(items.length * this.CLEANUP_PERCENTAGE);
    for (let i = 0; i < itemsToRemove; i++) {
      localStorage.removeItem(items[i].key);
    }
  }
  
  private static calculateUsedSpace(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage.getItem(key)?.length || 0;
      }
    }
    return total;
  }
}

// Compression utility
export class CompressionUtil {
  static compress(data: string): string {
    // Simple LZ-string like compression
    const dict: Record<string, number> = {};
    const result: (string | number)[] = [];
    let dictSize = 256;
    let w = "";
    
    for (let i = 0; i < data.length; i++) {
      const c = data[i];
      const wc = w + c;
      
      if (dict[wc] !== undefined) {
        w = wc;
      } else {
        result.push(dict[w] !== undefined ? dict[w] : w);
        dict[wc] = dictSize++;
        w = c;
      }
    }
    
    if (w !== "") {
      result.push(dict[w] !== undefined ? dict[w] : w);
    }
    
    return JSON.stringify(result);
  }
  
  static decompress(compressed: string): string {
    try {
      const data = JSON.parse(compressed);
      const dict: Record<number, string> = {};
      let dictSize = 256;
      let result = "";
      let w = String(data[0]);
      
      result += w;
      
      for (let i = 1; i < data.length; i++) {
        const k = data[i];
        let entry: string;
        
        if (dict[k] !== undefined) {
          entry = dict[k];
        } else if (k === dictSize) {
          entry = w + w[0];
        } else {
          throw new Error("Invalid compressed data");
        }
        
        result += entry;
        dict[dictSize++] = w + entry[0];
        w = entry;
      }
      
      return result;
    } catch {
      return compressed; // Return original if decompression fails
    }
  }
}

// Simple encryption utility (for demo purposes - use proper encryption in production)
export class EncryptionUtil {
  private static readonly KEY = 'lemonnpie-storage-key';
  
  static encrypt(data: string): string {
    // Simple XOR encryption (use proper encryption in production)
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(
        data.charCodeAt(i) ^ this.KEY.charCodeAt(i % this.KEY.length)
      );
    }
    return btoa(encrypted);
  }
  
  static decrypt(encrypted: string): string {
    try {
      const data = atob(encrypted);
      let decrypted = '';
      for (let i = 0; i < data.length; i++) {
        decrypted += String.fromCharCode(
          data.charCodeAt(i) ^ this.KEY.charCodeAt(i % this.KEY.length)
        );
      }
      return decrypted;
    } catch {
      return encrypted; // Return original if decryption fails
    }
  }
}

// Main storage class
export class EnhancedLocalStorage {
  private static instance: EnhancedLocalStorage;
  private namespace: string;
  private defaultOptions: StorageOptions;
  private migrationHandlers: Map<number, (data: any) => any> = new Map();
  
  private constructor(namespace: string = 'lemonnpie', options: StorageOptions = {}) {
    this.namespace = namespace;
    this.defaultOptions = {
      version: 1,
      encrypt: false,
      compress: false,
      ttl: undefined,
      namespace,
      ...options
    };
    
    this.setupMigrations();
  }
  
  static getInstance(namespace?: string, options?: StorageOptions): EnhancedLocalStorage {
    if (!EnhancedLocalStorage.instance) {
      EnhancedLocalStorage.instance = new EnhancedLocalStorage(namespace, options);
    }
    return EnhancedLocalStorage.instance;
  }
  
  private setupMigrations(): void {
    // Migration from version 1 to 2
    this.migrationHandlers.set(2, (data) => {
      // Example migration: add new fields
      if (data.favorites && Array.isArray(data.favorites)) {
        data.favorites = data.favorites.map((fav: any) => ({
          ...fav,
          tags: fav.tags || [],
          rating: fav.rating || null
        }));
      }
      return data;
    });
    
    // Migration from version 2 to 3
    this.migrationHandlers.set(3, (data) => {
      // Example migration: restructure data
      if (data.preferences) {
        data.userPreferences = {
          display: data.preferences.display || {},
          filters: data.preferences.filters || {},
          notifications: data.preferences.notifications || {}
        };
        delete data.preferences;
      }
      return data;
    });
  }
  
  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }
  
  private async checkQuotaAndCleanup(): Promise<void> {
    if (await StorageQuotaManager.isQuotaExceeded()) {
      await StorageQuotaManager.cleanupOldData();
    }
  }
  
  private processData(data: any, options: StorageOptions): string {
    let processed = JSON.stringify(data);
    
    if (options.compress) {
      processed = CompressionUtil.compress(processed);
    }
    
    if (options.encrypt) {
      processed = EncryptionUtil.encrypt(processed);
    }
    
    return processed;
  }
  
  private unprocessData(processed: string, options: StorageOptions): any {
    let data = processed;
    
    if (options.encrypt) {
      data = EncryptionUtil.decrypt(data);
    }
    
    if (options.compress) {
      data = CompressionUtil.decompress(data);
    }
    
    return JSON.parse(data);
  }
  
  private migrateData(item: StorageItem, targetVersion: number): StorageItem {
    let { data, version } = item;
    
    while (version < targetVersion) {
      const migrationHandler = this.migrationHandlers.get(version + 1);
      if (migrationHandler) {
        data = migrationHandler(data);
        version++;
      } else {
        break;
      }
    }
    
    return { ...item, data, version };
  }
  
  async set<T>(key: string, value: T, options: StorageOptions = {}): Promise<void> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const fullKey = this.getKey(key);
    
    try {
      await this.checkQuotaAndCleanup();
      
      const item: StorageItem<T> = {
        data: value,
        timestamp: Date.now(),
        version: mergedOptions.version!,
        ttl: mergedOptions.ttl,
        encrypted: mergedOptions.encrypt,
        compressed: mergedOptions.compress
      };
      
      const processedData = this.processData(item, mergedOptions);
      localStorage.setItem(fullKey, processedData);
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Storage error');
      mergedOptions.onError?.(err, key);
      throw err;
    }
  }
  
  async get<T>(key: string, options: StorageOptions = {}): Promise<T | null> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const fullKey = this.getKey(key);
    
    try {
      const stored = localStorage.getItem(fullKey);
      if (!stored) return null;
      
      let item: StorageItem<T> = this.unprocessData(stored, mergedOptions);
      
      // Check TTL
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        await this.remove(key);
        return null;
      }
      
      // Check version and migrate if needed
      if (item.version < mergedOptions.version!) {
        item = this.migrateData(item, mergedOptions.version!);
        await this.set(key, item.data, mergedOptions);
        mergedOptions.onMigration?.(item.version, mergedOptions.version!, item.data);
      }
      
      return item.data;
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Storage error');
      mergedOptions.onError?.(err, key);
      return null;
    }
  }
  
  async remove(key: string): Promise<void> {
    const fullKey = this.getKey(key);
    localStorage.removeItem(fullKey);
  }
  
  async clear(): Promise<void> {
    const keys = Object.keys(localStorage);
    const namespacePrefix = `${this.namespace}:`;
    
    for (const key of keys) {
      if (key.startsWith(namespacePrefix)) {
        localStorage.removeItem(key);
      }
    }
  }
  
  async exists(key: string): Promise<boolean> {
    const fullKey = this.getKey(key);
    return localStorage.getItem(fullKey) !== null;
  }
  
  async keys(): Promise<string[]> {
    const keys = Object.keys(localStorage);
    const namespacePrefix = `${this.namespace}:`;
    
    return keys
      .filter(key => key.startsWith(namespacePrefix))
      .map(key => key.substring(namespacePrefix.length));
  }
  
  async size(): Promise<number> {
    const keys = await this.keys();
    return keys.length;
  }
  
  async getStats(): Promise<StorageStats> {
    const keys = await this.keys();
    let totalSize = 0;
    let largestKey = '';
    let largestSize = 0;
    let oldestKey = '';
    let oldestTimestamp = Infinity;
    
    for (const key of keys) {
      const fullKey = this.getKey(key);
      const item = localStorage.getItem(fullKey);
      const size = item?.length || 0;
      totalSize += size;
      
      if (size > largestSize) {
        largestSize = size;
        largestKey = key;
      }
      
      try {
        const parsed = JSON.parse(item || '{}');
        if (parsed.timestamp < oldestTimestamp) {
          oldestTimestamp = parsed.timestamp;
          oldestKey = key;
        }
      } catch {
        // Invalid JSON, skip
      }
    }
    
    const { usage, quota } = await StorageQuotaManager.getQuotaInfo();
    
    return {
      totalKeys: keys.length,
      totalSize,
      availableSpace: quota - usage,
      usedSpace: usage,
      largestKey,
      largestSize,
      oldestKey,
      oldestTimestamp
    };
  }
  
  // Batch operations
  async setMany<T>(items: Array<{ key: string; value: T; options?: StorageOptions }>): Promise<void> {
    const promises = items.map(item => this.set(item.key, item.value, item.options));
    await Promise.all(promises);
  }
  
  async getMany<T>(keys: string[], options: StorageOptions = {}): Promise<Array<{ key: string; value: T | null }>> {
    const promises = keys.map(async key => ({
      key,
      value: await this.get<T>(key, options)
    }));
    return Promise.all(promises);
  }
  
  async removeMany(keys: string[]): Promise<void> {
    const promises = keys.map(key => this.remove(key));
    await Promise.all(promises);
  }
  
  // Export/Import functionality
  async exportData(): Promise<{ [key: string]: any }> {
    const keys = await this.keys();
    const data: { [key: string]: any } = {};
    
    for (const key of keys) {
      data[key] = await this.get(key);
    }
    
    return data;
  }
  
  async importData(data: { [key: string]: any }, options: StorageOptions = {}): Promise<void> {
    const items = Object.entries(data).map(([key, value]) => ({
      key,
      value,
      options
    }));
    
    await this.setMany(items);
  }
  
  // Watch for changes
  watch(key: string, callback: (newValue: any, oldValue: any) => void): () => void {
    const fullKey = this.getKey(key);
    let oldValue = localStorage.getItem(fullKey);
    
    const interval = setInterval(() => {
      const newValue = localStorage.getItem(fullKey);
      if (newValue !== oldValue) {
        callback(newValue, oldValue);
        oldValue = newValue;
      }
    }, 100);
    
    return () => clearInterval(interval);
  }
}

// Specialized storage instances
export class UserPreferencesStorage extends EnhancedLocalStorage {
  constructor() {
    super('lemonnpie-preferences', {
      version: 2,
      encrypt: false,
      compress: false
    });
  }
  
  async saveTheme(theme: string): Promise<void> {
    await this.set('theme', theme);
  }
  
  async getTheme(): Promise<string | null> {
    return this.get('theme');
  }
  
  async saveLanguage(language: string): Promise<void> {
    await this.set('language', language);
  }
  
  async getLanguage(): Promise<string | null> {
    return this.get('language');
  }
  
  async saveDisplaySettings(settings: any): Promise<void> {
    await this.set('display', settings);
  }
  
  async getDisplaySettings(): Promise<any> {
    return this.get('display');
  }
  
  async saveFilterPreferences(filters: any): Promise<void> {
    await this.set('filters', filters);
  }
  
  async getFilterPreferences(): Promise<any> {
    return this.get('filters');
  }
  
  async saveNotificationSettings(settings: any): Promise<void> {
    await this.set('notifications', settings);
  }
  
  async getNotificationSettings(): Promise<any> {
    return this.get('notifications');
  }
}

export class MovieDataStorage extends EnhancedLocalStorage {
  constructor() {
    super('lemonnpie-movies', {
      version: 3,
      encrypt: true,
      compress: true
    });
  }
  
  async saveFavorites(favorites: any[]): Promise<void> {
    await this.set('favorites', favorites);
  }
  
  async getFavorites(): Promise<any[]> {
    return (await this.get('favorites')) || [];
  }
  
  async saveWatchlist(watchlist: any[]): Promise<void> {
    await this.set('watchlist', watchlist);
  }
  
  async getWatchlist(): Promise<any[]> {
    return (await this.get('watchlist')) || [];
  }
  
  async saveRecentlyViewed(recentlyViewed: any[]): Promise<void> {
    await this.set('recently_viewed', recentlyViewed);
  }
  
  async getRecentlyViewed(): Promise<any[]> {
    return (await this.get('recently_viewed')) || [];
  }
  
  async saveRatings(ratings: any): Promise<void> {
    await this.set('ratings', ratings);
  }
  
  async getRatings(): Promise<any> {
    return (await this.get('ratings')) || {};
  }
  
  async saveReviews(reviews: any): Promise<void> {
    await this.set('reviews', reviews);
  }
  
  async getReviews(): Promise<any> {
    return (await this.get('reviews')) || {};
  }
}

export class SearchHistoryStorage extends EnhancedLocalStorage {
  constructor() {
    super('lemonnpie-search', {
      version: 1,
      encrypt: false,
      compress: false,
      ttl: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }
  
  async saveSearchHistory(history: string[]): Promise<void> {
    await this.set('history', history);
  }
  
  async getSearchHistory(): Promise<string[]> {
    return (await this.get('history')) || [];
  }
  
  async addToSearchHistory(query: string): Promise<void> {
    const history = await this.getSearchHistory();
    const filtered = history.filter(q => q !== query);
    const newHistory = [query, ...filtered].slice(0, 20);
    await this.saveSearchHistory(newHistory);
  }
  
  async removeFromSearchHistory(query: string): Promise<void> {
    const history = await this.getSearchHistory();
    const filtered = history.filter(q => q !== query);
    await this.saveSearchHistory(filtered);
  }
  
  async clearSearchHistory(): Promise<void> {
    await this.remove('history');
  }
  
  async saveSearchSuggestions(suggestions: any[]): Promise<void> {
    await this.set('suggestions', suggestions, { ttl: 24 * 60 * 60 * 1000 }); // 24 hours
  }
  
  async getSearchSuggestions(): Promise<any[]> {
    return (await this.get('suggestions')) || [];
  }
}

// Export singleton instances
export const userPreferencesStorage = new UserPreferencesStorage();
export const movieDataStorage = new MovieDataStorage();
export const searchHistoryStorage = new SearchHistoryStorage();

// Export main storage instance
export const storage = EnhancedLocalStorage.getInstance();

// React hooks for storage
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: StorageOptions = {}
): [T, (value: T) => Promise<void>, () => Promise<void>] {
  const [storedValue, setStoredValue] = React.useState<T>(initialValue);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadValue = async () => {
      try {
        const value = await storage.get<T>(key, options);
        setStoredValue(value !== null ? value : initialValue);
      } catch (error) {
        console.error('Error loading from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadValue();
  }, [key, initialValue]);
  
  const setValue = React.useCallback(async (value: T) => {
    try {
      await storage.set(key, value, options);
      setStoredValue(value);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }, [key, options]);
  
  const removeValue = React.useCallback(async () => {
    try {
      await storage.remove(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }, [key, initialValue]);
  
  return [storedValue, setValue, removeValue];
}

// Hook for storage stats
export function useStorageStats(): StorageStats | null {
  const [stats, setStats] = React.useState<StorageStats | null>(null);
  
  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const storageStats = await storage.getStats();
        setStats(storageStats);
      } catch (error) {
        console.error('Error loading storage stats:', error);
      }
    };
    
    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return stats;
}

// Utility functions
export async function clearAllAppData(): Promise<void> {
  await Promise.all([
    userPreferencesStorage.clear(),
    movieDataStorage.clear(),
    searchHistoryStorage.clear()
  ]);
}

export async function exportAllAppData(): Promise<{ [key: string]: any }> {
  const [preferences, movies, search] = await Promise.all([
    userPreferencesStorage.exportData(),
    movieDataStorage.exportData(),
    searchHistoryStorage.exportData()
  ]);
  
  return {
    preferences,
    movies,
    search,
    exportDate: new Date().toISOString()
  };
}

export async function importAllAppData(data: { [key: string]: any }): Promise<void> {
  const { preferences, movies, search } = data;
  
  await Promise.all([
    preferences && userPreferencesStorage.importData(preferences),
    movies && movieDataStorage.importData(movies),
    search && searchHistoryStorage.importData(search)
  ]);
}

// Initialize storage
export async function initializeStorage(): Promise<void> {
  try {
    // Check quota and clean up if needed
    if (await StorageQuotaManager.isQuotaExceeded()) {
      await StorageQuotaManager.cleanupOldData();
    }
    
    console.log('Storage initialized successfully');
  } catch (error) {
    console.error('Storage initialization failed:', error);
  }
} 