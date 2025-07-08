import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Movie } from '@/types/movie';
import { FilterOptions } from '@/lib/hooks/useFilters';

export interface SearchState {
  query: string;
  results: Movie[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  hasSearched: boolean;
  resultCount: number;
  searchTime: number;
  suggestions: string[];
  recentSearches: string[];
  savedSearches: SavedSearch[];
  isDebouncing: boolean;
  lastSearchedAt: Date | null;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: FilterOptions;
  createdAt: Date;
  lastUsed: Date;
  useCount: number;
}

export interface FilterState {
  activeFilters: FilterOptions;
  appliedFilters: FilterOptions;
  tempFilters: FilterOptions;
  isFilterPanelOpen: boolean;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  filteredMovies: Movie[];
  filterStats: {
    totalMovies: number;
    filteredMovies: number;
    availableGenres: string[];
    availableYears: number[];
    availableLanguages: string[];
    availableCountries: string[];
  };
  filterHistory: FilterOptions[];
  favoriteFilters: FavoriteFilter[];
  isApplying: boolean;
  lastAppliedAt: Date | null;
}

export interface FavoriteFilter {
  id: string;
  name: string;
  filters: FilterOptions;
  createdAt: Date;
  lastUsed: Date;
  useCount: number;
  isQuickAccess: boolean;
}

export interface SearchSuggestion {
  type: 'recent' | 'popular' | 'genre' | 'director' | 'actor' | 'movie';
  text: string;
  count?: number;
  category?: string;
}

interface SearchFilterStore {
  // State
  search: SearchState;
  filters: FilterState;
  isInitialized: boolean;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Movie[], resultCount: number, searchTime: number) => void;
  setSearchLoading: (loading: boolean) => void;
  setSearchError: (error: string | null) => void;
  setSearchDebouncing: (debouncing: boolean) => void;
  clearSearch: () => void;
  addToRecentSearches: (query: string) => void;
  removeFromRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
  
  // Saved searches
  saveSearch: (name: string, query: string, filters: FilterOptions) => void;
  removeSavedSearch: (id: string) => void;
  updateSavedSearch: (id: string, updates: Partial<SavedSearch>) => void;
  useSavedSearch: (id: string) => void;
  getSavedSearch: (id: string) => SavedSearch | undefined;
  
  // Search suggestions
  setSuggestions: (suggestions: string[]) => void;
  clearSuggestions: () => void;
  getSearchSuggestions: (query: string) => SearchSuggestion[];
  
