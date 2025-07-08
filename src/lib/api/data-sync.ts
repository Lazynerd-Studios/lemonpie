// Data synchronization utility for backend integration
import { Movie } from '@/types/movie';
import { FavoriteItem, WatchlistItem, RecentlyViewedItem } from '@/lib/stores/movieStore';
import { BackgroundSyncManager } from './service-worker';

// Sync operations
export enum SyncOperation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export enum SyncStatus {
  PENDING = 'PENDING',
  SYNCING = 'SYNCING',
  SYNCED = 'SYNCED',
  FAILED = 'FAILED',
  CONFLICT = 'CONFLICT'
}

export interface SyncItem {
  id: string;
  type: 'favorite' | 'watchlist' | 'recently_viewed' | 'rating' | 'review';
  operation: SyncOperation;
  data: any;
  timestamp: number;
  status: SyncStatus;
  retryCount: number;
  lastError?: string;
  conflictData?: any;
}

export interface SyncConflict {
  id: string;
  type: string;
  localData: any;
  remoteData: any;
  timestamp: number;
  resolved: boolean;
  resolution?: 'local' | 'remote' | 'merge';
}

export interface SyncStats {
  totalItems: number;
  pendingItems: number;
  syncedItems: number;
  failedItems: number;
  conflictItems: number;
  lastSyncTime: Date | null;
  nextSyncTime: Date | null;
}

// Conflict resolution strategies
export enum ConflictResolutionStrategy {
  LAST_WRITE_WINS = 'LAST_WRITE_WINS',
  FIRST_WRITE_WINS = 'FIRST_WRITE_WINS',
  MERGE = 'MERGE',
  MANUAL = 'MANUAL'
}

export interface ConflictResolver {
  strategy: ConflictResolutionStrategy;
  resolve(localData: any, remoteData: any): any;
}

// Default conflict resolvers
export const defaultConflictResolvers: Record<string, ConflictResolver> = {
  favorite: {
    strategy: ConflictResolutionStrategy.LAST_WRITE_WINS,
    resolve: (localData: FavoriteItem, remoteData: FavoriteItem) => {
      return new Date(localData.addedAt) > new Date(remoteData.addedAt) ? localData : remoteData;
    }
  },
  watchlist: {
    strategy: ConflictResolutionStrategy.LAST_WRITE_WINS,
    resolve: (localData: WatchlistItem, remoteData: WatchlistItem) => {
      return new Date(localData.addedAt) > new Date(remoteData.addedAt) ? localData : remoteData;
    }
  },
  recently_viewed: {
    strategy: ConflictResolutionStrategy.MERGE,
    resolve: (localData: RecentlyViewedItem, remoteData: RecentlyViewedItem) => {
      return {
        ...remoteData,
        viewCount: Math.max(localData.viewCount, remoteData.viewCount),
        watchTime: Math.max(localData.watchTime || 0, remoteData.watchTime || 0),
        lastPosition: localData.lastPosition || remoteData.lastPosition,
        viewedAt: new Date(Math.max(new Date(localData.viewedAt).getTime(), new Date(remoteData.viewedAt).getTime()))
      };
    }
  },
  rating: {
    strategy: ConflictResolutionStrategy.LAST_WRITE_WINS,
    resolve: (localData: any, remoteData: any) => {
      return localData.timestamp > remoteData.timestamp ? localData : remoteData;
    }
  },
  review: {
    strategy: ConflictResolutionStrategy.LAST_WRITE_WINS,
    resolve: (localData: any, remoteData: any) => {
      return localData.timestamp > remoteData.timestamp ? localData : remoteData;
    }
  }
};

// Data synchronization manager
export class DataSyncManager {
  private static instance: DataSyncManager;
  private syncQueue: SyncItem[] = [];
  private conflicts: SyncConflict[] = [];
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private syncInterval: number = 5 * 60 * 1000; // 5 minutes
  private maxRetries: number = 3;
  private conflictResolvers: Record<string, ConflictResolver> = defaultConflictResolvers;
  private syncTimer: NodeJS.Timeout | null = null;
  private listeners: Array<(stats: SyncStats) => void> = [];

