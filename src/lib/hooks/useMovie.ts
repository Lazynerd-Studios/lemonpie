import { useState, useEffect, useCallback, useMemo } from "react";
import { Movie } from "@/types/movie";
import { 
  getMovie, 
  getRelatedMovies, 
  getMovieReviews 
} from "@/lib/api/movies";

interface UseMovieOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
  onSuccess?: (data: Movie) => void;
  onError?: (error: Error) => void;
  fetchRelated?: boolean;
  fetchReviews?: boolean;
}

interface UseMovieResult {
  movie: Movie | null;
  relatedMovies: Movie[];
  reviews: any[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
  isNotFound: boolean;
  isStale: boolean;
  lastFetched: Date | null;
}

// Cache implementation for individual movies
class MovieCache {
  private cache = new Map<string, { data: Movie; timestamp: number; staleTime: number }>();
  private relatedCache = new Map<string, { data: Movie[]; timestamp: number; staleTime: number }>();
  private reviewsCache = new Map<string, { data: any[]; timestamp: number; staleTime: number }>();
  
  setMovie(id: string, data: Movie, staleTime: number = 5 * 60 * 1000) {
    this.cache.set(id, {
      data,
      timestamp: Date.now(),
      staleTime
    });
  }
  
  getMovie(id: string): Movie | null {
    const cached = this.cache.get(id);
    if (!cached) return null;
    
    const isStale = Date.now() - cached.timestamp > cached.staleTime;
    return isStale ? null : cached.data;
  }
  
  setRelatedMovies(id: string, data: Movie[], staleTime: number = 5 * 60 * 1000) {
    this.relatedCache.set(id, {
      data,
      timestamp: Date.now(),
      staleTime
    });
  }
  
  getRelatedMovies(id: string): Movie[] | null {
    const cached = this.relatedCache.get(id);
    if (!cached) return null;
    
    const isStale = Date.now() - cached.timestamp > cached.staleTime;
    return isStale ? null : cached.data;
  }
  
  setReviews(id: string, data: any[], staleTime: number = 5 * 60 * 1000) {
    this.reviewsCache.set(id, {
      data,
      timestamp: Date.now(),
      staleTime
    });
  }
  
  getReviews(id: string): any[] | null {
    const cached = this.reviewsCache.get(id);
    if (!cached) return null;
    
    const isStale = Date.now() - cached.timestamp > cached.staleTime;
    return isStale ? null : cached.data;
  }
  
  isStale(id: string): boolean {
    const cached = this.cache.get(id);
    if (!cached) return true;
    return Date.now() - cached.timestamp > cached.staleTime;
  }
  
  getLastFetched(id: string): Date | null {
    const cached = this.cache.get(id);
    return cached ? new Date(cached.timestamp) : null;
  }
  
