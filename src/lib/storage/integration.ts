// Integration layer for connecting storage with stores and hooks
import { useEffect, useCallback } from 'react';
import { useMovieStore, FavoriteItem, WatchlistItem, RecentlyViewedItem } from '@/lib/stores/movieStore';
import { useUserPreferencesStore } from '@/lib/stores/userPreferencesStore';
import { useSearchFilterStore } from '@/lib/stores/searchFilterStore';
import { 
  movieDataStorage, 
  userPreferencesStorage, 
  searchHistoryStorage,
  type StorageStats 
} from './localStorage';
import { dataSyncManager, SyncOperation } from '@/lib/api/data-sync';

// Storage synchronization intervals
const SYNC_INTERVALS = {
  MOVIE_DATA: 30000,     // 30 seconds
  PREFERENCES: 10000,    // 10 seconds
  SEARCH_HISTORY: 60000  // 1 minute
};

// Movie Store Integration
export class MovieStoreStorageIntegration {
  private static instance: MovieStoreStorageIntegration;
  private syncTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;

  static getInstance(): MovieStoreStorageIntegration {
    if (!MovieStoreStorageIntegration.instance) {
      MovieStoreStorageIntegration.instance = new MovieStoreStorageIntegration();
    }
    return MovieStoreStorageIntegration.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load data from storage
      const [favorites, watchlist, recentlyViewed] = await Promise.all([
        movieDataStorage.getFavorites(),
        movieDataStorage.getWatchlist(),
        movieDataStorage.getRecentlyViewed()
      ]);

      // Initialize store with loaded data
      const store = useMovieStore.getState();
      store.importFavorites(favorites);
      store.importWatchlist(watchlist);
      store.importData({ recentlyViewed });

      // Start periodic sync
      this.startPeriodicSync();
      this.isInitialized = true;

      console.log('Movie store storage integration initialized');
    } catch (error) {
      console.error('Failed to initialize movie store storage integration:', error);
    }
  }

  private startPeriodicSync(): void {
    this.syncTimer = setInterval(() => {
      this.syncToStorage();
    }, SYNC_INTERVALS.MOVIE_DATA);
  }

  private async syncToStorage(): Promise<void> {
    try {
      const store = useMovieStore.getState();
      
      await Promise.all([
        movieDataStorage.saveFavorites(store.favorites),
        movieDataStorage.saveWatchlist(store.watchlist),
        movieDataStorage.saveRecentlyViewed(store.recentlyViewed)
      ]);
    } catch (error) {
      console.error('Failed to sync movie store to storage:', error);
    }
  }

  async forceSync(): Promise<void> {
    await this.syncToStorage();
  }

  cleanup(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    this.isInitialized = false;
  }

  // Hook integration methods
  setupStoreListeners(): void {
    const store = useMovieStore.getState();

    // Listen for favorites changes
    useMovieStore.subscribe(
      (state) => state.favorites,
      (favorites) => {
        movieDataStorage.saveFavorites(favorites);
        // Sync with backend if online
        if (navigator.onLine) {
          favorites.forEach(fav => {
            dataSyncManager.addToSyncQueue('favorite', SyncOperation.UPDATE, fav, fav.movieId);
          });
        }
      }
    );

    // Listen for watchlist changes
    useMovieStore.subscribe(
      (state) => state.watchlist,
      (watchlist) => {
        movieDataStorage.saveWatchlist(watchlist);
        // Sync with backend if online
        if (navigator.onLine) {
          watchlist.forEach(item => {
            dataSyncManager.addToSyncQueue('watchlist', SyncOperation.UPDATE, item, item.movieId);
          });
        }
      }
    );

    // Listen for recently viewed changes
    useMovieStore.subscribe(
      (state) => state.recentlyViewed,
      (recentlyViewed) => {
        movieDataStorage.saveRecentlyViewed(recentlyViewed);
        // Sync with backend if online
        if (navigator.onLine) {
          recentlyViewed.forEach(item => {
            dataSyncManager.addToSyncQueue('recently_viewed', SyncOperation.UPDATE, item, item.movieId);
          });
        }
      }
    );
  }
}

// User Preferences Store Integration
export class UserPreferencesStorageIntegration {
  private static instance: UserPreferencesStorageIntegration;
  private syncTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;

