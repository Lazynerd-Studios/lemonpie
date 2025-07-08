import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'yo' | 'ig' | 'ha';
export type ViewMode = 'grid' | 'list' | 'carousel';
export type SortOption = 'popularity' | 'rating' | 'year' | 'title' | 'duration';
export type SortOrder = 'asc' | 'desc';

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  newMovies: boolean;
  recommendations: boolean;
  reminders: boolean;
  marketing: boolean;
}

export interface DisplaySettings {
  theme: Theme;
  language: Language;
  viewMode: ViewMode;
  moviesPerPage: number;
  showPosters: boolean;
  showRatings: boolean;
  showGenres: boolean;
  showYear: boolean;
  showDuration: boolean;
  autoplayTrailers: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

export interface FilterPreferences {
  defaultSortBy: SortOption;
  defaultSortOrder: SortOrder;
  preferredGenres: string[];
  excludedGenres: string[];
  minRating: number;
  maxRating: number;
  preferredLanguages: string[];
  showNollywoodOnly: boolean;
  showOnlyWithTrailers: boolean;
  defaultYearRange: { min?: number; max?: number };
  rememberFilters: boolean;
}

export interface PrivacySettings {
  shareWatchlist: boolean;
  shareRecentlyViewed: boolean;
  shareRatings: boolean;
  allowRecommendations: boolean;
  trackWatchHistory: boolean;
  allowAnalytics: boolean;
  showOnlineStatus: boolean;
  publicProfile: boolean;
}

export interface AccessibilitySettings {
  screenReaderOptimized: boolean;
  keyboardNavigationEnabled: boolean;
  skipLinksEnabled: boolean;
  audioDescriptions: boolean;
  subtitlesEnabled: boolean;
  subtitleLanguage: string;
  textToSpeech: boolean;
  contrastMode: 'normal' | 'high' | 'highest';
  motionSensitivity: 'normal' | 'reduced' | 'none';
}

export interface UserProfile {
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  favoriteGenres: string[];
  location?: string;
  birthday?: string;
  joinedDate: Date;
  lastActiveDate: Date;
  preferences: {
    receiveNewsletter: boolean;
    shareReviews: boolean;
    showRealName: boolean;
  };
}

interface UserPreferencesStore {
  // Core preferences
  display: DisplaySettings;
  filters: FilterPreferences;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  profile: UserProfile;
  
  // State
  isLoading: boolean;
  lastSync: Date | null;
  hasUnsavedChanges: boolean;
  
  // Display settings actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setViewMode: (viewMode: ViewMode) => void;
  setMoviesPerPage: (count: number) => void;
  toggleAutoplayTrailers: () => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  setFontSize: (size: DisplaySettings['fontSize']) => void;
  toggleCompactMode: () => void;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => void;
  
  // Filter preferences actions
  setDefaultSort: (sortBy: SortOption, sortOrder: SortOrder) => void;
  addPreferredGenre: (genre: string) => void;
  removePreferredGenre: (genre: string) => void;
  addExcludedGenre: (genre: string) => void;
  removeExcludedGenre: (genre: string) => void;
  setRatingRange: (min: number, max: number) => void;
  addPreferredLanguage: (language: string) => void;
  removePreferredLanguage: (language: string) => void;
  setYearRange: (min?: number, max?: number) => void;
  toggleNollywoodOnly: () => void;
  toggleOnlyWithTrailers: () => void;
  toggleRememberFilters: () => void;
  updateFilterPreferences: (preferences: Partial<FilterPreferences>) => void;
  
