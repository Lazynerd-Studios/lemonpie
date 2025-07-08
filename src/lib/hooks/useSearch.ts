import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Movie } from "@/types/movie";
import { searchMovies } from "@/lib/api/movies";

interface SearchOptions {
  enabled?: boolean;
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
  staleTime?: number;
  onSuccess?: (data: Movie[], query: string) => void;
  onError?: (error: Error, query: string) => void;
  saveToHistory?: boolean;
  includeGenres?: string[];
  excludeGenres?: string[];
  yearRange?: { min?: number; max?: number };
  ratingRange?: { min?: number; max?: number };
  sortBy?: 'relevance' | 'rating' | 'year' | 'title';
  sortOrder?: 'asc' | 'desc';
}

interface SearchResult {
  query: string;
  movies: Movie[];
  timestamp: number;
  resultCount: number;
}

interface UseSearchResult {
  query: string;
  movies: Movie[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isEmpty: boolean;
  isDebouncing: boolean;
  hasSearched: boolean;
  searchHistory: string[];
  resultCount: number;
  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
  clearHistory: () => void;
  removeFromHistory: (query: string) => void;
  refetch: () => Promise<void>;
  suggestions: string[];
}

// Cache for search results
class SearchCache {
  private cache = new Map<string, SearchResult>();
  private maxSize = 50;
  
  private generateKey(query: string, options: SearchOptions): string {
    const optionsKey = JSON.stringify({
      includeGenres: options.includeGenres,
      excludeGenres: options.excludeGenres,
      yearRange: options.yearRange,
      ratingRange: options.ratingRange,
      sortBy: options.sortBy,
      sortOrder: options.sortOrder
    });
    return `${query.toLowerCase()}:${optionsKey}`;
  }
  
  set(query: string, options: SearchOptions, result: SearchResult) {
    const key = this.generateKey(query, options);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, result);
  }
  
  get(query: string, options: SearchOptions, staleTime: number = 5 * 60 * 1000): SearchResult | null {
    const key = this.generateKey(query, options);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    const isStale = Date.now() - cached.timestamp > staleTime;
    return isStale ? null : cached;
  }
  
  clear() {
    this.cache.clear();
  }
}

// Search history management
class SearchHistory {
  private static readonly STORAGE_KEY = 'lemonnpie_search_history';
  private static readonly MAX_HISTORY = 20;
  
  static getHistory(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }
  
  static addToHistory(query: string) {
    if (typeof window === 'undefined' || !query.trim()) return;
    
    const history = this.getHistory();
    const trimmedQuery = query.trim();
    
    // Remove if already exists
    const filtered = history.filter(item => item !== trimmedQuery);
    
    // Add to beginning
    const newHistory = [trimmedQuery, ...filtered].slice(0, this.MAX_HISTORY);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newHistory));
    } catch {
      // Ignore localStorage errors
    }
  }
  
  static removeFromHistory(query: string) {
    if (typeof window === 'undefined') return;
    
    const history = this.getHistory();
    const filtered = history.filter(item => item !== query);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      // Ignore localStorage errors
    }
  }
  
  static clearHistory() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // Ignore localStorage errors
    }
  }
}

const searchCache = new SearchCache();

