import { useState, useEffect, useCallback, useMemo } from "react";
import { Movie } from "@/types/movie";

// Filter types
export interface GenreFilter {
  include: string[];
  exclude: string[];
}

export interface YearFilter {
  min?: number;
  max?: number;
  exact?: number;
}

export interface RatingFilter {
  min?: number;
  max?: number;
}

export interface DurationFilter {
  min?: number; // in minutes
  max?: number; // in minutes
}

export interface BudgetFilter {
  min?: number;
  max?: number;
}

export interface LanguageFilter {
  selected: string[];
}

export interface CountryFilter {
  selected: string[];
}

export interface FilterOptions {
  genres: GenreFilter;
  year: YearFilter;
  rating: RatingFilter;
  duration: DurationFilter;
  language: LanguageFilter;
  country: CountryFilter;
  isNollywood?: boolean;
  hasAwards?: boolean;
  hasTrailer?: boolean;
  sortBy: 'title' | 'year' | 'rating' | 'popularity' | 'duration' | 'budget' | 'releaseDate';
  sortOrder: 'asc' | 'desc';
}

export interface FilterStats {
  totalMovies: number;
  filteredMovies: number;
  availableGenres: string[];
  availableYears: number[];
  availableLanguages: string[];
  availableCountries: string[];
  ratingRange: { min: number; max: number };
  durationRange: { min: number; max: number };
  yearRange: { min: number; max: number };
}

interface UseFiltersOptions {
  onFiltersChange?: (filters: FilterOptions) => void;
  onStatsChange?: (stats: FilterStats) => void;
  saveToStorage?: boolean;
  storageKey?: string;
  initialFilters?: Partial<FilterOptions>;
}

interface UseFiltersResult {
  filters: FilterOptions;
  stats: FilterStats;
  filteredMovies: Movie[];
  isFiltering: boolean;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  
  // Filter setters
  setGenreFilter: (filter: GenreFilter) => void;
  setYearFilter: (filter: YearFilter) => void;
  setRatingFilter: (filter: RatingFilter) => void;
  setDurationFilter: (filter: DurationFilter) => void;
  setLanguageFilter: (filter: LanguageFilter) => void;
  setCountryFilter: (filter: CountryFilter) => void;
  setNollywoodFilter: (value: boolean | undefined) => void;
  setHasAwardsFilter: (value: boolean | undefined) => void;
  setHasTrailerFilter: (value: boolean | undefined) => void;
  setSortBy: (sortBy: FilterOptions['sortBy']) => void;
  setSortOrder: (sortOrder: FilterOptions['sortOrder']) => void;
  
  // Bulk operations
  setFilters: (filters: Partial<FilterOptions>) => void;
  clearFilters: () => void;
  clearFilter: (filterType: keyof FilterOptions) => void;
  resetFilters: () => void;
  
  // Advanced operations
  addGenre: (genre: string, type: 'include' | 'exclude') => void;
  removeGenre: (genre: string, type: 'include' | 'exclude') => void;
  toggleGenre: (genre: string, type: 'include' | 'exclude') => void;
  
  // Utility functions
  applyFilters: (movies: Movie[]) => Movie[];
  getFilterSummary: () => string;
  canClearFilters: boolean;
}

// Default filter state
const defaultFilters: FilterOptions = {
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
};

// Storage utilities
class FilterStorage {
  static save(key: string, filters: FilterOptions) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(filters));
    } catch {
      // Ignore localStorage errors
    }
  }
  
  static load(key: string): FilterOptions | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
  
  static clear(key: string) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore localStorage errors
    }
  }
}