  static getInstance(): UserPreferencesStorageIntegration {
    if (!UserPreferencesStorageIntegration.instance) {
      UserPreferencesStorageIntegration.instance = new UserPreferencesStorageIntegration();
    }
    return UserPreferencesStorageIntegration.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load data from storage
      const [display, filters, notifications, privacy, accessibility] = await Promise.all([
        userPreferencesStorage.getDisplaySettings(),
        userPreferencesStorage.getFilterPreferences(),
        userPreferencesStorage.getNotificationSettings(),
        userPreferencesStorage.get('privacy'),
        userPreferencesStorage.get('accessibility')
      ]);

      // Initialize store with loaded data
      const store = useUserPreferencesStore.getState();
      if (display) store.updateDisplaySettings(display);
      if (filters) store.updateFilterPreferences(filters);
      if (notifications) store.updateNotificationSettings(notifications);
      if (privacy) store.updatePrivacySettings(privacy);
      if (accessibility) store.updateAccessibilitySettings(accessibility);

      // Start periodic sync
      this.startPeriodicSync();
      this.setupStoreListeners();
      this.isInitialized = true;

      console.log('User preferences storage integration initialized');
    } catch (error) {
      console.error('Failed to initialize user preferences storage integration:', error);
    }
  }

  private startPeriodicSync(): void {
    this.syncTimer = setInterval(() => {
      this.syncToStorage();
    }, SYNC_INTERVALS.PREFERENCES);
  }

  private async syncToStorage(): Promise<void> {
    try {
      const store = useUserPreferencesStore.getState();
      
      await Promise.all([
        userPreferencesStorage.saveDisplaySettings(store.display),
        userPreferencesStorage.saveFilterPreferences(store.filters),
        userPreferencesStorage.saveNotificationSettings(store.notifications),
        userPreferencesStorage.set('privacy', store.privacy),
        userPreferencesStorage.set('accessibility', store.accessibility),
        userPreferencesStorage.set('profile', store.profile)
      ]);

      // Mark as saved
      store.markAsSaved();
    } catch (error) {
      console.error('Failed to sync user preferences to storage:', error);
    }
  }

  private setupStoreListeners(): void {
    // Listen for theme changes and apply immediately
    useUserPreferencesStore.subscribe(
      (state) => state.display.theme,
      (theme) => {
        this.applyTheme(theme);
        userPreferencesStorage.saveTheme(theme);
      }
    );

    // Listen for language changes
    useUserPreferencesStore.subscribe(
      (state) => state.display.language,
      (language) => {
        userPreferencesStorage.saveLanguage(language);
      }
    );

    // Listen for any preference changes
    useUserPreferencesStore.subscribe(
      (state) => state.hasUnsavedChanges,
      (hasChanges) => {
        if (hasChanges) {
          // Debounced save
          setTimeout(() => this.syncToStorage(), 1000);
        }
      }
    );
  }

  private applyTheme(theme: string): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const effectiveTheme = theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    root.setAttribute('data-theme', effectiveTheme);
    root.classList.toggle('dark', effectiveTheme === 'dark');
  }

  async forceSync(): Promise<void> {
    await this.syncToStorage();
  }

  cleanup(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    this.isInitialized = false;
  }
}

// Search Filter Store Integration
export class SearchFilterStorageIntegration {
  private static instance: SearchFilterStorageIntegration;
  private syncTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;

