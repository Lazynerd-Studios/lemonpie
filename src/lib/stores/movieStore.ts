import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Movie } from '@/types/movie';

export interface MovieListItem {
  movieId: string;
  movie: Movie;
  addedAt: Date;
  notes?: string;
}

export interface RecentlyViewedItem {
  movieId: string;
  movie: Movie;
  viewedAt: Date;
  viewCount: number;
  watchTime?: number; // in seconds
  lastPosition?: number; // in seconds for resume functionality
}

export interface WatchlistItem extends MovieListItem {
  priority: 'low' | 'medium' | 'high';
  wantToWatch: boolean;
  reminderDate?: Date;
  category?: string;
}

export interface FavoriteItem extends MovieListItem {
  rating?: number; // personal rating 1-10
  review?: string;
  favorite: true;
  tags?: string[];
}

interface MovieStore {
  // State
  favorites: FavoriteItem[];
  watchlist: WatchlistItem[];
  recentlyViewed: RecentlyViewedItem[];
  isLoading: boolean;
  lastSync: Date | null;
  
  // Favorites actions
  addToFavorites: (movie: Movie, rating?: number, review?: string, tags?: string[]) => void;
  removeFromFavorites: (movieId: string) => void;
  updateFavorite: (movieId: string, updates: Partial<Omit<FavoriteItem, 'movieId' | 'movie' | 'addedAt'>>) => void;
  isFavorite: (movieId: string) => boolean;
  getFavorite: (movieId: string) => FavoriteItem | undefined;
  clearFavorites: () => void;
  
  // Watchlist actions
  addToWatchlist: (movie: Movie, priority?: WatchlistItem['priority'], category?: string) => void;
  removeFromWatchlist: (movieId: string) => void;
  updateWatchlistItem: (movieId: string, updates: Partial<Omit<WatchlistItem, 'movieId' | 'movie' | 'addedAt'>>) => void;
  isInWatchlist: (movieId: string) => boolean;
  getWatchlistItem: (movieId: string) => WatchlistItem | undefined;
  clearWatchlist: () => void;
  
  // Recently viewed actions
  addToRecentlyViewed: (movie: Movie, watchTime?: number, lastPosition?: number) => void;
  removeFromRecentlyViewed: (movieId: string) => void;
  clearRecentlyViewed: () => void;
  getRecentlyViewed: (limit?: number) => RecentlyViewedItem[];
  updateViewProgress: (movieId: string, watchTime: number, lastPosition: number) => void;
  
  // Bulk operations
  addMultipleToFavorites: (movies: Movie[]) => void;
  addMultipleToWatchlist: (movies: Movie[]) => void;
  importFavorites: (favorites: FavoriteItem[]) => void;
  importWatchlist: (watchlist: WatchlistItem[]) => void;
  
  // Statistics and analytics
  getStats: () => {
    favoritesCount: number;
    watchlistCount: number;
    recentlyViewedCount: number;
    totalWatchTime: number;
    averageRating: number;
    topGenres: { genre: string; count: number }[];
    topDirectors: { director: string; count: number }[];
    monthlyViews: { month: string; count: number }[];
  };
  
  // Search and filter
  searchFavorites: (query: string) => FavoriteItem[];
  searchWatchlist: (query: string) => WatchlistItem[];
  filterFavoritesByGenre: (genre: string) => FavoriteItem[];
  filterWatchlistByPriority: (priority: WatchlistItem['priority']) => WatchlistItem[];
  filterWatchlistByCategory: (category: string) => WatchlistItem[];
  
  // Sorting
  sortFavorites: (sortBy: 'addedAt' | 'title' | 'rating' | 'year') => FavoriteItem[];
  sortWatchlist: (sortBy: 'addedAt' | 'title' | 'priority' | 'year') => WatchlistItem[];
  
  // Utility actions
  toggleFavorite: (movie: Movie) => void;
  toggleWatchlist: (movie: Movie) => void;
  sync: () => Promise<void>;
  clearAll: () => void;
  exportData: () => { favorites: FavoriteItem[]; watchlist: WatchlistItem[]; recentlyViewed: RecentlyViewedItem[] };
  importData: (data: { favorites?: FavoriteItem[]; watchlist?: WatchlistItem[]; recentlyViewed?: RecentlyViewedItem[] }) => void;
}

// Helper functions
const createMovieListItem = (movie: Movie): Pick<MovieListItem, 'movieId' | 'movie' | 'addedAt'> => ({
  movieId: movie.id,
  movie,
  addedAt: new Date()
});