  // Notification settings actions
  toggleEmailNotifications: () => void;
  togglePushNotifications: () => void;
  toggleNewMoviesNotifications: () => void;
  toggleRecommendationsNotifications: () => void;
  toggleRemindersNotifications: () => void;
  toggleMarketingNotifications: () => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  
  // Privacy settings actions
  toggleShareWatchlist: () => void;
  toggleShareRecentlyViewed: () => void;
  toggleShareRatings: () => void;
  toggleAllowRecommendations: () => void;
  toggleTrackWatchHistory: () => void;
  toggleAllowAnalytics: () => void;
  toggleShowOnlineStatus: () => void;
  togglePublicProfile: () => void;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  
  // Accessibility settings actions
  toggleScreenReaderOptimized: () => void;
  toggleKeyboardNavigation: () => void;
  toggleSkipLinks: () => void;
  toggleAudioDescriptions: () => void;
  toggleSubtitles: () => void;
  setSubtitleLanguage: (language: string) => void;
  toggleTextToSpeech: () => void;
  setContrastMode: (mode: AccessibilitySettings['contrastMode']) => void;
  setMotionSensitivity: (sensitivity: AccessibilitySettings['motionSensitivity']) => void;
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void;
  
  // Profile actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  addFavoriteGenre: (genre: string) => void;
  removeFavoriteGenre: (genre: string) => void;
  updateLastActiveDate: () => void;
  
  // Bulk operations
  resetToDefaults: () => void;
  resetDisplaySettings: () => void;
  resetFilterPreferences: () => void;
  resetNotificationSettings: () => void;
  resetPrivacySettings: () => void;
  resetAccessibilitySettings: () => void;
  
  // Utility actions
  sync: () => Promise<void>;
  exportSettings: () => Omit<UserPreferencesStore, 'isLoading' | 'hasUnsavedChanges' | keyof UserPreferencesStore>;
  importSettings: (settings: Partial<UserPreferencesStore>) => void;
  markAsChanged: () => void;
  markAsSaved: () => void;
  
  // Getters
  getCurrentTheme: () => Theme;
  getEffectiveTheme: () => 'light' | 'dark';
  isNollywoodPreferred: () => boolean;
  getAccessibilityLevel: () => 'basic' | 'enhanced' | 'full';
}

// Default settings
const defaultDisplaySettings: DisplaySettings = {
  theme: 'system',
  language: 'en',
  viewMode: 'grid',
  moviesPerPage: 20,
  showPosters: true,
  showRatings: true,
  showGenres: true,
  showYear: true,
  showDuration: true,
  autoplayTrailers: false,
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  compactMode: false
};

const defaultFilterPreferences: FilterPreferences = {
  defaultSortBy: 'popularity',
  defaultSortOrder: 'desc',
  preferredGenres: [],
  excludedGenres: [],
  minRating: 0,
  maxRating: 10,
  preferredLanguages: [],
  showNollywoodOnly: false,
  showOnlyWithTrailers: false,
  defaultYearRange: {},
  rememberFilters: true
};

const defaultNotificationSettings: NotificationSettings = {
  email: true,
  push: true,
  newMovies: true,
  recommendations: true,
  reminders: true,
  marketing: false
};

const defaultPrivacySettings: PrivacySettings = {
  shareWatchlist: false,
  shareRecentlyViewed: false,
  shareRatings: false,
  allowRecommendations: true,
  trackWatchHistory: true,
  allowAnalytics: true,
  showOnlineStatus: true,
  publicProfile: false
};

const defaultAccessibilitySettings: AccessibilitySettings = {
  screenReaderOptimized: false,
  keyboardNavigationEnabled: true,
  skipLinksEnabled: true,
  audioDescriptions: false,
  subtitlesEnabled: false,
  subtitleLanguage: 'en',
  textToSpeech: false,
  contrastMode: 'normal',
  motionSensitivity: 'normal'
};

const defaultUserProfile: UserProfile = {
  favoriteGenres: [],
  joinedDate: new Date(),
  lastActiveDate: new Date(),
  preferences: {
    receiveNewsletter: true,
    shareReviews: true,
    showRealName: false
  }
};

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      display: defaultDisplaySettings,
      filters: defaultFilterPreferences,
      notifications: defaultNotificationSettings,
      privacy: defaultPrivacySettings,
      accessibility: defaultAccessibilitySettings,
      profile: defaultUserProfile,
      isLoading: false,
      lastSync: null,
      hasUnsavedChanges: false,
      
