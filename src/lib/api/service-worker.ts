// Service Worker for offline functionality and caching
// This file would be registered in the main app

export interface CacheStrategy {
  name: string;
  pattern: RegExp;
  handler: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate' | 'NetworkOnly' | 'CacheOnly';
  options?: {
    cacheName?: string;
    expiration?: {
      maxEntries?: number;
      maxAgeSeconds?: number;
    };
    cacheKeyWillBeUsed?: (request: Request) => string;
    cacheWillUpdate?: (response: Response) => boolean;
    fetchDidFail?: (error: Error) => void;
  };
}

export const cacheStrategies: CacheStrategy[] = [
  // Static assets - Cache First
  {
    name: 'static-assets',
    pattern: /\.(js|css|woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-assets',
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      }
    }
  },
  
  // API calls - Network First with cache fallback
  {
    name: 'api-calls',
    pattern: /\/api\//,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 5 * 60 // 5 minutes
      }
    }
  },
  
  // Movie images - Stale While Revalidate
  {
    name: 'movie-images',
    pattern: /\/api\/placeholder\/movie\//,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'movie-images',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      }
    }
  },
  
  // HTML pages - Network First
  {
    name: 'html-pages',
    pattern: /\.html$/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'html-pages',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      }
    }
  }
];

// Background sync for offline actions
export interface BackgroundSyncConfig {
  tag: string;
  action: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export class BackgroundSyncManager {
  private static instance: BackgroundSyncManager;
  private pendingActions: BackgroundSyncConfig[] = [];
  private readonly STORAGE_KEY = 'lemonnpie-background-sync';

  static getInstance(): BackgroundSyncManager {
    if (!BackgroundSyncManager.instance) {
      BackgroundSyncManager.instance = new BackgroundSyncManager();
    }
    return BackgroundSyncManager.instance;
  }

  async addAction(tag: string, action: string, data: any): Promise<void> {
    const syncConfig: BackgroundSyncConfig = {
      tag,
      action,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    };

    this.pendingActions.push(syncConfig);
    await this.persistActions();

    // Register for background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register(tag);
      } catch (error) {
        console.warn('Background sync registration failed:', error);
        // Fallback to immediate retry
        this.retryAction(syncConfig);
      }
    } else {
      // Fallback for browsers without background sync
      this.retryAction(syncConfig);
    }
  }

  async processSyncEvent(tag: string): Promise<void> {
    const actionsToProcess = this.pendingActions.filter(action => action.tag === tag);
    
    for (const action of actionsToProcess) {
      try {
        await this.executeAction(action);
        this.removeAction(action);
      } catch (error) {
        console.error('Failed to process sync action:', error);
        action.retryCount++;
        
        if (action.retryCount >= action.maxRetries) {
          console.error('Max retries reached for action:', action);
          this.removeAction(action);
        }
      }
    }
    
    await this.persistActions();
  }

  private async executeAction(action: BackgroundSyncConfig): Promise<void> {
    switch (action.action) {
      case 'add-to-favorites':
        // Implementation would sync favorite with backend
        console.log('Syncing favorite:', action.data);
        break;
      case 'add-to-watchlist':
        // Implementation would sync watchlist with backend
        console.log('Syncing watchlist:', action.data);
        break;
      case 'update-rating':
        // Implementation would sync rating with backend
        console.log('Syncing rating:', action.data);
        break;
      default:
        console.warn('Unknown sync action:', action.action);
    }
  }

  private removeAction(action: BackgroundSyncConfig): void {
    this.pendingActions = this.pendingActions.filter(a => a !== action);
  }

  private async retryAction(action: BackgroundSyncConfig): Promise<void> {
    // Implement exponential backoff
    const delay = Math.min(1000 * Math.pow(2, action.retryCount), 30000);
    
    setTimeout(async () => {
      try {
        await this.executeAction(action);
        this.removeAction(action);
      } catch (error) {
        action.retryCount++;
        if (action.retryCount < action.maxRetries) {
          this.retryAction(action);
        } else {
          this.removeAction(action);
        }
      }
      await this.persistActions();
    }, delay);
  }

  private async persistActions(): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.pendingActions));
    } catch (error) {
      console.error('Failed to persist background sync actions:', error);
    }
  }

  private async loadActions(): Promise<void> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.pendingActions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load background sync actions:', error);
    }
  }

  async initialize(): Promise<void> {
    await this.loadActions();
    
    // Process any pending actions
    for (const action of this.pendingActions) {
      if (navigator.onLine) {
        this.retryAction(action);
      }
    }
  }

  getPendingActions(): BackgroundSyncConfig[] {
    return [...this.pendingActions];
  }

  clearPendingActions(): void {
    this.pendingActions = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// Push notification manager
export class PushNotificationManager {
  private static instance: PushNotificationManager;
  private subscription: PushSubscription | null = null;

  static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager();
    }
    return PushNotificationManager.instance;
  }

  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      this.subscription = await registration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        )
      });

      this.subscription = subscription;
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) return false;

    try {
      await this.subscription.unsubscribe();
      this.subscription = null;
      
      // Remove subscription from server
      await this.removeSubscriptionFromServer();
      
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  isSubscribed(): boolean {
    return this.subscription !== null;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    return await Notification.requestPermission();
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    // Implementation would send subscription to backend
    console.log('Sending subscription to server:', subscription);
  }

  private async removeSubscriptionFromServer(): Promise<void> {
    // Implementation would remove subscription from backend
    console.log('Removing subscription from server');
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
}

// Service Worker registration utility
export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker is not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register(swPath);
      
      // Handle service worker updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              this.notifyUpdate();
            }
          });
        }
      });

      // Initialize background sync and push notifications
      await BackgroundSyncManager.getInstance().initialize();
      await PushNotificationManager.getInstance().initialize();

      console.log('Service Worker registered successfully');
      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  async unregister(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      await this.registration.unregister();
      this.registration = null;
      console.log('Service Worker unregistered successfully');
      return true;
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
      return false;
    }
  }

  async update(): Promise<void> {
    if (!this.registration) return;

    try {
      await this.registration.update();
      console.log('Service Worker updated successfully');
    } catch (error) {
      console.error('Service Worker update failed:', error);
    }
  }

  private notifyUpdate(): void {
    // Notify user about available update
    if (confirm('A new version of the app is available. Reload to update?')) {
      window.location.reload();
    }
  }

  isRegistered(): boolean {
    return this.registration !== null;
  }

  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

// Network status monitor
export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private listeners: Array<(isOnline: boolean) => void> = [];
  private isOnline: boolean = true;

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  initialize(): void {
    if (typeof window === 'undefined') return;

    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });
  }

  addListener(listener: (isOnline: boolean) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (isOnline: boolean) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(isOnline: boolean): void {
    this.listeners.forEach(listener => listener(isOnline));
  }

  getStatus(): boolean {
    return this.isOnline;
  }
}

// Export default initialization function
export async function initializeServiceWorker(): Promise<void> {
  const swManager = ServiceWorkerManager.getInstance();
  const networkMonitor = NetworkMonitor.getInstance();
  
  await swManager.register();
  networkMonitor.initialize();
  
  console.log('Service Worker infrastructure initialized');
}

// Export utility function for checking feature support
export function getFeatureSupport(): {
  serviceWorker: boolean;
  backgroundSync: boolean;
  pushNotifications: boolean;
  indexedDB: boolean;
  webLocks: boolean;
} {
  return {
    serviceWorker: 'serviceWorker' in navigator,
    backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
    pushNotifications: 'serviceWorker' in navigator && 'PushManager' in window,
    indexedDB: 'indexedDB' in window,
    webLocks: 'locks' in navigator
  };
} 