export function useSearch(options: SearchOptions = {}): UseSearchResult {
  const {
    enabled = true,
    debounceMs = 300,
    minQueryLength = 2,
    maxResults = 50,
    staleTime = 5 * 60 * 1000,
    onSuccess,
    onError,
    saveToHistory = true,
    includeGenres = [],
    excludeGenres = [],
    yearRange,
    ratingRange,
    sortBy = 'relevance',
    sortOrder = 'desc'
  } = options;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [resultCount, setResultCount] = useState(0);

  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Load search history on mount
  useEffect(() => {
    setSearchHistory(SearchHistory.getHistory());
  }, []);

  // Debounce query changes
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (query.length >= minQueryLength) {
      setIsDebouncing(true);
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedQuery(query);
        setIsDebouncing(false);
      }, debounceMs);
    } else {
      setDebouncedQuery("");
      setIsDebouncing(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, debounceMs, minQueryLength]);

  // Filter and sort movies based on options
  const processMovies = useCallback((movies: Movie[]): Movie[] => {
    let filtered = movies;

    // Filter by genres
    if (includeGenres.length > 0) {
      filtered = filtered.filter(movie =>
        includeGenres.some(genre =>
          movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
      );
    }

    if (excludeGenres.length > 0) {
      filtered = filtered.filter(movie =>
        !excludeGenres.some(genre =>
          movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
      );
    }

    // Filter by year range
    if (yearRange) {
      filtered = filtered.filter(movie => {
        if (yearRange.min && movie.year < yearRange.min) return false;
        if (yearRange.max && movie.year > yearRange.max) return false;
        return true;
      });
    }

    // Filter by rating range
    if (ratingRange) {
      filtered = filtered.filter(movie => {
        if (ratingRange.min && movie.rating < ratingRange.min) return false;
        if (ratingRange.max && movie.rating > ratingRange.max) return false;
        return true;
      });
    }

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'relevance':
        default:
          // For relevance, movies with titles matching the query should come first
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const queryLower = debouncedQuery.toLowerCase();
          
          const aExactMatch = aTitle.includes(queryLower);
          const bExactMatch = bTitle.includes(queryLower);
          
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
          
          // Then by popularity if available
          if (a.popularity && b.popularity) {
            comparison = (b.popularity || 0) - (a.popularity || 0);
          } else {
            comparison = b.rating - a.rating;
          }
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered.slice(0, maxResults);
  }, [includeGenres, excludeGenres, yearRange, ratingRange, sortBy, sortOrder, maxResults, debouncedQuery]);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!enabled || !searchQuery || searchQuery.length < minQueryLength) {
      setMovies([]);
      setResultCount(0);
      setIsEmpty(false);
      setHasSearched(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check cache first
    const cached = searchCache.get(searchQuery, options, staleTime);
    if (cached) {
      const processedMovies = processMovies(cached.movies);
      setMovies(processedMovies);
      setResultCount(cached.resultCount);
      setIsEmpty(processedMovies.length === 0);
      setHasSearched(true);
      onSuccess?.(processedMovies, searchQuery);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);
    setHasSearched(true);

    abortControllerRef.current = new AbortController();

    try {
      const results = await searchMovies(searchQuery);
      const processedMovies = processMovies(results);
      
      // Cache the raw results
      searchCache.set(searchQuery, options, {
        query: searchQuery,
        movies: results,
        timestamp: Date.now(),
        resultCount: results.length
      });

      setMovies(processedMovies);
      setResultCount(results.length);
      setIsEmpty(processedMovies.length === 0);
      
      // Add to search history
      if (saveToHistory) {
        SearchHistory.addToHistory(searchQuery);
        setSearchHistory(SearchHistory.getHistory());
      }

      onSuccess?.(processedMovies, searchQuery);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was aborted, don't update state
      }
      
      const error = err instanceof Error ? err : new Error(`Search failed: ${searchQuery}`);
      setError(error);
      setIsError(true);
      onError?.(error, searchQuery);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, minQueryLength, options, staleTime, processMovies, onSuccess, onError, saveToHistory]);

  // Search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  // Manual search function
  const search = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    setDebouncedQuery(searchQuery);
    await performSearch(searchQuery);
  }, [performSearch]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setMovies([]);
    setResultCount(0);
    setIsEmpty(false);
    setHasSearched(false);
    setIsError(false);
    setError(null);
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // History management functions
  const clearHistory = useCallback(() => {
    SearchHistory.clearHistory();
    setSearchHistory([]);
  }, []);

  const removeFromHistory = useCallback((queryToRemove: string) => {
    SearchHistory.removeFromHistory(queryToRemove);
    setSearchHistory(SearchHistory.getHistory());
  }, []);

  // Refetch current search
  const refetch = useCallback(() => {
    if (debouncedQuery) {
      return performSearch(debouncedQuery);
    }
  }, [debouncedQuery, performSearch]);

  // Generate search suggestions based on history and current query
  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    
    const queryLower = query.toLowerCase();
    return searchHistory
      .filter(historyItem => 
        historyItem.toLowerCase().includes(queryLower) && 
        historyItem !== query
      )
      .slice(0, 5);
  }, [query, searchHistory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    query,
    movies,
    isLoading,
    isError,
    error,
    isEmpty,
    isDebouncing,
    hasSearched,
    searchHistory,
    resultCount,
    setQuery,
    search,
    clearSearch,
    clearHistory,
    removeFromHistory,
    refetch,
    suggestions
  };
}

// Hook for search suggestions
export function useSearchSuggestions(query: string): {
  suggestions: string[];
  isLoading: boolean;
} {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    // Get suggestions from search history
    const historySuggestions = SearchHistory.getHistory()
      .filter(item => item.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);

    // You could also add popular searches, genre suggestions, etc.
    setSuggestions(historySuggestions);
    setIsLoading(false);
  }, [query]);

  return { suggestions, isLoading };
}

// Utility functions
export function clearSearchCache() {
  searchCache.clear();
}

export function getSearchHistory(): string[] {
  return SearchHistory.getHistory();
}

export function addToSearchHistory(query: string) {
  SearchHistory.addToHistory(query);
}

export function clearSearchHistory() {
  SearchHistory.clearHistory();
} 