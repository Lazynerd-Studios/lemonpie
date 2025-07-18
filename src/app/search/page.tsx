"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Grid, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedMovieCard } from "@/components/movie/enhanced-movie-card";
import { EnhancedSkeleton } from "@/components/ui/enhanced-skeleton";
import { FilterPanel } from "@/components/search/filter-panel";
import { SortDropdown } from "@/components/search/sort-dropdown";
import { Pagination, usePagination } from "@/components/search/pagination";
import { SearchNoResults } from "@/components/search/no-results-state";
import { SearchHistoryUI } from "@/components/search/search-history-ui";
import { useSearch } from "@/lib/hooks/useSearch";
import { useFilters } from "@/lib/hooks/useFilters";

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
  
  const {
    query,
    movies: searchResults,
    isLoading,
    isError,
    error,
    isDebouncing,
    hasSearched,
    searchHistory,
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
    activeFiltersCount,
    clearFilters,
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
  const allResults = React.useMemo(() => {
    if (!hasSearched) return [];
    
    const results = searchResults.length > 0 ? searchResults : movies;
    return applyFilters(results);
  }, [searchResults, applyFilters, hasSearched]);

  // Pagination logic
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    handlePageChange,
    handleItemsPerPageChange,
    paginateItems
  } = usePagination({
    totalItems: allResults.length,
    itemsPerPage: 20,
    currentPage: 1
  });

  // Get current page results
  const finalResults = React.useMemo(() => {
    return paginateItems(allResults);
  }, [allResults, paginateItems]);

  const handleClearAll = () => {
    clearSearch();
    clearFilters();
    handlePageChange(1); // Reset to first page
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Transform search history for the SearchHistoryUI component
  const searchHistoryItems = React.useMemo(() => {
    return searchHistory.map((historyQuery, index) => ({
      id: `history-${index}`,
      query: historyQuery,
      timestamp: Date.now() - (index * 60 * 60 * 1000), // Mock timestamps
      frequency: Math.max(1, Math.floor(Math.random() * 5)), // Mock frequency
      isFavorite: false,
      resultCount: Math.floor(Math.random() * 100) + 1 // Mock result count
    }));
  }, [searchHistory]);

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
                      for &quot;{query}&quot;
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
                  {allResults.length} {allResults.length === 1 ? 'result' : 'results'}
                  {allResults.length > 0 && totalPages > 1 && (
                    <span className={styles.pageInfo}>
                      • Page {currentPage} of {totalPages}
                    </span>
                  )}
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
            {!isLoading && !isError && hasSearched && allResults.length === 0 && (
              <SearchNoResults
                query={query}
                filterCount={activeFiltersCount}
                onClearSearch={clearSearch}
                onClearFilters={clearFilters}
                onClearAll={handleClearAll}
                suggestions={suggestions.slice(0, 5)}
                onSuggestionClick={setQuery}
                className={styles.noResultsContainer}
              />
            )}

            {/* Search Results */}
            {!isLoading && !isError && allResults.length > 0 && (
              <>
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={allResults.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    showItemsPerPage={true}
                    showPageInfo={true}
                    showFirstLast={true}
                    variant="default"
                    className={styles.pagination}
                  />
                )}
              </>
            )}

            {/* Search History */}
            {!hasSearched && searchHistoryItems.length > 0 && (
              <SearchHistoryUI
                items={searchHistoryItems}
                variant="compact"
                groupBy="date"
                maxItems={10}
                showActions={true}
                showFilters={false}
                showTimestamp={true}
                showFrequency={true}
                onItemClick={(item) => setQuery(item.query)}
                onItemRemove={(item) => removeFromHistory(item.query)}
                onClearAll={clearHistory}
                className={styles.searchHistoryContainer}
                title="Recent Searches"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 