  static getInstance(): DataSyncManager {
    if (!DataSyncManager.instance) {
      DataSyncManager.instance = new DataSyncManager();
    }
    return DataSyncManager.instance;
  }

  initialize(): void {
    this.loadSyncQueue();
    this.loadConflicts();
    this.startPeriodicSync();
    
    // Listen for network changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.processSyncQueue();
      });
      
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
      
      this.isOnline = navigator.onLine;
    }
  }

  // Add item to sync queue
  addToSyncQueue(
    type: SyncItem['type'],
    operation: SyncOperation,
    data: any,
    id?: string
  ): void {
    const syncItem: SyncItem = {
      id: id || this.generateId(),
      type,
      operation,
      data,
      timestamp: Date.now(),
      status: SyncStatus.PENDING,
      retryCount: 0
    };

    // Remove any existing item with same id and type
    this.syncQueue = this.syncQueue.filter(item => 
      !(item.id === syncItem.id && item.type === syncItem.type)
    );

    this.syncQueue.push(syncItem);
    this.persistSyncQueue();
    this.notifyListeners();

    // Try to sync immediately if online
    if (this.isOnline && !this.isSyncing) {
      this.processSyncQueue();
    }
  }

  // Process sync queue
  private async processSyncQueue(): Promise<void> {
    if (this.isSyncing || !this.isOnline) return;

    this.isSyncing = true;
    const pendingItems = this.syncQueue.filter(item => 
      item.status === SyncStatus.PENDING || item.status === SyncStatus.FAILED
    );

    for (const item of pendingItems) {
      try {
        item.status = SyncStatus.SYNCING;
        await this.syncItem(item);
        item.status = SyncStatus.SYNCED;
      } catch (error) {
        item.status = SyncStatus.FAILED;
        item.lastError = error instanceof Error ? error.message : 'Unknown error';
        item.retryCount++;

        if (item.retryCount >= this.maxRetries) {
          console.error(`Max retries reached for sync item ${item.id}:`, error);
        }
      }
    }

    this.isSyncing = false;
    this.persistSyncQueue();
    this.notifyListeners();
  }

  // Sync individual item
  private async syncItem(item: SyncItem): Promise<void> {
    try {
      const response = await this.sendToBackend(item);
      
      if (response.conflict) {
        // Handle conflict
        const conflict: SyncConflict = {
          id: item.id,
          type: item.type,
          localData: item.data,
          remoteData: response.data,
          timestamp: Date.now(),
          resolved: false
        };

        this.conflicts.push(conflict);
        item.status = SyncStatus.CONFLICT;
        item.conflictData = response.data;
        
        // Try to auto-resolve conflict
        this.resolveConflict(conflict);
      } else {
        // Sync successful
        item.status = SyncStatus.SYNCED;
      }
    } catch (error) {
      throw error;
    }
  }

  // Send data to backend
  private async sendToBackend(item: SyncItem): Promise<any> {
    // This would be the actual API call to the backend
    // For now, we'll simulate the response
    
    const endpoint = this.getEndpointForItem(item);
    const method = this.getMethodForOperation(item.operation);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate random conflicts (10% chance)
    if (Math.random() < 0.1) {
      return {
        conflict: true,
        data: { ...item.data, timestamp: Date.now() - 1000 }
      };
    }
    
    // Simulate success
    return {
      success: true,
      data: item.data
    };
  }

  private getEndpointForItem(item: SyncItem): string {
    switch (item.type) {
      case 'favorite':
        return '/api/favorites';
      case 'watchlist':
        return '/api/watchlist';
      case 'recently_viewed':
        return '/api/recently-viewed';
      case 'rating':
        return '/api/ratings';
      case 'review':
        return '/api/reviews';
      default:
        throw new Error(`Unknown sync item type: ${item.type}`);
    }
  }

  private getMethodForOperation(operation: SyncOperation): string {
    switch (operation) {
      case SyncOperation.CREATE:
        return 'POST';
      case SyncOperation.UPDATE:
        return 'PUT';
      case SyncOperation.DELETE:
        return 'DELETE';
      default:
        throw new Error(`Unknown sync operation: ${operation}`);
    }
  }

  // Resolve conflict
  private resolveConflict(conflict: SyncConflict): void {
    const resolver = this.conflictResolvers[conflict.type];
    if (!resolver) {
      console.warn(`No conflict resolver for type: ${conflict.type}`);
      return;
    }

    if (resolver.strategy === ConflictResolutionStrategy.MANUAL) {
      // Manual resolution required
      this.persistConflicts();
      return;
    }

    try {
      const resolvedData = resolver.resolve(conflict.localData, conflict.remoteData);
      
      // Update local data with resolved data
      this.updateLocalData(conflict.type, conflict.id, resolvedData);
      
      // Mark conflict as resolved
      conflict.resolved = true;
      conflict.resolution = resolver.strategy === ConflictResolutionStrategy.MERGE ? 'merge' : 
                           resolvedData === conflict.localData ? 'local' : 'remote';
      
      this.persistConflicts();
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
    }
  }

  // Update local data after conflict resolution
  private updateLocalData(type: string, id: string, data: any): void {
    // This would update the local store
    // Implementation depends on how stores are structured
    console.log(`Updating local ${type} data for ${id}:`, data);
  }

  // Manual conflict resolution
  resolveConflictManually(
    conflictId: string,
    resolution: 'local' | 'remote' | 'merge',
    mergedData?: any
  ): void {
    const conflict = this.conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    let resolvedData: any;
    switch (resolution) {
      case 'local':
        resolvedData = conflict.localData;
        break;
      case 'remote':
        resolvedData = conflict.remoteData;
        break;
      case 'merge':
        resolvedData = mergedData || conflict.localData;
        break;
    }

    this.updateLocalData(conflict.type, conflict.id, resolvedData);
    
    conflict.resolved = true;
    conflict.resolution = resolution;
    
    this.persistConflicts();
    this.notifyListeners();
  }

  // Periodic sync
  private startPeriodicSync(): void {
    this.syncTimer = setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.processSyncQueue();
      }
    }, this.syncInterval);
  }

  private stopPeriodicSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  // Full sync from backend
  async fullSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot perform full sync while offline');
    }

    try {
      // Fetch all data from backend
      const remoteData = await this.fetchAllFromBackend();
      
      // Compare with local data and resolve conflicts
      await this.compareAndResolve(remoteData);
      
      // Process any pending local changes
      await this.processSyncQueue();
      
      console.log('Full sync completed');
    } catch (error) {
      console.error('Full sync failed:', error);
      throw error;
    }
  }

  private async fetchAllFromBackend(): Promise<any> {
    // This would fetch all user data from backend
    // For now, return empty data
    return {
      favorites: [],
      watchlist: [],
      recentlyViewed: [],
      ratings: [],
      reviews: []
    };
  }

  private async compareAndResolve(remoteData: any): Promise<void> {
    // Compare local and remote data
    // Create conflicts for mismatches
    // Auto-resolve where possible
    console.log('Comparing local and remote data:', remoteData);
  }

  // Persistence methods
  private persistSyncQueue(): void {
    try {
      localStorage.setItem('lemonnpie-sync-queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to persist sync queue:', error);
    }
  }

  private loadSyncQueue(): void {
    try {
      const stored = localStorage.getItem('lemonnpie-sync-queue');
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  private persistConflicts(): void {
    try {
      localStorage.setItem('lemonnpie-conflicts', JSON.stringify(this.conflicts));
    } catch (error) {
      console.error('Failed to persist conflicts:', error);
    }
  }

  private loadConflicts(): void {
    try {
      const stored = localStorage.getItem('lemonnpie-conflicts');
      if (stored) {
        this.conflicts = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load conflicts:', error);
    }
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private notifyListeners(): void {
    const stats = this.getStats();
    this.listeners.forEach(listener => listener(stats));
  }

  // Public methods
  getStats(): SyncStats {
    const totalItems = this.syncQueue.length;
    const pendingItems = this.syncQueue.filter(item => item.status === SyncStatus.PENDING).length;
    const syncedItems = this.syncQueue.filter(item => item.status === SyncStatus.SYNCED).length;
    const failedItems = this.syncQueue.filter(item => item.status === SyncStatus.FAILED).length;
    const conflictItems = this.conflicts.filter(conflict => !conflict.resolved).length;

    return {
      totalItems,
      pendingItems,
      syncedItems,
      failedItems,
      conflictItems,
      lastSyncTime: this.getLastSyncTime(),
      nextSyncTime: this.getNextSyncTime()
    };
  }

  private getLastSyncTime(): Date | null {
    const syncedItems = this.syncQueue.filter(item => item.status === SyncStatus.SYNCED);
    if (syncedItems.length === 0) return null;
    
    const lastSyncTimestamp = Math.max(...syncedItems.map(item => item.timestamp));
    return new Date(lastSyncTimestamp);
  }

  private getNextSyncTime(): Date | null {
    const pendingItems = this.syncQueue.filter(item => 
      item.status === SyncStatus.PENDING || item.status === SyncStatus.FAILED
    );
    
    if (pendingItems.length === 0) return null;
    
    return new Date(Date.now() + this.syncInterval);
  }

  getConflicts(): SyncConflict[] {
    return this.conflicts.filter(conflict => !conflict.resolved);
  }

  getSyncQueue(): SyncItem[] {
    return [...this.syncQueue];
  }

  addListener(listener: (stats: SyncStats) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (stats: SyncStats) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  setConflictResolver(type: string, resolver: ConflictResolver): void {
    this.conflictResolvers[type] = resolver;
  }

  setSyncInterval(interval: number): void {
    this.syncInterval = interval;
    this.stopPeriodicSync();
    this.startPeriodicSync();
  }

  // Force sync
  async forceSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    await this.processSyncQueue();
  }

  // Clear sync data
  clearSyncData(): void {
    this.syncQueue = [];
    this.conflicts = [];
    this.persistSyncQueue();
    this.persistConflicts();
    this.notifyListeners();
  }

  // Cleanup
  cleanup(): void {
    this.stopPeriodicSync();
    this.listeners = [];
  }
}

// Export singleton instance
export const dataSyncManager = DataSyncManager.getInstance();

// Helper functions for common sync operations
export function syncFavorite(movieId: string, operation: SyncOperation, data: FavoriteItem): void {
  dataSyncManager.addToSyncQueue('favorite', operation, data, movieId);
}

export function syncWatchlist(movieId: string, operation: SyncOperation, data: WatchlistItem): void {
  dataSyncManager.addToSyncQueue('watchlist', operation, data, movieId);
}

export function syncRecentlyViewed(movieId: string, data: RecentlyViewedItem): void {
  dataSyncManager.addToSyncQueue('recently_viewed', SyncOperation.UPDATE, data, movieId);
}

export function syncRating(movieId: string, rating: number): void {
  dataSyncManager.addToSyncQueue('rating', SyncOperation.UPDATE, { movieId, rating, timestamp: Date.now() }, movieId);
}

export function syncReview(movieId: string, review: string): void {
  dataSyncManager.addToSyncQueue('review', SyncOperation.UPDATE, { movieId, review, timestamp: Date.now() }, movieId);
}

// Hook for using sync in React components
export function useSyncManager(): {
  stats: SyncStats;
  conflicts: SyncConflict[];
  forceSync: () => Promise<void>;
  fullSync: () => Promise<void>;
  resolveConflict: (conflictId: string, resolution: 'local' | 'remote' | 'merge', mergedData?: any) => void;
  clearSyncData: () => void;
} {
  const [stats, setStats] = React.useState<SyncStats>(() => dataSyncManager.getStats());
  const [conflicts, setConflicts] = React.useState<SyncConflict[]>(() => dataSyncManager.getConflicts());

  React.useEffect(() => {
    const updateStats = (newStats: SyncStats) => {
      setStats(newStats);
      setConflicts(dataSyncManager.getConflicts());
    };

    dataSyncManager.addListener(updateStats);
    return () => dataSyncManager.removeListener(updateStats);
  }, []);

  return {
    stats,
    conflicts,
    forceSync: () => dataSyncManager.forceSync(),
    fullSync: () => dataSyncManager.fullSync(),
    resolveConflict: (conflictId, resolution, mergedData) => 
      dataSyncManager.resolveConflictManually(conflictId, resolution, mergedData),
    clearSyncData: () => dataSyncManager.clearSyncData()
  };
}

// Initialize data sync manager
export function initializeDataSync(): void {
  dataSyncManager.initialize();
} 