      // Display settings actions
      setTheme: (theme) => {
        set(state => ({
          display: { ...state.display, theme },
          hasUnsavedChanges: true
        }));
      },
      
      setLanguage: (language) => {
        set(state => ({
          display: { ...state.display, language },
          hasUnsavedChanges: true
        }));
      },
      
      setViewMode: (viewMode) => {
        set(state => ({
          display: { ...state.display, viewMode },
          hasUnsavedChanges: true
        }));
      },
      
      setMoviesPerPage: (count) => {
        set(state => ({
          display: { ...state.display, moviesPerPage: count },
          hasUnsavedChanges: true
        }));
      },
      
      toggleAutoplayTrailers: () => {
        set(state => ({
          display: { ...state.display, autoplayTrailers: !state.display.autoplayTrailers },
          hasUnsavedChanges: true
        }));
      },
      
      toggleReducedMotion: () => {
        set(state => ({
          display: { ...state.display, reducedMotion: !state.display.reducedMotion },
          hasUnsavedChanges: true
        }));
      },
      
      toggleHighContrast: () => {
        set(state => ({
          display: { ...state.display, highContrast: !state.display.highContrast },
          hasUnsavedChanges: true
        }));
      },
      
      setFontSize: (fontSize) => {
        set(state => ({
          display: { ...state.display, fontSize },
          hasUnsavedChanges: true
        }));
      },
      
      toggleCompactMode: () => {
        set(state => ({
          display: { ...state.display, compactMode: !state.display.compactMode },
          hasUnsavedChanges: true
        }));
      },
      
      updateDisplaySettings: (settings) => {
        set(state => ({
          display: { ...state.display, ...settings },
          hasUnsavedChanges: true
        }));
      },
      
      // Filter preferences actions
      setDefaultSort: (sortBy, sortOrder) => {
        set(state => ({
          filters: { ...state.filters, defaultSortBy: sortBy, defaultSortOrder: sortOrder },
          hasUnsavedChanges: true
        }));
      },
      
      addPreferredGenre: (genre) => {
        set(state => ({
          filters: {
            ...state.filters,
            preferredGenres: [...state.filters.preferredGenres.filter(g => g !== genre), genre]
          },
          hasUnsavedChanges: true
        }));
      },
      
      removePreferredGenre: (genre) => {
        set(state => ({
          filters: {
            ...state.filters,
            preferredGenres: state.filters.preferredGenres.filter(g => g !== genre)
          },
          hasUnsavedChanges: true
        }));
      },
      
      addExcludedGenre: (genre) => {
        set(state => ({
          filters: {
            ...state.filters,
            excludedGenres: [...state.filters.excludedGenres.filter(g => g !== genre), genre]
          },
          hasUnsavedChanges: true
        }));
      },
      
      removeExcludedGenre: (genre) => {
        set(state => ({
          filters: {
            ...state.filters,
            excludedGenres: state.filters.excludedGenres.filter(g => g !== genre)
          },
          hasUnsavedChanges: true
        }));
      },
      
      setRatingRange: (min, max) => {
        set(state => ({
          filters: { ...state.filters, minRating: min, maxRating: max },
          hasUnsavedChanges: true
        }));
      },
      
      addPreferredLanguage: (language) => {
        set(state => ({
          filters: {
            ...state.filters,
            preferredLanguages: [...state.filters.preferredLanguages.filter(l => l !== language), language]
          },
          hasUnsavedChanges: true
        }));
      },
      
      removePreferredLanguage: (language) => {
        set(state => ({
          filters: {
            ...state.filters,
            preferredLanguages: state.filters.preferredLanguages.filter(l => l !== language)
          },
          hasUnsavedChanges: true
        }));
      },
      
      setYearRange: (min, max) => {
        set(state => ({
          filters: { ...state.filters, defaultYearRange: { min, max } },
          hasUnsavedChanges: true
        }));
      },
      