const filterMoviesByQuery = (movies: (FavoriteItem | WatchlistItem)[], query: string) => {
  const searchTerm = query.toLowerCase();
  return movies.filter(item => 
    item.movie.title.toLowerCase().includes(searchTerm) ||
    item.movie.director.toLowerCase().includes(searchTerm) ||
    item.movie.genre.some(g => g.toLowerCase().includes(searchTerm)) ||
    item.movie.description.toLowerCase().includes(searchTerm)
  );
};

const sortMoviesByField = <T extends MovieListItem>(
  movies: T[], 
  sortBy: 'addedAt' | 'title' | 'rating' | 'year' | 'priority'
): T[] => {
  return [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'addedAt':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case 'title':
        return a.movie.title.localeCompare(b.movie.title);
      case 'rating':
        if ('rating' in a && 'rating' in b) {
          return (b.rating || 0) - (a.rating || 0);
        }
        return b.movie.rating - a.movie.rating;
      case 'year':
        return b.movie.year - a.movie.year;
      case 'priority':
        if ('priority' in a && 'priority' in b) {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
      default:
        return 0;
    }
  });
};

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],
      watchlist: [],
      recentlyViewed: [],
      isLoading: false,
      lastSync: null,
      
      // Favorites actions
      addToFavorites: (movie, rating, review, tags) => {
        const { favorites } = get();
        const existingIndex = favorites.findIndex(fav => fav.movieId === movie.id);
        
        if (existingIndex >= 0) {
          // Update existing favorite
          const updatedFavorites = [...favorites];
          updatedFavorites[existingIndex] = {
            ...updatedFavorites[existingIndex],
            rating,
            review,
            tags
          };
          set({ favorites: updatedFavorites });
        } else {
          // Add new favorite
          const newFavorite: FavoriteItem = {
            ...createMovieListItem(movie),
            rating,
            review,
            tags: tags || [],
            favorite: true
          };
          set({ favorites: [...favorites, newFavorite] });
        }
      },
      
      removeFromFavorites: (movieId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(fav => fav.movieId !== movieId) });
      },
      
      updateFavorite: (movieId, updates) => {
        const { favorites } = get();
        const updatedFavorites = favorites.map(fav => 
          fav.movieId === movieId ? { ...fav, ...updates } : fav
        );
        set({ favorites: updatedFavorites });
      },
      
      isFavorite: (movieId) => {
        const { favorites } = get();
        return favorites.some(fav => fav.movieId === movieId);
      },
      
      getFavorite: (movieId) => {
        const { favorites } = get();
        return favorites.find(fav => fav.movieId === movieId);
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
      
      // Watchlist actions
      addToWatchlist: (movie, priority = 'medium', category) => {
        const { watchlist } = get();
        const existingIndex = watchlist.findIndex(item => item.movieId === movie.id);
        
        if (existingIndex >= 0) {
          // Update existing watchlist item
          const updatedWatchlist = [...watchlist];
          updatedWatchlist[existingIndex] = {
            ...updatedWatchlist[existingIndex],
            priority,
            category
          };
          set({ watchlist: updatedWatchlist });
        } else {
          // Add new watchlist item
          const newWatchlistItem: WatchlistItem = {
            ...createMovieListItem(movie),
            priority,
            wantToWatch: true,
            category
          };
          set({ watchlist: [...watchlist, newWatchlistItem] });
        }
      },
      
      removeFromWatchlist: (movieId) => {
        const { watchlist } = get();
        set({ watchlist: watchlist.filter(item => item.movieId !== movieId) });
      },
      
      updateWatchlistItem: (movieId, updates) => {
        const { watchlist } = get();
        const updatedWatchlist = watchlist.map(item => 
          item.movieId === movieId ? { ...item, ...updates } : item
        );
        set({ watchlist: updatedWatchlist });
      },
      
      isInWatchlist: (movieId) => {
        const { watchlist } = get();
        return watchlist.some(item => item.movieId === movieId);
      },
      
      getWatchlistItem: (movieId) => {
        const { watchlist } = get();
        return watchlist.find(item => item.movieId === movieId);
      },
      
      clearWatchlist: () => {
        set({ watchlist: [] });
      },
      
      // Recently viewed actions
      addToRecentlyViewed: (movie, watchTime = 0, lastPosition = 0) => {
        const { recentlyViewed } = get();
        const existingIndex = recentlyViewed.findIndex(item => item.movieId === movie.id);
        
        if (existingIndex >= 0) {
          // Update existing recently viewed item
          const updatedRecentlyViewed = [...recentlyViewed];
          const existingItem = updatedRecentlyViewed[existingIndex];
          updatedRecentlyViewed[existingIndex] = {
            ...existingItem,
            viewedAt: new Date(),
            viewCount: existingItem.viewCount + 1,
            watchTime: (existingItem.watchTime || 0) + watchTime,
            lastPosition
          };
          set({ recentlyViewed: updatedRecentlyViewed });
        } else {
          // Add new recently viewed item
          const newRecentlyViewed: RecentlyViewedItem = {
            movieId: movie.id,
            movie,
            viewedAt: new Date(),
            viewCount: 1,
            watchTime,
            lastPosition
          };
          
          // Keep only the last 50 items
          const updatedRecentlyViewed = [newRecentlyViewed, ...recentlyViewed].slice(0, 50);
          set({ recentlyViewed: updatedRecentlyViewed });
        }
      },
      
      removeFromRecentlyViewed: (movieId) => {
        const { recentlyViewed } = get();
        set({ recentlyViewed: recentlyViewed.filter(item => item.movieId !== movieId) });
      },
      
      clearRecentlyViewed: () => {
        set({ recentlyViewed: [] });
      },
      
      getRecentlyViewed: (limit = 10) => {
        const { recentlyViewed } = get();
        return recentlyViewed.slice(0, limit);
      },
      
      updateViewProgress: (movieId, watchTime, lastPosition) => {
        const { recentlyViewed } = get();
        const updatedRecentlyViewed = recentlyViewed.map(item => 
          item.movieId === movieId 
            ? { ...item, watchTime, lastPosition, viewedAt: new Date() }
            : item
        );
        set({ recentlyViewed: updatedRecentlyViewed });
      },
      
      // Bulk operations
      addMultipleToFavorites: (movies) => {
        const { favorites } = get();
        const newFavorites = movies.map(movie => ({
          ...createMovieListItem(movie),
          favorite: true as const
        }));
        set({ favorites: [...favorites, ...newFavorites] });
      },
      
      addMultipleToWatchlist: (movies) => {
        const { watchlist } = get();
        const newWatchlistItems = movies.map(movie => ({
          ...createMovieListItem(movie),
          priority: 'medium' as const,
          wantToWatch: true
        }));
        set({ watchlist: [...watchlist, ...newWatchlistItems] });
      },
      
      importFavorites: (favorites) => {
        set({ favorites });
      },
      
      importWatchlist: (watchlist) => {
        set({ watchlist });
      },
      
      // Statistics and analytics
      getStats: () => {
        const { favorites, watchlist, recentlyViewed } = get();
        
        // Genre statistics
        const genreCount = new Map<string, number>();
        [...favorites, ...watchlist].forEach(item => {
          item.movie.genre.forEach(genre => {
            genreCount.set(genre, (genreCount.get(genre) || 0) + 1);
          });
        });
        
        // Director statistics
        const directorCount = new Map<string, number>();
        [...favorites, ...watchlist].forEach(item => {
          directorCount.set(item.movie.director, (directorCount.get(item.movie.director) || 0) + 1);
        });
        
        // Monthly views
        const monthlyViews = new Map<string, number>();
        recentlyViewed.forEach(item => {
          const month = new Date(item.viewedAt).toISOString().slice(0, 7);
          monthlyViews.set(month, (monthlyViews.get(month) || 0) + 1);
        });
        
        // Average rating
        const ratingsSum = favorites.reduce((sum, fav) => sum + (fav.rating || 0), 0);
        const ratingsCount = favorites.filter(fav => fav.rating).length;
        const averageRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;
        
        // Total watch time
        const totalWatchTime = recentlyViewed.reduce((sum, item) => sum + (item.watchTime || 0), 0);
        
        return {
          favoritesCount: favorites.length,
          watchlistCount: watchlist.length,
          recentlyViewedCount: recentlyViewed.length,
          totalWatchTime,
          averageRating,
          topGenres: Array.from(genreCount.entries())
            .map(([genre, count]) => ({ genre, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10),
          topDirectors: Array.from(directorCount.entries())
            .map(([director, count]) => ({ director, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10),
          monthlyViews: Array.from(monthlyViews.entries())
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month))
        };
      },
      
      // Search and filter
      searchFavorites: (query) => {
        const { favorites } = get();
        return filterMoviesByQuery(favorites, query);
      },
      
      searchWatchlist: (query) => {
        const { watchlist } = get();
        return filterMoviesByQuery(watchlist, query);
      },
      
      filterFavoritesByGenre: (genre) => {
        const { favorites } = get();
        return favorites.filter(fav => 
          fav.movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        );
      },
      
      filterWatchlistByPriority: (priority) => {
        const { watchlist } = get();
        return watchlist.filter(item => item.priority === priority);
      },
      
      filterWatchlistByCategory: (category) => {
        const { watchlist } = get();
        return watchlist.filter(item => item.category === category);
      },
      
      // Sorting
      sortFavorites: (sortBy) => {
        const { favorites } = get();
        return sortMoviesByField(favorites, sortBy);
      },
      
      sortWatchlist: (sortBy) => {
        const { watchlist } = get();
        return sortMoviesByField(watchlist, sortBy);
      },
      
      // Utility actions
      toggleFavorite: (movie) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        if (isFavorite(movie.id)) {
          removeFromFavorites(movie.id);
        } else {
          addToFavorites(movie);
        }
      },
      
      toggleWatchlist: (movie) => {
        const { isInWatchlist, addToWatchlist, removeFromWatchlist } = get();
        if (isInWatchlist(movie.id)) {
          removeFromWatchlist(movie.id);
        } else {
          addToWatchlist(movie);
        }
      },
      
      sync: async () => {
        set({ isLoading: true });
        try {
          // Here you would implement sync with backend
          set({ lastSync: new Date() });
        } finally {
          set({ isLoading: false });
        }
      },
      
      clearAll: () => {
        set({ 
          favorites: [], 
          watchlist: [], 
          recentlyViewed: [],
          lastSync: null 
        });
      },
      
      exportData: () => {
        const { favorites, watchlist, recentlyViewed } = get();
        return { favorites, watchlist, recentlyViewed };
      },
      
      importData: (data) => {
        set({
          favorites: data.favorites || [],
          watchlist: data.watchlist || [],
          recentlyViewed: data.recentlyViewed || []
        });
      }
    }),
    {
      name: 'lemonnpie-movie-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        watchlist: state.watchlist,
        recentlyViewed: state.recentlyViewed,
        lastSync: state.lastSync
      })
    }
  )
);

