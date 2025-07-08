import { Movie } from "@/types/movie";
import { movieData, relatedMovies, movieReviews } from "@/data/movies";

// API Configuration
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  cacheTime: number;
  staleTime: number;
  enableOfflineMode: boolean;
  apiKey?: string;
}

export const defaultApiConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  maxRetries: 3,
  retryDelay: 1000,
  cacheTime: 10 * 60 * 1000, // 10 minutes
  staleTime: 5 * 60 * 1000,   // 5 minutes
  enableOfflineMode: true
};

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

// Cache interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
  staleTime: number;
  key: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  memoryUsage: number;
}

// Advanced caching system
class MovieApiCache {
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 100;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    size: 0,
    memoryUsage: 0
  };

  set<T>(key: string, data: T, staleTime: number = defaultApiConfig.staleTime): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      staleTime,
      key
    });

    this.updateStats();
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    const isStale = Date.now() - item.timestamp > item.staleTime;
    
    if (isStale) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    this.stats.hits++;
    this.updateStats();
    return item.data;
  }

  has(key: string): boolean {
    return this.cache.has(key) && !this.isStale(key);
  }

  isStale(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;
    return Date.now() - item.timestamp > item.staleTime;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    this.updateStats();
  }

  invalidatePattern(pattern: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(pattern)
    );
    keysToDelete.forEach(key => this.cache.delete(key));
    this.updateStats();
  }

  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      size: 0,
      memoryUsage: 0
    };
    this.updateStats();
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  private updateStats(): void {
    this.stats.size = this.cache.size;
    this.stats.hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) * 100;
    this.stats.memoryUsage = this.estimateMemoryUsage();
  }

  private estimateMemoryUsage(): number {
    let size = 0;
    for (const [key, item] of this.cache) {
      size += key.length * 2; // Unicode characters are 2 bytes
      size += JSON.stringify(item).length * 2;
    }
    return size;
  }

  // Preload functionality
  preload<T>(key: string, dataProvider: () => Promise<T>, staleTime?: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const cached = this.get<T>(key);
      if (cached) {
        resolve(cached);
        return;
      }

      dataProvider()
        .then(data => {
          this.set(key, data, staleTime);
          resolve(data);
        })
        .catch(reject);
    });
  }
}

// Request queue for managing concurrent requests
class RequestQueue {
  private queue = new Map<string, Promise<any>>();

  async enqueue<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // If request is already in progress, return the existing promise
    if (this.queue.has(key)) {
      return this.queue.get(key)!;
    }

    // Create new request
    const promise = requestFn()
      .finally(() => {
        this.queue.delete(key);
      });

    this.queue.set(key, promise);
    return promise;
  }

  isInProgress(key: string): boolean {
    return this.queue.has(key);
  }

  clear(): void {
    this.queue.clear();
  }
}

// Offline storage interface
interface OfflineStorage {
  set(key: string, data: any): Promise<void>;
  get(key: string): Promise<any>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

// IndexedDB implementation for offline storage
class IndexedDBStorage implements OfflineStorage {
  private dbName = 'lemonnpie-offline';
  private dbVersion = 1;
  private storeName = 'movies';

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async set(key: string, data: any): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data, key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get(key: string): Promise<any> {
    const db = await this.getDB();
    const transaction = db.transaction([this.storeName], 'readonly');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async remove(key: string): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction([this.storeName], 'readwrite');
    const store = transaction.objectStore(this.storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Main API class
export class MovieApiClient {
  private config: ApiConfig;
  private cache: MovieApiCache;
  private requestQueue: RequestQueue;
  private offlineStorage: OfflineStorage;
  private isOnline: boolean = true;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultApiConfig, ...config };
    this.cache = new MovieApiCache();
    this.requestQueue = new RequestQueue();
    this.offlineStorage = new IndexedDBStorage();
    
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncOfflineData();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
      
      this.isOnline = navigator.onLine;
    }
  }

  // Core request method with retries and timeout
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `API Error: ${response.statusText}`,
          response.status,
          'API_ERROR',
          await response.json().catch(() => null)
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TimeoutError('Request timed out');
      }

      if (error instanceof TypeError) {
        throw new NetworkError('Network error occurred');
      }