      toggleNollywoodOnly: () => {
        set(state => ({
          filters: { ...state.filters, showNollywoodOnly: !state.filters.showNollywoodOnly },
          hasUnsavedChanges: true
        }));
      },
      
      toggleOnlyWithTrailers: () => {
        set(state => ({
          filters: { ...state.filters, showOnlyWithTrailers: !state.filters.showOnlyWithTrailers },
          hasUnsavedChanges: true
        }));
      },
      
      toggleRememberFilters: () => {
        set(state => ({
          filters: { ...state.filters, rememberFilters: !state.filters.rememberFilters },
          hasUnsavedChanges: true
        }));
      },
      
      updateFilterPreferences: (preferences) => {
        set(state => ({
          filters: { ...state.filters, ...preferences },
          hasUnsavedChanges: true
        }));
      },
      
      // Notification settings actions
      toggleEmailNotifications: () => {
        set(state => ({
          notifications: { ...state.notifications, email: !state.notifications.email },
          hasUnsavedChanges: true
        }));
      },
      
      togglePushNotifications: () => {
        set(state => ({
          notifications: { ...state.notifications, push: !state.notifications.push },
          hasUnsavedChanges: true
        }));
      },
      
      toggleNewMoviesNotifications: () => {
        set(state => ({
          notifications: { ...state.notifications, newMovies: !state.notifications.newMovies },
          hasUnsavedChanges: true
        }));
      },
      
      toggleRecommendationsNotifications: () => {
        set(state => ({
          notifications: { ...state.notifications, recommendations: !state.notifications.recommendations },
          hasUnsavedChanges: true
        }));
      },
      
      toggleRemindersNotifications: () => {
        set(state => ({
          notifications: { ...state.notifications, reminders: !state.notifications.reminders },
          hasUnsavedChanges: true
        }));
      },
      
      toggleMarketingNotifications: () => {
        set(state => ({
          notifications: { ...state.notifications, marketing: !state.notifications.marketing },
          hasUnsavedChanges: true
        }));
      },
      
      updateNotificationSettings: (settings) => {
        set(state => ({
          notifications: { ...state.notifications, ...settings },
          hasUnsavedChanges: true
        }));
      },
      
      // Privacy settings actions
      toggleShareWatchlist: () => {
        set(state => ({
          privacy: { ...state.privacy, shareWatchlist: !state.privacy.shareWatchlist },
          hasUnsavedChanges: true
        }));
      },
      
      toggleShareRecentlyViewed: () => {
        set(state => ({
          privacy: { ...state.privacy, shareRecentlyViewed: !state.privacy.shareRecentlyViewed },
          hasUnsavedChanges: true
        }));
      },
      
      toggleShareRatings: () => {
        set(state => ({
          privacy: { ...state.privacy, shareRatings: !state.privacy.shareRatings },
          hasUnsavedChanges: true
        }));
      },
      
      toggleAllowRecommendations: () => {
        set(state => ({
          privacy: { ...state.privacy, allowRecommendations: !state.privacy.allowRecommendations },
          hasUnsavedChanges: true
        }));
      },
      
      toggleTrackWatchHistory: () => {
        set(state => ({
          privacy: { ...state.privacy, trackWatchHistory: !state.privacy.trackWatchHistory },
          hasUnsavedChanges: true
        }));
      },
      
      toggleAllowAnalytics: () => {
        set(state => ({
          privacy: { ...state.privacy, allowAnalytics: !state.privacy.allowAnalytics },
          hasUnsavedChanges: true
        }));
      },
      
      toggleShowOnlineStatus: () => {
        set(state => ({
          privacy: { ...state.privacy, showOnlineStatus: !state.privacy.showOnlineStatus },
          hasUnsavedChanges: true
        }));
      },
      
      togglePublicProfile: () => {
        set(state => ({
          privacy: { ...state.privacy, publicProfile: !state.privacy.publicProfile },
          hasUnsavedChanges: true
        }));
      },
      