// Utility hooks for individual features
export const useFavorites = () => {
  const favorites = useMovieStore((state) => state.favorites);
  const addToFavorites = useMovieStore((state) => state.addToFavorites);
  const removeFromFavorites = useMovieStore((state) => state.removeFromFavorites);
  const isFavorite = useMovieStore((state) => state.isFavorite);
  const toggleFavorite = useMovieStore((state) => state.toggleFavorite);
  const clearFavorites = useMovieStore((state) => state.clearFavorites);
  const searchFavorites = useMovieStore((state) => state.searchFavorites);
  const sortFavorites = useMovieStore((state) => state.sortFavorites);
  
  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    searchFavorites,
    sortFavorites
  };
};

export const useWatchlist = () => {
  const watchlist = useMovieStore((state) => state.watchlist);
  const addToWatchlist = useMovieStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useMovieStore((state) => state.removeFromWatchlist);
  const isInWatchlist = useMovieStore((state) => state.isInWatchlist);
  const toggleWatchlist = useMovieStore((state) => state.toggleWatchlist);
  const clearWatchlist = useMovieStore((state) => state.clearWatchlist);
  const searchWatchlist = useMovieStore((state) => state.searchWatchlist);
  const sortWatchlist = useMovieStore((state) => state.sortWatchlist);
  
  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    searchWatchlist,
    sortWatchlist
  };
};

export const useRecentlyViewed = () => {
  const recentlyViewed = useMovieStore((state) => state.recentlyViewed);
  const addToRecentlyViewed = useMovieStore((state) => state.addToRecentlyViewed);
  const removeFromRecentlyViewed = useMovieStore((state) => state.removeFromRecentlyViewed);
  const clearRecentlyViewed = useMovieStore((state) => state.clearRecentlyViewed);
  const getRecentlyViewed = useMovieStore((state) => state.getRecentlyViewed);
  const updateViewProgress = useMovieStore((state) => state.updateViewProgress);
  
  return {
    recentlyViewed,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
    getRecentlyViewed,
    updateViewProgress
  };
}; 