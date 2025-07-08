import { useState, useEffect, useCallback, useMemo } from "react";
import { Movie } from "@/types/movie";
import { 
  getMovies, 
  getTopRatedMovies, 
  getMoviesByGenre, 
  getMoviesByYear 
} from "@/lib/api/movies";

interface UseMoviesOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
  onSuccess?: (data: Movie[]) => void;
  onError?: (error: Error) => void;
  initialData?: Movie[];
}

interface UseMoviesResult {
  movies: Movie[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  isEmpty: boolean;
  isStale: boolean;
  lastFetched: Date | null;
}

// Cache implementation
class MoviesCache {
  private cache = new Map<string, { data: Movie[]; timestamp: number; staleTime: number }>();
  
  set(key: string, data: Movie[], staleTime: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      staleTime
    });
  }
  
  get(key: string): Movie[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const isStale = Date.now() - cached.timestamp > cached.staleTime;
    return isStale ? null : cached.data;
  }
  
  isStale(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return true;
    return Date.now() - cached.timestamp > cached.staleTime;
  }
  
  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
  
  getLastFetched(key: string): Date | null {
    const cached = this.cache.get(key);
    return cached ? new Date(cached.timestamp) : null;
  }
}

const moviesCache = new MoviesCache();

export function useMovies(options: UseMoviesOptions = {}): UseMoviesResult {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    onSuccess,
    onError,
    initialData = []
  } = options;

  const [movies, setMovies] = useState<Movie[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = "all-movies";

  const fetchMovies = useCallback(async (force = false) => {
    if (!enabled) return;

    // Check cache first
    if (!force) {
      const cached = moviesCache.get(cacheKey);
      if (cached) {
        setMovies(cached);
        onSuccess?.(cached);
        return;
      }
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const data = await getMovies();
      setMovies(data);
      moviesCache.set(cacheKey, data, staleTime);
      onSuccess?.(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch movies');
      setError(error);
      setIsError(true);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, staleTime, onSuccess, onError, cacheKey]);

  const refetch = useCallback(() => fetchMovies(true), [fetchMovies]);
  const refresh = useCallback(() => fetchMovies(false), [fetchMovies]);

  // Initial fetch
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (moviesCache.isStale(cacheKey)) {
        fetchMovies();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, fetchMovies, cacheKey]);

  const isEmpty = useMemo(() => movies.length === 0, [movies]);
  const isStale = useMemo(() => moviesCache.isStale(cacheKey), [cacheKey]);
  const lastFetched = useMemo(() => moviesCache.getLastFetched(cacheKey), [cacheKey]);

  return {
    movies,
    isLoading,
    isError,
    error,
    refetch,
    refresh,
    isEmpty,
    isStale,
    lastFetched
  };
}

// Hook for top-rated movies
export function useTopRatedMovies(options: UseMoviesOptions = {}): UseMoviesResult {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000,
    onSuccess,
    onError,
    initialData = []
  } = options;

  const [movies, setMovies] = useState<Movie[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = "top-rated-movies";

  const fetchTopRatedMovies = useCallback(async (force = false) => {
    if (!enabled) return;

    if (!force) {
      const cached = moviesCache.get(cacheKey);
      if (cached) {
        setMovies(cached);
        onSuccess?.(cached);
        return;
      }
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const data = await getTopRatedMovies();
      setMovies(data);
      moviesCache.set(cacheKey, data, staleTime);
      onSuccess?.(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch top-rated movies');
      setError(error);
      setIsError(true);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, staleTime, onSuccess, onError, cacheKey]);

  const refetch = useCallback(() => fetchTopRatedMovies(true), [fetchTopRatedMovies]);
  const refresh = useCallback(() => fetchTopRatedMovies(false), [fetchTopRatedMovies]);

  useEffect(() => {
    fetchTopRatedMovies();
  }, [fetchTopRatedMovies]);

  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (moviesCache.isStale(cacheKey)) {
        fetchTopRatedMovies();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, fetchTopRatedMovies, cacheKey]);

  const isEmpty = useMemo(() => movies.length === 0, [movies]);
  const isStale = useMemo(() => moviesCache.isStale(cacheKey), [cacheKey]);
  const lastFetched = useMemo(() => moviesCache.getLastFetched(cacheKey), [cacheKey]);

  return {
    movies,
    isLoading,
    isError,
    error,
    refetch,
    refresh,
    isEmpty,
    isStale,
    lastFetched
  };
}

// Hook for movies by genre
export function useMoviesByGenre(
  genre: string,
  options: UseMoviesOptions = {}
): UseMoviesResult {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000,
    onSuccess,
    onError,
    initialData = []
  } = options;

  const [movies, setMovies] = useState<Movie[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = `movies-by-genre-${genre}`;

  const fetchMoviesByGenre = useCallback(async (force = false) => {
    if (!enabled || !genre) return;

    if (!force) {
      const cached = moviesCache.get(cacheKey);
      if (cached) {
        setMovies(cached);
        onSuccess?.(cached);
        return;
      }
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const data = await getMoviesByGenre(genre);
      setMovies(data);
      moviesCache.set(cacheKey, data, staleTime);
      onSuccess?.(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to fetch movies by genre: ${genre}`);
      setError(error);
      setIsError(true);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, genre, staleTime, onSuccess, onError, cacheKey]);

  const refetch = useCallback(() => fetchMoviesByGenre(true), [fetchMoviesByGenre]);
  const refresh = useCallback(() => fetchMoviesByGenre(false), [fetchMoviesByGenre]);

  useEffect(() => {
    fetchMoviesByGenre();
  }, [fetchMoviesByGenre]);

  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (moviesCache.isStale(cacheKey)) {
        fetchMoviesByGenre();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, fetchMoviesByGenre, cacheKey]);

  const isEmpty = useMemo(() => movies.length === 0, [movies]);
  const isStale = useMemo(() => moviesCache.isStale(cacheKey), [cacheKey]);
  const lastFetched = useMemo(() => moviesCache.getLastFetched(cacheKey), [cacheKey]);

  return {
    movies,
    isLoading,
    isError,
    error,
    refetch,
    refresh,
    isEmpty,
    isStale,
    lastFetched
  };
}

// Hook for movies by year
export function useMoviesByYear(
  year: number,
  options: UseMoviesOptions = {}
): UseMoviesResult {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000,
    onSuccess,
    onError,
    initialData = []
  } = options;

  const [movies, setMovies] = useState<Movie[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = `movies-by-year-${year}`;

  const fetchMoviesByYear = useCallback(async (force = false) => {
    if (!enabled || !year) return;

    if (!force) {
      const cached = moviesCache.get(cacheKey);
      if (cached) {
        setMovies(cached);
        onSuccess?.(cached);
        return;
      }
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const data = await getMoviesByYear(year);
      setMovies(data);
      moviesCache.set(cacheKey, data, staleTime);
      onSuccess?.(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to fetch movies by year: ${year}`);
      setError(error);
      setIsError(true);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, year, staleTime, onSuccess, onError, cacheKey]);

  const refetch = useCallback(() => fetchMoviesByYear(true), [fetchMoviesByYear]);
  const refresh = useCallback(() => fetchMoviesByYear(false), [fetchMoviesByYear]);

  useEffect(() => {
    fetchMoviesByYear();
  }, [fetchMoviesByYear]);

  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (moviesCache.isStale(cacheKey)) {
        fetchMoviesByYear();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, fetchMoviesByYear, cacheKey]);

  const isEmpty = useMemo(() => movies.length === 0, [movies]);
  const isStale = useMemo(() => moviesCache.isStale(cacheKey), [cacheKey]);
  const lastFetched = useMemo(() => moviesCache.getLastFetched(cacheKey), [cacheKey]);

  return {
    movies,
    isLoading,
    isError,
    error,
    refetch,
    refresh,
    isEmpty,
    isStale,
    lastFetched
  };
}

// Utility function to clear all movie caches
export function clearMoviesCache(key?: string) {
  moviesCache.clear(key);
}

// Utility function to prefetch movies
export function prefetchMovies() {
  return getMovies();
}

// Utility function to get cached movies without triggering a fetch
export function getCachedMovies(key: string = "all-movies"): Movie[] | null {
  return moviesCache.get(key);
} 