      updatePrivacySettings: (settings) => {
        set(state => ({
          privacy: { ...state.privacy, ...settings },
          hasUnsavedChanges: true
        }));
      },
      
      // Accessibility settings actions
      toggleScreenReaderOptimized: () => {
        set(state => ({
          accessibility: { ...state.accessibility, screenReaderOptimized: !state.accessibility.screenReaderOptimized },
          hasUnsavedChanges: true
        }));
      },
      
      toggleKeyboardNavigation: () => {
        set(state => ({
          accessibility: { ...state.accessibility, keyboardNavigationEnabled: !state.accessibility.keyboardNavigationEnabled },
          hasUnsavedChanges: true
        }));
      },
      
      toggleSkipLinks: () => {
        set(state => ({
          accessibility: { ...state.accessibility, skipLinksEnabled: !state.accessibility.skipLinksEnabled },
          hasUnsavedChanges: true
        }));
      },
      
      toggleAudioDescriptions: () => {
        set(state => ({
          accessibility: { ...state.accessibility, audioDescriptions: !state.accessibility.audioDescriptions },
          hasUnsavedChanges: true
        }));
      },
      
      toggleSubtitles: () => {
        set(state => ({
          accessibility: { ...state.accessibility, subtitlesEnabled: !state.accessibility.subtitlesEnabled },
          hasUnsavedChanges: true
        }));
      },
      
      setSubtitleLanguage: (language) => {
        set(state => ({
          accessibility: { ...state.accessibility, subtitleLanguage: language },
          hasUnsavedChanges: true
        }));
      },
      
      toggleTextToSpeech: () => {
        set(state => ({
          accessibility: { ...state.accessibility, textToSpeech: !state.accessibility.textToSpeech },
          hasUnsavedChanges: true
        }));
      },
      
      setContrastMode: (mode) => {
        set(state => ({
          accessibility: { ...state.accessibility, contrastMode: mode },
          hasUnsavedChanges: true
        }));
      },
      
      setMotionSensitivity: (sensitivity) => {
        set(state => ({
          accessibility: { ...state.accessibility, motionSensitivity: sensitivity },
          hasUnsavedChanges: true
        }));
      },
      
      updateAccessibilitySettings: (settings) => {
        set(state => ({
          accessibility: { ...state.accessibility, ...settings },
          hasUnsavedChanges: true
        }));
      },
      
      // Profile actions
      updateProfile: (profile) => {
        set(state => ({
          profile: { ...state.profile, ...profile },
          hasUnsavedChanges: true
        }));
      },
      
      addFavoriteGenre: (genre) => {
        set(state => ({
          profile: {
            ...state.profile,
            favoriteGenres: [...state.profile.favoriteGenres.filter(g => g !== genre), genre]
          },
          hasUnsavedChanges: true
        }));
      },
      
      removeFavoriteGenre: (genre) => {
        set(state => ({
          profile: {
            ...state.profile,
            favoriteGenres: state.profile.favoriteGenres.filter(g => g !== genre)
          },
          hasUnsavedChanges: true
        }));
      },
      
      updateLastActiveDate: () => {
        set(state => ({
          profile: { ...state.profile, lastActiveDate: new Date() }
        }));
      },
      
      // Bulk operations
      resetToDefaults: () => {
        set({
          display: defaultDisplaySettings,
          filters: defaultFilterPreferences,
          notifications: defaultNotificationSettings,
          privacy: defaultPrivacySettings,
          accessibility: defaultAccessibilitySettings,
          hasUnsavedChanges: true
        });
      },
      
      resetDisplaySettings: () => {
        set(state => ({
          display: defaultDisplaySettings,
          hasUnsavedChanges: true
        }));
      },
      
      resetFilterPreferences: () => {
        set(state => ({
          filters: defaultFilterPreferences,
          hasUnsavedChanges: true
        }));
      },
      
      resetNotificationSettings: () => {
        set(state => ({
          notifications: defaultNotificationSettings,
          hasUnsavedChanges: true
        }));
      },
      