      // Retry logic
      if (retryCount < this.config.maxRetries && this.shouldRetry(error)) {
        await this.delay(this.config.retryDelay * Math.pow(2, retryCount));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      throw error;
    }
  }

  private shouldRetry(error: any): boolean {
    return (
      error instanceof NetworkError ||
      error instanceof TimeoutError ||
      (error instanceof ApiError && error.status >= 500)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Sync offline data when back online
  private async syncOfflineData(): Promise<void> {
    // Implementation would sync any pending changes
    console.log('Syncing offline data...');
  }

  // Enhanced movie fetching methods
  async getMovies(options: {
    useCache?: boolean;
    forceFresh?: boolean;
    includeOffline?: boolean;
  } = {}): Promise<Movie[]> {
    const { useCache = true, forceFresh = false, includeOffline = true } = options;
    const cacheKey = 'movies:all';

    // Check cache first
    if (useCache && !forceFresh) {
      const cached = this.cache.get<Movie[]>(cacheKey);
      if (cached) return cached;
    }

    // Check offline storage if offline
    if (!this.isOnline && includeOffline) {
      const offline = await this.offlineStorage.get(cacheKey);
      if (offline) return offline;
    }

    return this.requestQueue.enqueue(cacheKey, async () => {
      try {
        // In production, this would be an API call
        const movies = Object.values(movieData);
        
        // Cache the result
        this.cache.set(cacheKey, movies);
        
        // Store offline if enabled
        if (this.config.enableOfflineMode) {
          await this.offlineStorage.set(cacheKey, movies);
        }
        
        return movies;
      } catch (error) {
        // Fallback to offline data if available
        if (includeOffline) {
          const offline = await this.offlineStorage.get(cacheKey);
          if (offline) return offline;
        }
        throw error;
      }
    });
  }

  async getMovie(id: string, options: {
    useCache?: boolean;
    forceFresh?: boolean;
    includeOffline?: boolean;
  } = {}): Promise<Movie | null> {
    const { useCache = true, forceFresh = false, includeOffline = true } = options;
    const cacheKey = `movie:${id}`;

    // Check cache first
    if (useCache && !forceFresh) {
      const cached = this.cache.get<Movie>(cacheKey);
      if (cached) return cached;
    }

    // Check offline storage if offline
    if (!this.isOnline && includeOffline) {
      const offline = await this.offlineStorage.get(cacheKey);
      if (offline) return offline;
    }

    return this.requestQueue.enqueue(cacheKey, async () => {
      try {
        // In production, this would be an API call
        const movie = movieData[id] || null;
        
        if (movie) {
          // Cache the result
          this.cache.set(cacheKey, movie);
          
          // Store offline if enabled
          if (this.config.enableOfflineMode) {
            await this.offlineStorage.set(cacheKey, movie);
          }
        }
        
        return movie;
      } catch (error) {
        // Fallback to offline data if available
        if (includeOffline) {
          const offline = await this.offlineStorage.get(cacheKey);
          if (offline) return offline;
        }
        throw error;
      }
    });
  }

  async getTopRatedMovies(limit: number = 10, options: {
    useCache?: boolean;
    forceFresh?: boolean;
  } = {}): Promise<Movie[]> {
    const { useCache = true, forceFresh = false } = options;
    const cacheKey = `movies:top-rated:${limit}`;

    if (useCache && !forceFresh) {
      const cached = this.cache.get<Movie[]>(cacheKey);
      if (cached) return cached;
    }

    return this.requestQueue.enqueue(cacheKey, async () => {
      const movies = await this.getMovies();
      const topRated = movies
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
      
      this.cache.set(cacheKey, topRated);
      return topRated;
    });
  }

  async getMoviesByGenre(genre: string, options: {
    useCache?: boolean;
    forceFresh?: boolean;
  } = {}): Promise<Movie[]> {
    const { useCache = true, forceFresh = false } = options;
    const cacheKey = `movies:genre:${genre}`;

    if (useCache && !forceFresh) {
      const cached = this.cache.get<Movie[]>(cacheKey);
      if (cached) return cached;
    }

    return this.requestQueue.enqueue(cacheKey, async () => {
      const movies = await this.getMovies();
      const filtered = movies.filter(movie => 
        movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      );
      
      this.cache.set(cacheKey, filtered);
      return filtered;
    });
  }

  async getMoviesByYear(year: number, options: {
    useCache?: boolean;
    forceFresh?: boolean;
  } = {}): Promise<Movie[]> {
    const { useCache = true, forceFresh = false } = options;
    const cacheKey = `movies:year:${year}`;

    if (useCache && !forceFresh) {
      const cached = this.cache.get<Movie[]>(cacheKey);
      if (cached) return cached;
    }

    return this.requestQueue.enqueue(cacheKey, async () => {
      const movies = await this.getMovies();
      const filtered = movies.filter(movie => movie.year === year);
      
      this.cache.set(cacheKey, filtered);
      return filtered;
    });
  }

  async searchMovies(query: string, options: {
    useCache?: boolean;
    forceFresh?: boolean;
  } = {}): Promise<Movie[]> {
    const { useCache = true, forceFresh = false } = options;
    const cacheKey = `search:${query}`;

    if (useCache && !forceFresh) {
      const cached = this.cache.get<Movie[]>(cacheKey);
      if (cached) return cached;
    }

    return this.requestQueue.enqueue(cacheKey, async () => {
      const movies = await this.getMovies();
      const searchTerm = query.toLowerCase();
      
      const filtered = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.director.toLowerCase().includes(searchTerm) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm)) ||
        movie.description.toLowerCase().includes(searchTerm)
      );
      
      this.cache.set(cacheKey, filtered, 2 * 60 * 1000); // Search results cache for 2 minutes
      return filtered;
    });
  }

  async getRelatedMovies(movieId: string, options: {
    useCache?: boolean;
    forceFresh?: boolean;
  } = {}): Promise<Movie[]> {
    const { useCache = true, forceFresh = false } = options;
    const cacheKey = `related:${movieId}`;

    if (useCache && !forceFresh) {
      const cached = this.cache.get<Movie[]>(cacheKey);
      if (cached) return cached;
    }

    return this.requestQueue.enqueue(cacheKey, async () => {
      // In production, this would use actual logic to find related movies
      const related = relatedMovies as Movie[];
      
      this.cache.set(cacheKey, related);
      return related;
    });
  }

  async getMovieReviews(movieId: string, options: {
    useCache?: boolean;
    forceFresh?: boolean;
  } = {}): Promise<any[]> {
    const { useCache = true, forceFresh = false } = options;
    const cacheKey = `reviews:${movieId}`;

    if (useCache && !forceFresh) {
      const cached = this.cache.get<any[]>(cacheKey);
      if (cached) return cached;
    }

    return this.requestQueue.enqueue(cacheKey, async () => {
      // In production, this would filter reviews by movie ID
      const reviews = movieReviews;
      
      this.cache.set(cacheKey, reviews);
      return reviews;
    });
  }

  // Cache management methods
  getCacheStats(): CacheStats {
    return this.cache.getStats();
  }

  invalidateCache(pattern?: string): void {
    if (pattern) {
      this.cache.invalidatePattern(pattern);
    } else {
      this.cache.clear();
    }
  }

  // Preload methods
  async preloadMovie(id: string): Promise<Movie | null> {
    return this.cache.preload(`movie:${id}`, () => this.getMovie(id, { useCache: false }));
  }

  async preloadMovies(ids: string[]): Promise<(Movie | null)[]> {
    const promises = ids.map(id => this.preloadMovie(id));
    return Promise.all(promises);
  }

  // Configuration methods
  updateConfig(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): ApiConfig {
    return { ...this.config };
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: number; latency: number }> {
    const start = Date.now();
    
    try {
      // In production, this would be an actual health check endpoint
      await this.delay(50); // Simulate network latency
      
      return {
        status: 'healthy',
        timestamp: Date.now(),
        latency: Date.now() - start
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: Date.now(),
        latency: Date.now() - start
      };
    }
  }

  // Cleanup
  cleanup(): void {
    this.cache.clear();
    this.requestQueue.clear();
  }
}

// Export singleton instance
export const movieApi = new MovieApiClient();

// Legacy API compatibility - these functions now use the enhanced API client
export async function getMovies(): Promise<Movie[]> {
  return movieApi.getMovies();
}

export async function getMovie(id: string): Promise<Movie | null> {
  return movieApi.getMovie(id);
}

export async function getRelatedMovies(movieId: string): Promise<Movie[]> {
  return movieApi.getRelatedMovies(movieId);
}

export async function getMovieReviews(movieId: string) {
  return movieApi.getMovieReviews(movieId);
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  return movieApi.getTopRatedMovies();
}

export async function getMoviesByGenre(genre: string): Promise<Movie[]> {
  return movieApi.getMoviesByGenre(genre);
}

export async function getMoviesByYear(year: number): Promise<Movie[]> {
  return movieApi.getMoviesByYear(year);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  return movieApi.searchMovies(query);
}

// Export error types for use in components
export { ApiError, NetworkError, TimeoutError }; 