  // Filter actions
  setActiveFilters: (filters: FilterOptions) => void;
  updateActiveFilters: (filters: Partial<FilterOptions>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  resetFilters: () => void;
  setTempFilters: (filters: FilterOptions) => void;
  revertTempFilters: () => void;
  toggleFilterPanel: () => void;
  setFilterPanel: (open: boolean) => void;
  
  // Filter history
  addToFilterHistory: (filters: FilterOptions) => void;
  clearFilterHistory: () => void;
  getFilterHistory: () => FilterOptions[];
  
  // Favorite filters
  saveFavoriteFilter: (name: string, filters: FilterOptions, isQuickAccess?: boolean) => void;
  removeFavoriteFilter: (id: string) => void;
  updateFavoriteFilter: (id: string, updates: Partial<FavoriteFilter>) => void;
  useFavoriteFilter: (id: string) => void;
  getFavoriteFilter: (id: string) => FavoriteFilter | undefined;
  toggleQuickAccess: (id: string) => void;
  
  // Combined search and filter actions
  searchWithFilters: (query: string, filters: FilterOptions) => void;
  clearSearchAndFilters: () => void;
  
  // Utility actions
  updateFilterStats: (stats: FilterState['filterStats']) => void;
  setFilteredMovies: (movies: Movie[]) => void;
  setFilterApplying: (applying: boolean) => void;
  
  // Bulk operations
  exportSearchHistory: () => { recentSearches: string[]; savedSearches: SavedSearch[] };
  importSearchHistory: (data: { recentSearches?: string[]; savedSearches?: SavedSearch[] }) => void;
  exportFilterHistory: () => { filterHistory: FilterOptions[]; favoriteFilters: FavoriteFilter[] };
  importFilterHistory: (data: { filterHistory?: FilterOptions[]; favoriteFilters?: FavoriteFilter[] }) => void;
  
  // Analytics
  getSearchAnalytics: () => {
    totalSearches: number;
    uniqueSearches: number;
    averageResultsPerSearch: number;
    mostPopularSearches: Array<{ query: string; count: number }>;
    searchTrends: Array<{ period: string; searches: number }>;
  };
  
  getFilterAnalytics: () => {
    totalFiltersApplied: number;
    mostUsedFilters: Array<{ filter: string; count: number }>;
    averageFiltersPerSession: number;
    filterEffectiveness: Array<{ filter: string; averageResults: number }>;
  };
  
  // Initialization
  initialize: () => void;
  reset: () => void;
}

// Default states
const defaultSearchState: SearchState = {
  query: '',
  results: [],
  isLoading: false,
  isError: false,
  error: null,
  hasSearched: false,
  resultCount: 0,
  searchTime: 0,
  suggestions: [],
  recentSearches: [],
  savedSearches: [],
  isDebouncing: false,
  lastSearchedAt: null
};

const defaultFilterState: FilterState = {
  activeFilters: {
    genres: { include: [], exclude: [] },
    year: {},
    rating: {},
    duration: {},
    language: { selected: [] },
    country: { selected: [] },
    isNollywood: undefined,
    hasAwards: undefined,
    hasTrailer: undefined,
    sortBy: 'popularity',
    sortOrder: 'desc'
  },
  appliedFilters: {
    genres: { include: [], exclude: [] },
    year: {},
    rating: {},
    duration: {},
    language: { selected: [] },
    country: { selected: [] },
    isNollywood: undefined,
    hasAwards: undefined,
    hasTrailer: undefined,
    sortBy: 'popularity',
    sortOrder: 'desc'
  },
  tempFilters: {
    genres: { include: [], exclude: [] },
    year: {},
    rating: {},
    duration: {},
    language: { selected: [] },
    country: { selected: [] },
    isNollywood: undefined,
    hasAwards: undefined,
    hasTrailer: undefined,
    sortBy: 'popularity',
    sortOrder: 'desc'
  },
  isFilterPanelOpen: false,
  hasActiveFilters: false,
  activeFiltersCount: 0,
  filteredMovies: [],
  filterStats: {
    totalMovies: 0,
    filteredMovies: 0,
    availableGenres: [],
    availableYears: [],
    availableLanguages: [],
    availableCountries: []
  },
  filterHistory: [],
  favoriteFilters: [],
  isApplying: false,
  lastAppliedAt: null
};

// Helper functions
const countActiveFilters = (filters: FilterOptions): number => {
  let count = 0;
  if (filters.genres.include.length > 0) count++;
  if (filters.genres.exclude.length > 0) count++;
  if (filters.year.min || filters.year.max || filters.year.exact) count++;
  if (filters.rating.min || filters.rating.max) count++;
  if (filters.duration.min || filters.duration.max) count++;
  if (filters.language.selected.length > 0) count++;
  if (filters.country.selected.length > 0) count++;
  if (filters.isNollywood !== undefined) count++;
  if (filters.hasAwards !== undefined) count++;
  if (filters.hasTrailer !== undefined) count++;
  return count;
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const addToRecentList = <T>(list: T[], item: T, maxLength: number = 10): T[] => {
  const filtered = list.filter(i => i !== item);
  return [item, ...filtered].slice(0, maxLength);
};

export const useSearchFilterStore = create<SearchFilterStore>()(
  persist(
    (set, get) => ({
      // Initial state
      search: defaultSearchState,
      filters: defaultFilterState,
      isInitialized: false,
      
      // Search actions
      setSearchQuery: (query) => {
        set(state => ({
          search: {
            ...state.search,
            query,
            hasSearched: query.length > 0
          }
        }));
      },
      
      setSearchResults: (results, resultCount, searchTime) => {
        set(state => ({
          search: {
            ...state.search,
            results,
            resultCount,
            searchTime,
            isLoading: false,
            isError: false,
            error: null,
            hasSearched: true,
            lastSearchedAt: new Date()
          }
        }));
        
        // Add to recent searches if query is not empty
        const { search } = get();
        if (search.query.trim()) {
          get().addToRecentSearches(search.query);
        }
      },
      
      setSearchLoading: (loading) => {
        set(state => ({
          search: { ...state.search, isLoading: loading }
        }));
      },
      
      setSearchError: (error) => {
        set(state => ({
          search: {
            ...state.search,
            isError: !!error,
            error,
            isLoading: false
          }
        }));
      },
      
      setSearchDebouncing: (debouncing) => {
        set(state => ({
          search: { ...state.search, isDebouncing: debouncing }
        }));
      },
      
      clearSearch: () => {
        set(state => ({
          search: {
            ...state.search,
            query: '',
            results: [],
            resultCount: 0,
            searchTime: 0,
            isLoading: false,
            isError: false,
            error: null,
            hasSearched: false,
            suggestions: []
          }
        }));
      },
      
      addToRecentSearches: (query) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;
        
        set(state => ({
          search: {
            ...state.search,
            recentSearches: addToRecentList(state.search.recentSearches, trimmedQuery)
          }
        }));
      },
      
      removeFromRecentSearches: (query) => {
        set(state => ({
          search: {
            ...state.search,
            recentSearches: state.search.recentSearches.filter(q => q !== query)
          }
        }));
      },
      
      clearRecentSearches: () => {
        set(state => ({
          search: { ...state.search, recentSearches: [] }
        }));
      },
      
      // Saved searches
      saveSearch: (name, query, filters) => {
        const savedSearch: SavedSearch = {
          id: generateId(),
          name,
          query,
          filters,
          createdAt: new Date(),
          lastUsed: new Date(),
          useCount: 0
        };
        
        set(state => ({
          search: {
            ...state.search,
            savedSearches: [...state.search.savedSearches, savedSearch]
          }
        }));
      },
      
      removeSavedSearch: (id) => {
        set(state => ({
          search: {
            ...state.search,
            savedSearches: state.search.savedSearches.filter(s => s.id !== id)
          }
        }));
      },
      
      updateSavedSearch: (id, updates) => {
        set(state => ({
          search: {
            ...state.search,
            savedSearches: state.search.savedSearches.map(s =>
              s.id === id ? { ...s, ...updates } : s
            )
          }
        }));
      },
      
      useSavedSearch: (id) => {
        const { search } = get();
        const savedSearch = search.savedSearches.find(s => s.id === id);
        if (!savedSearch) return;
        
        // Update saved search usage
        get().updateSavedSearch(id, {
          lastUsed: new Date(),
          useCount: savedSearch.useCount + 1
        });
        
        // Apply the saved search
        get().setSearchQuery(savedSearch.query);
        get().setActiveFilters(savedSearch.filters);
      },
      
      getSavedSearch: (id) => {
        const { search } = get();
        return search.savedSearches.find(s => s.id === id);
      },
      
      // Search suggestions
      setSuggestions: (suggestions) => {
        set(state => ({
          search: { ...state.search, suggestions }
        }));
      },
      
      clearSuggestions: () => {
        set(state => ({
          search: { ...state.search, suggestions: [] }
        }));
      },
      
      getSearchSuggestions: (query) => {
        const { search } = get();
        const suggestions: SearchSuggestion[] = [];
        
        // Add recent searches
        search.recentSearches
          .filter(q => q.toLowerCase().includes(query.toLowerCase()))
          .forEach(q => suggestions.push({ type: 'recent', text: q }));
        
        // Add saved searches
        search.savedSearches
          .filter(s => s.name.toLowerCase().includes(query.toLowerCase()) ||
                      s.query.toLowerCase().includes(query.toLowerCase()))
          .forEach(s => suggestions.push({ type: 'recent', text: s.query }));
        
        return suggestions.slice(0, 10);
      },
      
      // Filter actions
      setActiveFilters: (filters) => {
        const count = countActiveFilters(filters);
        set(state => ({
          filters: {
            ...state.filters,
            activeFilters: filters,
            activeFiltersCount: count,
            hasActiveFilters: count > 0
          }
        }));
      },
      
      updateActiveFilters: (filters) => {
        const { filters: currentFilters } = get();
        const newFilters = { ...currentFilters.activeFilters, ...filters };
        get().setActiveFilters(newFilters);
      },
      
      applyFilters: () => {
        const { filters } = get();
        set(state => ({
          filters: {
            ...state.filters,
            appliedFilters: { ...filters.activeFilters },
            isApplying: true,
            lastAppliedAt: new Date()
          }
        }));
        
        // Add to filter history
        get().addToFilterHistory(filters.activeFilters);
        
        // Reset applying state after a brief delay
        setTimeout(() => {
          set(state => ({
            filters: { ...state.filters, isApplying: false }
          }));
        }, 500);
      },
      
      clearFilters: () => {
        const defaultFilters = defaultFilterState.activeFilters;
        get().setActiveFilters(defaultFilters);
      },
      
      resetFilters: () => {
        set(state => ({
          filters: {
            ...state.filters,
            activeFilters: defaultFilterState.activeFilters,
            appliedFilters: defaultFilterState.appliedFilters,
            tempFilters: defaultFilterState.tempFilters,
            activeFiltersCount: 0,
            hasActiveFilters: false
          }
        }));
      },
      
      setTempFilters: (filters) => {
        set(state => ({
          filters: { ...state.filters, tempFilters: filters }
        }));
      },
      
      revertTempFilters: () => {
        const { filters } = get();
        set(state => ({
          filters: {
            ...state.filters,
            activeFilters: { ...filters.tempFilters }
          }
        }));
      },
      
      toggleFilterPanel: () => {
        set(state => ({
          filters: {
            ...state.filters,
            isFilterPanelOpen: !state.filters.isFilterPanelOpen
          }
        }));
      },
      
      setFilterPanel: (open) => {
        set(state => ({
          filters: { ...state.filters, isFilterPanelOpen: open }
        }));
      },
      
      // Filter history
      addToFilterHistory: (filters) => {
        set(state => ({
          filters: {
            ...state.filters,
            filterHistory: addToRecentList(state.filters.filterHistory, filters, 20)
          }
        }));
      },
      
      clearFilterHistory: () => {
        set(state => ({
          filters: { ...state.filters, filterHistory: [] }
        }));
      },
      
      getFilterHistory: () => {
        const { filters } = get();
        return filters.filterHistory;
      },
      
      // Favorite filters
      saveFavoriteFilter: (name, filters, isQuickAccess = false) => {
        const favoriteFilter: FavoriteFilter = {
          id: generateId(),
          name,
          filters,
          createdAt: new Date(),
          lastUsed: new Date(),
          useCount: 0,
          isQuickAccess
        };
        
        set(state => ({
          filters: {
            ...state.filters,
            favoriteFilters: [...state.filters.favoriteFilters, favoriteFilter]
          }
        }));
      },
      
      removeFavoriteFilter: (id) => {
        set(state => ({
          filters: {
            ...state.filters,
            favoriteFilters: state.filters.favoriteFilters.filter(f => f.id !== id)
          }
        }));
      },
      
      updateFavoriteFilter: (id, updates) => {
        set(state => ({
          filters: {
            ...state.filters,
            favoriteFilters: state.filters.favoriteFilters.map(f =>
              f.id === id ? { ...f, ...updates } : f
            )
          }
        }));
      },
      
      useFavoriteFilter: (id) => {
        const { filters } = get();
        const favoriteFilter = filters.favoriteFilters.find(f => f.id === id);
        if (!favoriteFilter) return;
        
        // Update favorite filter usage
        get().updateFavoriteFilter(id, {
          lastUsed: new Date(),
          useCount: favoriteFilter.useCount + 1
        });
        
        // Apply the favorite filter
        get().setActiveFilters(favoriteFilter.filters);
      },
      
      getFavoriteFilter: (id) => {
        const { filters } = get();
        return filters.favoriteFilters.find(f => f.id === id);
      },
      
      toggleQuickAccess: (id) => {
        const { filters } = get();
        const favoriteFilter = filters.favoriteFilters.find(f => f.id === id);
        if (!favoriteFilter) return;
        
        get().updateFavoriteFilter(id, {
          isQuickAccess: !favoriteFilter.isQuickAccess
        });
      },
      
      // Combined actions
      searchWithFilters: (query, filters) => {
        get().setSearchQuery(query);
        get().setActiveFilters(filters);
        get().applyFilters();
      },
      
      clearSearchAndFilters: () => {
        get().clearSearch();
        get().clearFilters();
      },
      
      // Utility actions
      updateFilterStats: (stats) => {
        set(state => ({
          filters: { ...state.filters, filterStats: stats }
        }));
      },
      
      setFilteredMovies: (movies) => {
        set(state => ({
          filters: { ...state.filters, filteredMovies: movies }
        }));
      },
      
      setFilterApplying: (applying) => {
        set(state => ({
          filters: { ...state.filters, isApplying: applying }
        }));
      },
      
      // Bulk operations
      exportSearchHistory: () => {
        const { search } = get();
        return {
          recentSearches: search.recentSearches,
          savedSearches: search.savedSearches
        };
      },
      
      importSearchHistory: (data) => {
        set(state => ({
          search: {
            ...state.search,
            recentSearches: data.recentSearches || [],
            savedSearches: data.savedSearches || []
          }
        }));
      },
      
      exportFilterHistory: () => {
        const { filters } = get();
        return {
          filterHistory: filters.filterHistory,
          favoriteFilters: filters.favoriteFilters
        };
      },
      
      importFilterHistory: (data) => {
        set(state => ({
          filters: {
            ...state.filters,
            filterHistory: data.filterHistory || [],
            favoriteFilters: data.favoriteFilters || []
          }
        }));
      },
      
      // Analytics
      getSearchAnalytics: () => {
        const { search } = get();
        const totalSearches = search.recentSearches.length + search.savedSearches.reduce((sum, s) => sum + s.useCount, 0);
        const uniqueSearches = new Set([...search.recentSearches, ...search.savedSearches.map(s => s.query)]).size;
        
        return {
          totalSearches,
          uniqueSearches,
          averageResultsPerSearch: 0, // Would need to track this
          mostPopularSearches: [], // Would need to track this
          searchTrends: [] // Would need to track this
        };
      },
      
      getFilterAnalytics: () => {
        const { filters } = get();
        const totalFiltersApplied = filters.filterHistory.length;
        
        return {
          totalFiltersApplied,
          mostUsedFilters: [], // Would need to track this
          averageFiltersPerSession: 0, // Would need to track this
          filterEffectiveness: [] // Would need to track this
        };
      },
      
      // Initialization
      initialize: () => {
        set({ isInitialized: true });
      },
      
      reset: () => {
        set({
          search: defaultSearchState,
          filters: defaultFilterState,
          isInitialized: true
        });
      }
    }),
    {
      name: 'lemonnpie-search-filter-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        search: {
          recentSearches: state.search.recentSearches,
          savedSearches: state.search.savedSearches
        },
        filters: {
          filterHistory: state.filters.filterHistory,
          favoriteFilters: state.filters.favoriteFilters,
          appliedFilters: state.filters.appliedFilters
        }
      })
    }
  )
);