      resetPrivacySettings: () => {
        set(state => ({
          privacy: defaultPrivacySettings,
          hasUnsavedChanges: true
        }));
      },
      
      resetAccessibilitySettings: () => {
        set(state => ({
          accessibility: defaultAccessibilitySettings,
          hasUnsavedChanges: true
        }));
      },
      
      // Utility actions
      sync: async () => {
        set({ isLoading: true });
        try {
          // Here you would implement sync with backend
          set({ lastSync: new Date(), hasUnsavedChanges: false });
        } finally {
          set({ isLoading: false });
        }
      },
      
      exportSettings: () => {
        const { display, filters, notifications, privacy, accessibility, profile } = get();
        return { display, filters, notifications, privacy, accessibility, profile };
      },
      
      importSettings: (settings) => {
        set(state => ({
          ...state,
          ...settings,
          hasUnsavedChanges: true
        }));
      },
      
      markAsChanged: () => {
        set({ hasUnsavedChanges: true });
      },
      
      markAsSaved: () => {
        set({ hasUnsavedChanges: false });
      },
      
      // Getters
      getCurrentTheme: () => {
        const { display } = get();
        return display.theme;
      },
      
      getEffectiveTheme: () => {
        const { display } = get();
        if (display.theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return display.theme;
      },
      
      isNollywoodPreferred: () => {
        const { filters } = get();
        return filters.showNollywoodOnly;
      },
      
      getAccessibilityLevel: () => {
        const { accessibility } = get();
        const features = Object.values(accessibility).filter(Boolean).length;
        if (features >= 7) return 'full';
        if (features >= 3) return 'enhanced';
        return 'basic';
      }
    }),
    {
      name: 'lemonnpie-user-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        display: state.display,
        filters: state.filters,
        notifications: state.notifications,
        privacy: state.privacy,
        accessibility: state.accessibility,
        profile: state.profile,
        lastSync: state.lastSync
      })
    }
  )
);

// Utility hooks for specific preference categories
export const useThemePreferences = () => {
  const theme = useUserPreferencesStore((state) => state.display.theme);
  const setTheme = useUserPreferencesStore((state) => state.setTheme);
  const getCurrentTheme = useUserPreferencesStore((state) => state.getCurrentTheme);
  const getEffectiveTheme = useUserPreferencesStore((state) => state.getEffectiveTheme);
  
  return { theme, setTheme, getCurrentTheme, getEffectiveTheme };
};

export const useDisplayPreferences = () => {
  const display = useUserPreferencesStore((state) => state.display);
  const updateDisplaySettings = useUserPreferencesStore((state) => state.updateDisplaySettings);
  
  return { display, updateDisplaySettings };
};

export const useFilterPreferences = () => {
  const filters = useUserPreferencesStore((state) => state.filters);
  const updateFilterPreferences = useUserPreferencesStore((state) => state.updateFilterPreferences);
  
  return { filters, updateFilterPreferences };
};

export const useNotificationPreferences = () => {
  const notifications = useUserPreferencesStore((state) => state.notifications);
  const updateNotificationSettings = useUserPreferencesStore((state) => state.updateNotificationSettings);
  
  return { notifications, updateNotificationSettings };
};

export const usePrivacyPreferences = () => {
  const privacy = useUserPreferencesStore((state) => state.privacy);
  const updatePrivacySettings = useUserPreferencesStore((state) => state.updatePrivacySettings);
  
  return { privacy, updatePrivacySettings };
};

export const useAccessibilityPreferences = () => {
  const accessibility = useUserPreferencesStore((state) => state.accessibility);
  const updateAccessibilitySettings = useUserPreferencesStore((state) => state.updateAccessibilitySettings);
  const getAccessibilityLevel = useUserPreferencesStore((state) => state.getAccessibilityLevel);
  
  return { accessibility, updateAccessibilitySettings, getAccessibilityLevel };
}; 