// Filter application logic
function applyFiltersToMovies(movies: Movie[], filters: FilterOptions): Movie[] {
  let filtered = [...movies];

  // Genre filters
  if (filters.genres.include.length > 0) {
    filtered = filtered.filter(movie =>
      filters.genres.include.some(genre =>
        movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    );
  }

  if (filters.genres.exclude.length > 0) {
    filtered = filtered.filter(movie =>
      !filters.genres.exclude.some(genre =>
        movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    );
  }

  // Year filters
  if (filters.year.exact) {
    filtered = filtered.filter(movie => movie.year === filters.year.exact);
  } else {
    if (filters.year.min) {
      filtered = filtered.filter(movie => movie.year >= filters.year.min!);
    }
    if (filters.year.max) {
      filtered = filtered.filter(movie => movie.year <= filters.year.max!);
    }
  }

  // Rating filters
  if (filters.rating.min) {
    filtered = filtered.filter(movie => movie.rating >= filters.rating.min!);
  }
  if (filters.rating.max) {
    filtered = filtered.filter(movie => movie.rating <= filters.rating.max!);
  }

  // Duration filters
  if (filters.duration.min) {
    filtered = filtered.filter(movie => movie.duration >= filters.duration.min!);
  }
  if (filters.duration.max) {
    filtered = filtered.filter(movie => movie.duration <= filters.duration.max!);
  }

  // Language filters
  if (filters.language.selected.length > 0) {
    filtered = filtered.filter(movie =>
      movie.language && filters.language.selected.some(lang =>
        movie.language!.toLowerCase().includes(lang.toLowerCase())
      )
    );
  }

  // Country filters
  if (filters.country.selected.length > 0) {
    filtered = filtered.filter(movie =>
      movie.country && filters.country.selected.some(country =>
        movie.country!.toLowerCase().includes(country.toLowerCase())
      )
    );
  }

  // Boolean filters
  if (filters.isNollywood !== undefined) {
    filtered = filtered.filter(movie => Boolean(movie.isNollywood) === filters.isNollywood);
  }

  if (filters.hasAwards !== undefined) {
    filtered = filtered.filter(movie => 
      filters.hasAwards ? (movie.awards && movie.awards.length > 0) : !movie.awards || movie.awards.length === 0
    );
  }

  if (filters.hasTrailer !== undefined) {
    filtered = filtered.filter(movie => 
      filters.hasTrailer ? Boolean(movie.trailer) : !movie.trailer
    );
  }

  // Sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'year':
        comparison = a.year - b.year;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'popularity':
        comparison = (a.popularity || 0) - (b.popularity || 0);
        break;
      case 'duration':
        comparison = a.duration - b.duration;
        break;
      case 'budget':
        const aBudget = a.budget ? parseFloat(a.budget.replace(/[^\d.]/g, '')) : 0;
        const bBudget = b.budget ? parseFloat(b.budget.replace(/[^\d.]/g, '')) : 0;
        comparison = aBudget - bBudget;
        break;
      case 'releaseDate':
        const aDate = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const bDate = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
        comparison = aDate - bDate;
        break;
      default:
        comparison = 0;
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
}

// Generate filter statistics
function generateFilterStats(movies: Movie[], filteredMovies: Movie[]): FilterStats {
  const allGenres = new Set<string>();
  const allYears = new Set<number>();
  const allLanguages = new Set<string>();
  const allCountries = new Set<string>();
  let minRating = Infinity;
  let maxRating = -Infinity;
  let minDuration = Infinity;
  let maxDuration = -Infinity;
  let minYear = Infinity;
  let maxYear = -Infinity;

  movies.forEach(movie => {
    // Collect genres
    movie.genre.forEach(genre => allGenres.add(genre));
    
    // Collect years
    allYears.add(movie.year);
    
    // Collect languages
    if (movie.language) {
      movie.language.split('/').forEach(lang => allLanguages.add(lang.trim()));
    }
    
    // Collect countries
    if (movie.country) {
      allCountries.add(movie.country);
    }
    
    // Rating range
    minRating = Math.min(minRating, movie.rating);
    maxRating = Math.max(maxRating, movie.rating);
    
    // Duration range
    minDuration = Math.min(minDuration, movie.duration);
    maxDuration = Math.max(maxDuration, movie.duration);
    
    // Year range
    minYear = Math.min(minYear, movie.year);
    maxYear = Math.max(maxYear, movie.year);
  });

  return {
    totalMovies: movies.length,
    filteredMovies: filteredMovies.length,
    availableGenres: Array.from(allGenres).sort(),
    availableYears: Array.from(allYears).sort((a, b) => b - a),
    availableLanguages: Array.from(allLanguages).sort(),
    availableCountries: Array.from(allCountries).sort(),
    ratingRange: { min: minRating, max: maxRating },
    durationRange: { min: minDuration, max: maxDuration },
    yearRange: { min: minYear, max: maxYear }
  };
}

// Count active filters
function countActiveFilters(filters: FilterOptions): number {
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
}

export function useFilters(
  movies: Movie[],
  options: UseFiltersOptions = {}
): UseFiltersResult {
  const {
    onFiltersChange,
    onStatsChange,
    saveToStorage = true,
    storageKey = 'lemonnpie_filters',
    initialFilters = {}
  } = options;

  // Initialize filters from storage or defaults
  const [filters, setFiltersState] = useState<FilterOptions>(() => {
    const stored = saveToStorage ? FilterStorage.load(storageKey) : null;
    return { ...defaultFilters, ...stored, ...initialFilters };
  });

  const [isFiltering, setIsFiltering] = useState(false);

  // Apply filters to movies
  const filteredMovies = useMemo(() => {
    setIsFiltering(true);
    const result = applyFiltersToMovies(movies, filters);
    setIsFiltering(false);
    return result;
  }, [movies, filters]);

  // Generate statistics
  const stats = useMemo(() => {
    const result = generateFilterStats(movies, filteredMovies);
    onStatsChange?.(result);
    return result;
  }, [movies, filteredMovies, onStatsChange]);

  // Count active filters
  const activeFiltersCount = useMemo(() => countActiveFilters(filters), [filters]);
  const hasActiveFilters = activeFiltersCount > 0;
  const canClearFilters = hasActiveFilters;

  // Update filters and save to storage
  const updateFilters = useCallback((newFilters: FilterOptions) => {
    setFiltersState(newFilters);
    
    if (saveToStorage) {
      FilterStorage.save(storageKey, newFilters);
    }
    
    onFiltersChange?.(newFilters);
  }, [saveToStorage, storageKey, onFiltersChange]);

  // Individual filter setters
  const setGenreFilter = useCallback((filter: GenreFilter) => {
    updateFilters({ ...filters, genres: filter });
  }, [filters, updateFilters]);

  const setYearFilter = useCallback((filter: YearFilter) => {
    updateFilters({ ...filters, year: filter });
  }, [filters, updateFilters]);

  const setRatingFilter = useCallback((filter: RatingFilter) => {
    updateFilters({ ...filters, rating: filter });
  }, [filters, updateFilters]);

  const setDurationFilter = useCallback((filter: DurationFilter) => {
    updateFilters({ ...filters, duration: filter });
  }, [filters, updateFilters]);

  const setLanguageFilter = useCallback((filter: LanguageFilter) => {
    updateFilters({ ...filters, language: filter });
  }, [filters, updateFilters]);

  const setCountryFilter = useCallback((filter: CountryFilter) => {
    updateFilters({ ...filters, country: filter });
  }, [filters, updateFilters]);

  const setNollywoodFilter = useCallback((value: boolean | undefined) => {
    updateFilters({ ...filters, isNollywood: value });
  }, [filters, updateFilters]);

  const setHasAwardsFilter = useCallback((value: boolean | undefined) => {
    updateFilters({ ...filters, hasAwards: value });
  }, [filters, updateFilters]);

  const setHasTrailerFilter = useCallback((value: boolean | undefined) => {
    updateFilters({ ...filters, hasTrailer: value });
  }, [filters, updateFilters]);

  const setSortBy = useCallback((sortBy: FilterOptions['sortBy']) => {
    updateFilters({ ...filters, sortBy });
  }, [filters, updateFilters]);

  const setSortOrder = useCallback((sortOrder: FilterOptions['sortOrder']) => {
    updateFilters({ ...filters, sortOrder });
  }, [filters, updateFilters]);

  // Bulk operations
  const setFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    updateFilters({ ...filters, ...newFilters });
  }, [filters, updateFilters]);

  const clearFilters = useCallback(() => {
    updateFilters(defaultFilters);
  }, [updateFilters]);

  const clearFilter = useCallback((filterType: keyof FilterOptions) => {
    const newFilters = { ...filters };
    
    switch (filterType) {
      case 'genres':
        newFilters.genres = { include: [], exclude: [] };
        break;
      case 'year':
        newFilters.year = {};
        break;
      case 'rating':
        newFilters.rating = {};
        break;
      case 'duration':
        newFilters.duration = {};
        break;
      case 'language':
        newFilters.language = { selected: [] };
        break;
      case 'country':
        newFilters.country = { selected: [] };
        break;
      case 'isNollywood':
        newFilters.isNollywood = undefined;
        break;
      case 'hasAwards':
        newFilters.hasAwards = undefined;
        break;
      case 'hasTrailer':
        newFilters.hasTrailer = undefined;
        break;
      case 'sortBy':
        newFilters.sortBy = defaultFilters.sortBy;
        break;
      case 'sortOrder':
        newFilters.sortOrder = defaultFilters.sortOrder;
        break;
    }
    
    updateFilters(newFilters);
  }, [filters, updateFilters]);

  const resetFilters = useCallback(() => {
    if (saveToStorage) {
      FilterStorage.clear(storageKey);
    }
    updateFilters(defaultFilters);
  }, [saveToStorage, storageKey, updateFilters]);

  // Genre operations
  const addGenre = useCallback((genre: string, type: 'include' | 'exclude') => {
    const newGenres = { ...filters.genres };
    if (!newGenres[type].includes(genre)) {
      newGenres[type] = [...newGenres[type], genre];
    }
    updateFilters({ ...filters, genres: newGenres });
  }, [filters, updateFilters]);

  const removeGenre = useCallback((genre: string, type: 'include' | 'exclude') => {
    const newGenres = { ...filters.genres };
    newGenres[type] = newGenres[type].filter(g => g !== genre);
    updateFilters({ ...filters, genres: newGenres });
  }, [filters, updateFilters]);

  const toggleGenre = useCallback((genre: string, type: 'include' | 'exclude') => {
    const newGenres = { ...filters.genres };
    if (newGenres[type].includes(genre)) {
      newGenres[type] = newGenres[type].filter(g => g !== genre);
    } else {
      newGenres[type] = [...newGenres[type], genre];
    }
    updateFilters({ ...filters, genres: newGenres });
  }, [filters, updateFilters]);

  // Utility functions
  const applyFilters = useCallback((moviesToFilter: Movie[]) => {
    return applyFiltersToMovies(moviesToFilter, filters);
  }, [filters]);

  const getFilterSummary = useCallback(() => {
    const parts = [];
    
    if (filters.genres.include.length > 0) {
      parts.push(`Genres: ${filters.genres.include.join(', ')}`);
    }
    if (filters.year.min || filters.year.max) {
      parts.push(`Year: ${filters.year.min || 'Any'} - ${filters.year.max || 'Any'}`);
    }
    if (filters.rating.min || filters.rating.max) {
      parts.push(`Rating: ${filters.rating.min || 0} - ${filters.rating.max || 10}`);
    }
    if (filters.isNollywood !== undefined) {
      parts.push(`Nollywood: ${filters.isNollywood ? 'Yes' : 'No'}`);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'No filters applied';
  }, [filters]);

  return {
    filters,
    stats,
    filteredMovies,
    isFiltering,
    activeFiltersCount,
    hasActiveFilters,
    canClearFilters,
    
    // Setters
    setGenreFilter,
    setYearFilter,
    setRatingFilter,
    setDurationFilter,
    setLanguageFilter,
    setCountryFilter,
    setNollywoodFilter,
    setHasAwardsFilter,
    setHasTrailerFilter,
    setSortBy,
    setSortOrder,
    
    // Bulk operations
    setFilters,
    clearFilters,
    clearFilter,
    resetFilters,
    
    // Genre operations
    addGenre,
    removeGenre,
    toggleGenre,
    
    // Utilities
    applyFilters,
    getFilterSummary
  };
}

// Utility function to get available filter options from movies
export function getAvailableFilterOptions(movies: Movie[]): {
  genres: string[];
  years: number[];
  languages: string[];
  countries: string[];
  ratingRange: { min: number; max: number };
  durationRange: { min: number; max: number };
} {
  const stats = generateFilterStats(movies, movies);
  return {
    genres: stats.availableGenres,
    years: stats.availableYears,
    languages: stats.availableLanguages,
    countries: stats.availableCountries,
    ratingRange: stats.ratingRange,
    durationRange: stats.durationRange
  };
} 