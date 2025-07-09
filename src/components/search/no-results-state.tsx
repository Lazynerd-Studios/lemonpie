"use client";

import * as React from "react";
import { 
  Search, 
  Filter, 
  FileX, 
  RefreshCw, 
  ArrowLeft,
  Settings,
  Film
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./no-results-state.module.css";

interface NoResultsAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "destructive" | "secondary";
  icon?: React.ReactNode;
}

interface NoResultsStateProps {
  className?: string;
  variant?: "search" | "filter" | "empty" | "error" | "custom";
  title?: string;
  message?: string;
  query?: string;
  filterCount?: number;
  actions?: NoResultsAction[];
  showIcon?: boolean;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

const defaultIcons = {
  search: <Search className="h-12 w-12" />,
  filter: <Filter className="h-12 w-12" />,
  empty: <FileX className="h-12 w-12" />,
  error: <RefreshCw className="h-12 w-12" />,
  custom: <Film className="h-12 w-12" />
};

const defaultTitles = {
  search: "No Results Found",
  filter: "No Matches Found",
  empty: "No Items Available",
  error: "Something Went Wrong",
  custom: "No Results"
};

export function NoResultsState({
  className,
  variant = "search",
  title,
  message,
  query,
  filterCount = 0,
  actions = [],
  showIcon = true,
  icon,
  size = "md",
  animated = true,
  suggestions = [],
  onSuggestionClick
}: NoResultsStateProps) {
  const displayIcon = icon || defaultIcons[variant];
  const displayTitle = title || defaultTitles[variant];
  
  const getDefaultMessage = () => {
    switch (variant) {
      case "search":
        if (query && filterCount > 0) {
          return (
            <>
              We couldn't find any movies matching <strong>"{query}"</strong>
              {" "}with the current filters
            </>
          );
        } else if (query) {
          return (
            <>
              We couldn't find any movies matching <strong>"{query}"</strong>
            </>
          );
        } else if (filterCount > 0) {
          return "No movies match your current filters";
        } else {
          return "No movies found";
        }
      case "filter":
        return `No movies match your current ${filterCount === 1 ? 'filter' : 'filters'}`;
      case "empty":
        return "There are no items to display";
      case "error":
        return "Something went wrong while loading. Please try again.";
      default:
        return "No results to display";
    }
  };

  const displayMessage = message || getDefaultMessage();

  return (
    <div 
      className={cn(
        styles.noResultsState,
        styles[variant],
        styles[size],
        animated && styles.animated,
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      {showIcon && displayIcon && (
        <div className={styles.icon}>
          {displayIcon}
        </div>
      )}

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.title}>{displayTitle}</h3>
        <p className={styles.message}>{displayMessage}</p>

        {/* Search Context */}
        {variant === "search" && (query || filterCount > 0) && (
          <div className={styles.searchContext}>
            {query && (
              <div className={styles.searchQuery}>
                <Search className="h-4 w-4" />
                <span>Search: "{query}"</span>
              </div>
            )}
            {filterCount > 0 && (
              <div className={styles.filterInfo}>
                <Filter className="h-4 w-4" />
                <span>
                  {filterCount} {filterCount === 1 ? 'filter' : 'filters'} applied
                </span>
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && onSuggestionClick && (
          <div className={styles.suggestions}>
            <p className={styles.suggestionsTitle}>Try searching for:</p>
            <div className={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                onClick={action.onClick}
                className={styles.actionButton}
              >
                {action.icon && <span className={styles.actionIcon}>{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Pre-configured variants for common use cases
export function SearchNoResults({
  query,
  filterCount = 0,
  onClearSearch,
  onClearFilters,
  onClearAll,
  suggestions = [],
  onSuggestionClick,
  className
}: {
  query?: string;
  filterCount?: number;
  onClearSearch?: () => void;
  onClearFilters?: () => void;
  onClearAll?: () => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}) {
  const actions: NoResultsAction[] = [];

  if (onClearAll && (query || filterCount > 0)) {
    actions.push({
      label: "Clear All",
      onClick: onClearAll,
      variant: "default",
      icon: <RefreshCw className="h-4 w-4" />
    });
  } else {
    if (query && onClearSearch) {
      actions.push({
        label: "Clear Search",
        onClick: onClearSearch,
        variant: "outline",
        icon: <Search className="h-4 w-4" />
      });
    }
    if (filterCount > 0 && onClearFilters) {
      actions.push({
        label: "Clear Filters",
        onClick: onClearFilters,
        variant: "outline",
        icon: <Filter className="h-4 w-4" />
      });
    }
  }

  return (
    <NoResultsState
      variant="search"
      query={query}
      filterCount={filterCount}
      actions={actions}
      suggestions={suggestions}
      onSuggestionClick={onSuggestionClick}
      className={className}
    />
  );
}

// Empty state for when no data is available
export function EmptyMovieState({
  title = "No Movies Available",
  message = "There are no movies to display at the moment",
  onRefresh,
  className
}: {
  title?: string;
  message?: string;
  onRefresh?: () => void;
  className?: string;
}) {
  const actions: NoResultsAction[] = [];

  if (onRefresh) {
    actions.push({
      label: "Refresh",
      onClick: onRefresh,
      variant: "outline",
      icon: <RefreshCw className="h-4 w-4" />
    });
  }

  return (
    <NoResultsState
      variant="empty"
      title={title}
      message={message}
      actions={actions}
      icon={<Film className="h-12 w-12" />}
      className={className}
    />
  );
}

// Error state variant
export function ErrorState({
  title = "Something Went Wrong",
  message = "We encountered an error while loading. Please try again.",
  onRetry,
  onGoBack,
  className
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}) {
  const actions: NoResultsAction[] = [];

  if (onRetry) {
    actions.push({
      label: "Try Again",
      onClick: onRetry,
      variant: "default",
      icon: <RefreshCw className="h-4 w-4" />
    });
  }

  if (onGoBack) {
    actions.push({
      label: "Go Back",
      onClick: onGoBack,
      variant: "outline",
      icon: <ArrowLeft className="h-4 w-4" />
    });
  }

  return (
    <NoResultsState
      variant="error"
      title={title}
      message={message}
      actions={actions}
      className={className}
    />
  );
} 