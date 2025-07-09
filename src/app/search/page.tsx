"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, SlidersHorizontal, Grid, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedMovieCard } from "@/components/movie/enhanced-movie-card";
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import { FilterPanel } from "@/components/search/filter-panel";
import { SortDropdown } from "@/components/search/sort-dropdown";
import { useSearch } from "@/lib/hooks/useSearch";
import { useFilters } from "@/lib/hooks/useFilters";
import { useSearchState, useFilterState } from "@/lib/stores/searchFilterStore";
import { movieData } from "@/data/movies";
import { cn } from "@/lib/utils";
import styles from "./search.module.css";

// Convert movieData object to array
const movies = Object.values(movieData);

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = React.useState(false);
  
  const { search: searchState } = useSearchState();
  const { filters: filterState } = useFilterState();
  
  const {
    query,
    movies: searchResults,
    isLoading,
    isError,
    error,
    isEmpty,
    isDebouncing,
    hasSearched,
    searchHistory,
    resultCount,
    setQuery,
    clearSearch,
    suggestions
  } = useSearch({
    enabled: true,
    debounceMs: 300,
    minQueryLength: 2,
    saveToHistory: true,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const {
    filters,
    filteredMovies,
    activeFiltersCount,
    hasActiveFilters,
    clearFilters,
    resetFilters,
    applyFilters,
    setSortBy,
    setSortOrder
  } = useFilters(movies, {
    saveToStorage: true,
    storageKey: 'search-filters'
  });

  // Set initial query from URL params
  React.useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery, query, setQuery]);

  // Apply filters to search results
  const finalResults = React.useMemo(() => {
    if (!hasSearched) return [];
    
    const results = searchResults.length > 0 ? searchResults : movies;
    return applyFilters(results);
  }, [searchResults, movies, applyFilters, hasSearched]);

  const handleClearAll = () => {
    clearSearch();
    clearFilters();
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchContainer}>
        {/* Search Header */}
        <div className={styles.searchHeader}>
          <div className={styles.searchInfo}>
            <div className={styles.searchTitle}>
              {hasSearched ? (
                <>
                  Search Results
                  {query && (
                    <span className={styles.searchQuery}>
                      for "{query}"
                    </span>
                  )}
                </>
              ) : (
                "Search Movies"
              )}
            </div>
            <div className={styles.searchMeta}>
              {isLoading || isDebouncing ? (
                <span className={styles.loadingText}>Searching...</span>
              ) : hasSearched ? (
                <span className={styles.resultCount}>
                  {finalResults.length} {finalResults.length === 1 ? 'result' : 'results'}
                  {activeFiltersCount > 0 && (
                    <span className={styles.filterCount}>
                      • {activeFiltersCount} filter{activeFiltersCount === 1 ? '' : 's'} applied
                    </span>
                  )}
                </span>
              ) : (
                <span className={styles.helpText}>
                  Search for movies, actors, directors, or genres
                </span>
              )}
            </div>
          </div>

          {/* Search Controls */}
          <div className={styles.searchControls}>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilters}
              className={cn(
                styles.filterButton,
                showFilters && styles.filterButtonActive
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className={styles.filterBadge}>
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            <SortDropdown
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortChange={(sortBy, sortOrder) => {
                setSortBy(sortBy);
                setSortOrder(sortOrder);
              }}
              variant="compact"
              className={styles.sortDropdown}
            />

            <div className={styles.viewModeToggle}>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {(hasSearched || hasActiveFilters) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className={styles.clearButton}
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Search Content */}
        <div className={styles.searchContent}>
          {/* Filter Panel */}
          {showFilters && (
            <FilterPanel
              movies={movies}
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              onFiltersChange={(newFilters) => {
                // The useFilters hook will handle the filter changes
                console.log("Filters changed:", newFilters);
              }}
              className={styles.filterPanelContainer}
            />
          )}

          {/* Results Area */}
          <div className={styles.resultsArea}>
            {/* Loading State */}
            {(isLoading || isDebouncing) && (
              <div className={styles.loadingGrid}>
                {Array.from({ length: 8 }, (_, i) => (
                  <EnhancedSkeleton
                    key={i}
                    variant="movie-card"
                    className={styles.loadingSkeleton}
                  />
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && error && (
              <div className={styles.errorState}>
                <div className={styles.errorIcon}>
                  <Search className="h-12 w-12" />
                </div>
                <h3 className={styles.errorTitle}>Search Error</h3>
                <p className={styles.errorMessage}>
                  {error.message || "Something went wrong while searching. Please try again."}
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className={styles.errorButton}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* No Results State */}
            {!isLoading && !isError && hasSearched && finalResults.length === 0 && (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>
                  <Search className="h-12 w-12" />
                </div>
                <h3 className={styles.noResultsTitle}>No Results Found</h3>
                <p className={styles.noResultsMessage}>
                  {query ? (
                    <>
                      We couldn't find any movies matching <strong>"{query}"</strong>
                      {activeFiltersCount > 0 && " with the current filters"}
                    </>
                  ) : (
                    "No movies match your current filters"
                  )}
                </p>
                <div className={styles.noResultsActions}>
                  {query && (
                    <Button
                      variant="outline"
                      onClick={clearSearch}
                      className={styles.noResultsButton}
                    >
                      Clear Search
                    </Button>
                  )}
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className={styles.noResultsButton}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && !isError && finalResults.length > 0 && (
              <div className={cn(
                styles.resultsGrid,
                viewMode === "list" && styles.resultsGridList
              )}>
                {finalResults.map((movie) => (
                  <EnhancedMovieCard
                    key={movie.id}
                    movie={movie}
                    variant={viewMode === "list" ? "horizontal" : "vertical"}
                    showActions={true}
                    className={styles.movieCard}
                  />
                ))}
              </div>
            )}

            {/* Search History */}
            {!hasSearched && searchHistory.length > 0 && (
              <div className={styles.searchHistory}>
                <h3 className={styles.searchHistoryTitle}>Recent Searches</h3>
                <div className={styles.searchHistoryList}>
                  {searchHistory.slice(0, 5).map((historyQuery) => (
                    <button
                      key={historyQuery}
                      className={styles.searchHistoryItem}
                      onClick={() => setQuery(historyQuery)}
                    >
                      <Search className="h-4 w-4" />
                      {historyQuery}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 