  clear(id?: string) {
    if (id) {
      this.cache.delete(id);
      this.relatedCache.delete(id);
      this.reviewsCache.delete(id);
    } else {
      this.cache.clear();
      this.relatedCache.clear();
      this.reviewsCache.clear();
    }
  }
}

const movieCache = new MovieCache();

export function useMovie(
  id: string,
  options: UseMovieOptions = {}
): UseMovieResult {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    onSuccess,
    onError,
    fetchRelated = true,
    fetchReviews = true
  } = options;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const fetchMovieData = useCallback(async (force = false) => {
    if (!enabled || !id) return;

    // Check cache first
    if (!force) {
      const cachedMovie = movieCache.getMovie(id);
      if (cachedMovie) {
        setMovie(cachedMovie);
        onSuccess?.(cachedMovie);
        
        // Also check for cached related movies and reviews
        const cachedRelated = movieCache.getRelatedMovies(id);
        const cachedReviews = movieCache.getReviews(id);
        
        if (cachedRelated && fetchRelated) {
          setRelatedMovies(cachedRelated);
        }
        
        if (cachedReviews && fetchReviews) {
          setReviews(cachedReviews);
        }
        
        return;
      }
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);
    setIsNotFound(false);

    try {
      // Fetch main movie data
      const movieData = await getMovie(id);
      
      if (!movieData) {
        setIsNotFound(true);
        setMovie(null);
        return;
      }

      setMovie(movieData);
      movieCache.setMovie(id, movieData, staleTime);
      onSuccess?.(movieData);

      // Fetch related movies and reviews in parallel
      const promises = [];
      
      if (fetchRelated) {
        promises.push(
          getRelatedMovies(id).then(related => {
            setRelatedMovies(related);
            movieCache.setRelatedMovies(id, related, staleTime);
          })
        );
      }
      
      if (fetchReviews) {
        promises.push(
          getMovieReviews(id).then(movieReviews => {
            setReviews(movieReviews);
            movieCache.setReviews(id, movieReviews, staleTime);
          })
        );
      }

      // Wait for all additional data to load
      await Promise.all(promises);

    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to fetch movie: ${id}`);
      setError(error);
      setIsError(true);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, id, staleTime, onSuccess, onError, fetchRelated, fetchReviews]);

  const refetch = useCallback(() => fetchMovieData(true), [fetchMovieData]);
  const refresh = useCallback(() => fetchMovieData(false), [fetchMovieData]);

  // Initial fetch
  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  // Reset state when ID changes
  useEffect(() => {
    setMovie(null);
    setRelatedMovies([]);
    setReviews([]);
    setIsNotFound(false);
  }, [id]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus || !id) return;

    const handleFocus = () => {
      if (movieCache.isStale(id)) {
        fetchMovieData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, fetchMovieData, id]);

  const isStale = useMemo(() => movieCache.isStale(id), [id]);
  const lastFetched = useMemo(() => movieCache.getLastFetched(id), [id]);

  return {
    movie,
    relatedMovies,
    reviews,
    isLoading,
    isError,
    error,
    refetch,
    refresh,
    isNotFound,
    isStale,
    lastFetched
  };
}

// Hook for fetching multiple movies by IDs
export function useMoviesByIds(
  ids: string[],
  options: UseMovieOptions = {}
): {
  movies: Movie[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  missingIds: string[];
} {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000,
    onSuccess,
    onError
  } = options;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [missingIds, setMissingIds] = useState<string[]>([]);

  const fetchMoviesByIds = useCallback(async (force = false) => {
    if (!enabled || ids.length === 0) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const moviePromises = ids.map(async (id) => {
        // Check cache first
        if (!force) {
          const cached = movieCache.getMovie(id);
          if (cached) return cached;
        }

        const movieData = await getMovie(id);
        if (movieData) {
          movieCache.setMovie(id, movieData, staleTime);
        }
        return movieData;
      });

      const results = await Promise.all(moviePromises);
      const validMovies = results.filter((movie): movie is Movie => movie !== null);
      const missing = ids.filter((id, index) => results[index] === null);

      setMovies(validMovies);
      setMissingIds(missing);
      onSuccess?.(validMovies);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch movies');
      setError(error);
      setIsError(true);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, ids, staleTime, onSuccess, onError]);

  const refetch = useCallback(() => fetchMoviesByIds(true), [fetchMoviesByIds]);

  useEffect(() => {
    fetchMoviesByIds();
  }, [fetchMoviesByIds]);

  return {
    movies,
    isLoading,
    isError,
    error,
    refetch,
    missingIds
  };
}

// Hook for prefetching a movie
export function usePrefetchMovie() {
  return useCallback(async (id: string) => {
    try {
      const movieData = await getMovie(id);
      if (movieData) {
        movieCache.setMovie(id, movieData);
      }
    } catch (error) {
      console.warn(`Failed to prefetch movie ${id}:`, error);
    }
  }, []);
}

// Hook for movie existence check
export function useMovieExists(id: string): {
  exists: boolean | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const [exists, setExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const checkExists = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        // First check cache
        const cached = movieCache.getMovie(id);
        if (cached) {
          setExists(true);
          setIsLoading(false);
          return;
        }

        // Then check API
        const movieData = await getMovie(id);
        setExists(movieData !== null);
        
        if (movieData) {
          movieCache.setMovie(id, movieData);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(`Failed to check movie existence: ${id}`);
        setError(error);
        setIsError(true);
        setExists(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkExists();
  }, [id]);

  return {
    exists,
    isLoading,
    isError,
    error
  };
}

// Utility functions
export function clearMovieCache(id?: string) {
  movieCache.clear(id);
}

export function getCachedMovie(id: string): Movie | null {
  return movieCache.getMovie(id);
}

export function getCachedRelatedMovies(id: string): Movie[] | null {
  return movieCache.getRelatedMovies(id);
}

export function getCachedReviews(id: string): any[] | null {
  return movieCache.getReviews(id);
}

export function prefetchMovie(id: string) {
  return getMovie(id);
} 