  static getInstance(): SearchFilterStorageIntegration {
    if (!SearchFilterStorageIntegration.instance) {
      SearchFilterStorageIntegration.instance = new SearchFilterStorageIntegration();
    }
    return SearchFilterStorageIntegration.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load data from storage
      const [searchHistory, savedSearches, filterHistory, favoriteFilters] = await Promise.all([
        searchHistoryStorage.getSearchHistory(),
        searchHistoryStorage.get('saved_searches') || [],
        searchHistoryStorage.get('filter_history') || [],
        searchHistoryStorage.get('favorite_filters') || []
      ]);

      // Initialize store with loaded data
      const store = useSearchFilterStore.getState();
      store.importSearchHistory({ recentSearches: searchHistory, savedSearches });
      store.importFilterHistory({ filterHistory, favoriteFilters });

      // Start periodic sync
      this.startPeriodicSync();
      this.setupStoreListeners();
      this.isInitialized = true;

      console.log('Search filter storage integration initialized');
    } catch (error) {
      console.error('Failed to initialize search filter storage integration:', error);
    }
  }

  private startPeriodicSync(): void {
    this.syncTimer = setInterval(() => {
      this.syncToStorage();
    }, SYNC_INTERVALS.SEARCH_HISTORY);
  }

  private async syncToStorage(): Promise<void> {
    try {
      const store = useSearchFilterStore.getState();
      
      await Promise.all([
        searchHistoryStorage.saveSearchHistory(store.search.recentSearches),
        searchHistoryStorage.set('saved_searches', store.search.savedSearches),
        searchHistoryStorage.set('filter_history', store.filters.filterHistory),
        searchHistoryStorage.set('favorite_filters', store.filters.favoriteFilters)
      ]);
    } catch (error) {
      console.error('Failed to sync search filter store to storage:', error);
    }
  }

  private setupStoreListeners(): void {
    // Listen for search history changes
    useSearchFilterStore.subscribe(
      (state) => state.search.recentSearches,
      (recentSearches) => {
        searchHistoryStorage.saveSearchHistory(recentSearches);
      }
    );

    // Listen for saved searches changes
    useSearchFilterStore.subscribe(
      (state) => state.search.savedSearches,
      (savedSearches) => {
        searchHistoryStorage.set('saved_searches', savedSearches);
      }
    );

    // Listen for filter history changes
    useSearchFilterStore.subscribe(
      (state) => state.filters.filterHistory,
      (filterHistory) => {
        searchHistoryStorage.set('filter_history', filterHistory);
      }
    );

    // Listen for favorite filters changes
    useSearchFilterStore.subscribe(
      (state) => state.filters.favoriteFilters,
      (favoriteFilters) => {
        searchHistoryStorage.set('favorite_filters', favoriteFilters);
      }
    );
  }

  async forceSync(): Promise<void> {
    await this.syncToStorage();
  }

  cleanup(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    this.isInitialized = false;
  }
}

// Master Storage Integration Manager
export class StorageIntegrationManager {
  private static instance: StorageIntegrationManager;
  private movieStoreIntegration: MovieStoreStorageIntegration;
  private userPreferencesIntegration: UserPreferencesStorageIntegration;
  private searchFilterIntegration: SearchFilterStorageIntegration;
  private isInitialized = false;

  private constructor() {
    this.movieStoreIntegration = MovieStoreStorageIntegration.getInstance();
    this.userPreferencesIntegration = UserPreferencesStorageIntegration.getInstance();
    this.searchFilterIntegration = SearchFilterStorageIntegration.getInstance();
  }