// Utility hooks for search and filter features
export const useSearchState = () => {
  const search = useSearchFilterStore((state) => state.search);
  const setSearchQuery = useSearchFilterStore((state) => state.setSearchQuery);
  const setSearchResults = useSearchFilterStore((state) => state.setSearchResults);
  const setSearchLoading = useSearchFilterStore((state) => state.setSearchLoading);
  const setSearchError = useSearchFilterStore((state) => state.setSearchError);
  const clearSearch = useSearchFilterStore((state) => state.clearSearch);
  
  return {
    search,
    setSearchQuery,
    setSearchResults,
    setSearchLoading,
    setSearchError,
    clearSearch
  };
};

export const useFilterState = () => {
  const filters = useSearchFilterStore((state) => state.filters);
  const setActiveFilters = useSearchFilterStore((state) => state.setActiveFilters);
  const updateActiveFilters = useSearchFilterStore((state) => state.updateActiveFilters);
  const applyFilters = useSearchFilterStore((state) => state.applyFilters);
  const clearFilters = useSearchFilterStore((state) => state.clearFilters);
  const toggleFilterPanel = useSearchFilterStore((state) => state.toggleFilterPanel);
  
  return {
    filters,
    setActiveFilters,
    updateActiveFilters,
    applyFilters,
    clearFilters,
    toggleFilterPanel
  };
};

export const useSavedSearches = () => {
  const savedSearches = useSearchFilterStore((state) => state.search.savedSearches);
  const saveSearch = useSearchFilterStore((state) => state.saveSearch);
  const removeSavedSearch = useSearchFilterStore((state) => state.removeSavedSearch);
  const useSavedSearch = useSearchFilterStore((state) => state.useSavedSearch);
  
  return {
    savedSearches,
    saveSearch,
    removeSavedSearch,
    useSavedSearch
  };
};

export const useFavoriteFilters = () => {
  const favoriteFilters = useSearchFilterStore((state) => state.filters.favoriteFilters);
  const saveFavoriteFilter = useSearchFilterStore((state) => state.saveFavoriteFilter);
  const removeFavoriteFilter = useSearchFilterStore((state) => state.removeFavoriteFilter);
  const useFavoriteFilter = useSearchFilterStore((state) => state.useFavoriteFilter);
  const toggleQuickAccess = useSearchFilterStore((state) => state.toggleQuickAccess);
  
  return {
    favoriteFilters,
    saveFavoriteFilter,
    removeFavoriteFilter,
    useFavoriteFilter,
    toggleQuickAccess
  };
}; 