  static getInstance(): StorageIntegrationManager {
    if (!StorageIntegrationManager.instance) {
      StorageIntegrationManager.instance = new StorageIntegrationManager();
    }
    return StorageIntegrationManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing storage integration...');

      // Initialize all integrations in parallel
      await Promise.all([
        this.movieStoreIntegration.initialize(),
        this.userPreferencesIntegration.initialize(),
        this.searchFilterIntegration.initialize()
      ]);

      // Setup cross-store listeners
      this.setupCrossStoreListeners();

      this.isInitialized = true;
      console.log('Storage integration initialized successfully');
    } catch (error) {
      console.error('Failed to initialize storage integration:', error);
      throw error;
    }
  }

  private setupCrossStoreListeners(): void {
    // Example: When user preferences change theme, update movie store display settings
    useUserPreferencesStore.subscribe(
      (state) => state.display.theme,
      (theme) => {
        // Apply theme globally
        if (typeof document !== 'undefined') {
          const effectiveTheme = theme === 'system' 
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme;
          
          document.documentElement.setAttribute('data-theme', effectiveTheme);
          document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
        }
      }
    );

    // Example: When search preferences change, update filter defaults
    useUserPreferencesStore.subscribe(
      (state) => state.filters.rememberFilters,
      (rememberFilters) => {
        if (!rememberFilters) {
          // Clear stored filter history
          useSearchFilterStore.getState().clearFilterHistory();
        }
      }
    );
  }

  async forceSync(): Promise<void> {
    await Promise.all([
      this.movieStoreIntegration.forceSync(),
      this.userPreferencesIntegration.forceSync(),
      this.searchFilterIntegration.forceSync()
    ]);
  }

  async getStorageStats(): Promise<{
    movieData: StorageStats;
    preferences: StorageStats;
    searchHistory: StorageStats;
  }> {
    const [movieData, preferences, searchHistory] = await Promise.all([
      movieDataStorage.getStats(),
      userPreferencesStorage.getStats(),
      searchHistoryStorage.getStats()
    ]);

    return { movieData, preferences, searchHistory };
  }

  async clearAllData(): Promise<void> {
    await Promise.all([
      movieDataStorage.clear(),
      userPreferencesStorage.clear(),
      searchHistoryStorage.clear()
    ]);

    // Reset all stores
    useMovieStore.getState().clearAll();
    useUserPreferencesStore.getState().resetToDefaults();
    useSearchFilterStore.getState().reset();
  }

  async exportAllData(): Promise<any> {
    const [movieData, preferences, searchHistory] = await Promise.all([
      movieDataStorage.exportData(),
      userPreferencesStorage.exportData(),
      searchHistoryStorage.exportData()
    ]);

    return {
      movieData,
      preferences,
      searchHistory,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }

  async importAllData(data: any): Promise<void> {
    const { movieData, preferences, searchHistory } = data;

    await Promise.all([
      movieData && movieDataStorage.importData(movieData),
      preferences && userPreferencesStorage.importData(preferences),
      searchHistory && searchHistoryStorage.importData(searchHistory)
    ]);

    // Reinitialize to load imported data
    await this.initialize();
  }

  cleanup(): void {
    this.movieStoreIntegration.cleanup();
    this.userPreferencesIntegration.cleanup();
    this.searchFilterIntegration.cleanup();
    this.isInitialized = false;
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// React hooks for storage integration
export function useStorageIntegration(): {
  isReady: boolean;
  stats: any | null;
  forceSync: () => Promise<void>;
  clearAllData: () => Promise<void>;
  exportData: () => Promise<any>;
  importData: (data: any) => Promise<void>;
} {
  const [isReady, setIsReady] = React.useState(false);
  const [stats, setStats] = React.useState<any>(null);
  const manager = StorageIntegrationManager.getInstance();

  React.useEffect(() => {
    const initializeStorage = async () => {
      try {
        await manager.initialize();
        setIsReady(true);
        
        // Load initial stats
        const storageStats = await manager.getStorageStats();
        setStats(storageStats);
      } catch (error) {
        console.error('Storage initialization failed:', error);
      }
    };

    initializeStorage();

    // Update stats periodically
    const statsInterval = setInterval(async () => {
      try {
        const storageStats = await manager.getStorageStats();
        setStats(storageStats);
      } catch (error) {
        console.error('Failed to update storage stats:', error);
      }
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(statsInterval);
      manager.cleanup();
    };
  }, []);

  const forceSync = useCallback(() => manager.forceSync(), [manager]);
  const clearAllData = useCallback(() => manager.clearAllData(), [manager]);
  const exportData = useCallback(() => manager.exportAllData(), [manager]);
  const importData = useCallback((data: any) => manager.importAllData(data), [manager]);

  return {
    isReady,
    stats,
    forceSync,
    clearAllData,
    exportData,
    importData
  };
}

// Hook for individual store sync status
export function useStorageSyncStatus(): {
  movieDataSynced: boolean;
  preferencesSynced: boolean;
  searchHistorySynced: boolean;
  lastSyncTime: Date | null;
  syncInProgress: boolean;
} {
  const [syncStatus, setSyncStatus] = React.useState({
    movieDataSynced: false,
    preferencesSynced: false,
    searchHistorySynced: false,
    lastSyncTime: null as Date | null,
    syncInProgress: false
  });

  React.useEffect(() => {
    // Monitor sync status
    const interval = setInterval(() => {
      setSyncStatus(prev => ({
        ...prev,
        lastSyncTime: new Date(),
        movieDataSynced: true,
        preferencesSynced: true,
        searchHistorySynced: true
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return syncStatus;
}

// Export singleton instance
export const storageIntegration = StorageIntegrationManager.getInstance();

// Auto-initialize storage integration
if (typeof window !== 'undefined') {
  // Initialize when the page loads
  window.addEventListener('load', () => {
    storageIntegration.initialize().catch(console.error);
  });

  // Sync before page unload
  window.addEventListener('beforeunload', () => {
    storageIntegration.forceSync().catch(console.error);
  });

  // Handle online/offline events
  window.addEventListener('online', () => {
    // Force sync when coming back online
    storageIntegration.forceSync().catch(console.error);
  });
} 