"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  TrendingUp, 
  Film, 
  User, 
  Star,
  ChevronDown,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSearch, useSearchSuggestions } from "@/lib/hooks/useSearch";
import { useSearchState } from "@/lib/stores/searchFilterStore";
// import { useClickOutside } from "@/lib/hooks/useClickOutside";
import styles from "./enhanced-search-bar.module.css";

interface EnhancedSearchBarProps {
  className?: string;
  variant?: "default" | "compact" | "expanded";
  placeholder?: string;
  showHistory?: boolean;
  showSuggestions?: boolean;
  showFilters?: boolean;
  maxSuggestions?: number;
  onSearchSubmit?: (query: string) => void;
  onFilterToggle?: () => void;
  autoFocus?: boolean;
}

export function EnhancedSearchBar({
  className,
  variant = "default",
  placeholder = "Search movies, actors, reviews...",
  showHistory = true,
  showSuggestions = true,
  showFilters = true,
  maxSuggestions = 8,
  onSearchSubmit,
  onFilterToggle,
  autoFocus = false
}: EnhancedSearchBarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const { search: searchState } = useSearchState();
  
  const {
    query,
    setQuery,
    searchHistory,
    isLoading,
    isDebouncing,
    clearHistory,
    removeFromHistory
  } = useSearch({
    enabled: true,
    debounceMs: 300,
    minQueryLength: 1,
    saveToHistory: true
  });

  const { suggestions, isLoading: suggestionsLoading } = useSearchSuggestions(query);

  // Close dropdown when clicking outside
  useClickOutside(searchRef, () => {
    setIsOpen(false);
    setActiveIndex(-1);
  });

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setActiveIndex(-1);
    setIsOpen(true);
  };

  // Handle search submission
  const handleSubmit = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      setIsOpen(false);
      setActiveIndex(-1);
      
      if (onSearchSubmit) {
        onSearchSubmit(finalQuery);
      } else {
        router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
      }
    }
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  // Get all suggestions (history + search suggestions)
  const allSuggestions = React.useMemo(() => {
    const items = [];
    
    // Add recent searches
    if (showHistory && searchHistory.length > 0) {
      items.push({
        type: 'section',
        title: 'Recent Searches',
        items: searchHistory.slice(0, 3).map(item => ({
          type: 'history',
          text: item,
          icon: Clock
        }))
      });
    }
    
    // Add search suggestions
    if (showSuggestions && suggestions.length > 0) {
      items.push({
        type: 'section',
        title: 'Suggestions',
        items: suggestions.slice(0, maxSuggestions).map(item => ({
          type: 'suggestion',
          text: item,
          icon: Search
        }))
      });
    }
    
    return items;
  }, [searchHistory, suggestions, showHistory, showSuggestions, maxSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    const totalItems = allSuggestions.reduce((acc, section) => acc + section.items.length, 0);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          let currentIndex = 0;
          for (const section of allSuggestions) {
            if (activeIndex < currentIndex + section.items.length) {
              const item = section.items[activeIndex - currentIndex];
              handleSubmit(item.text);
              return;
            }
            currentIndex += section.items.length;
          }
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    handleSubmit(text);
  };

  // Handle history item removal
  const handleHistoryRemove = (e: React.MouseEvent, historyItem: string) => {
    e.stopPropagation();
    removeFromHistory(historyItem);
  };

  // Auto focus
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Render suggestion item
  const renderSuggestionItem = (item: any, index: number, isActive: boolean) => {
    const Icon = item.icon;
    
    return (
      <div
        key={`${item.type}-${index}`}
        className={cn(
          styles.suggestionItem,
          isActive && styles.suggestionItemActive,
          styles[`suggestionItem${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`]
        )}
        onClick={() => handleSuggestionClick(item.text)}
      >
        <Icon className={styles.suggestionIcon} />
        <span className={styles.suggestionText}>{item.text}</span>
        {item.type === 'history' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => handleHistoryRemove(e, item.text)}
            className={styles.historyRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={searchRef}
      className={cn(
        styles.searchBar,
        styles[variant],
        isOpen && styles.searchBarOpen,
        className
      )}
    >
      <form onSubmit={handleFormSubmit} className={styles.searchForm}>
        <div className={styles.searchInput}>
          <Search className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className={styles.searchField}
          />
          
          {/* Loading indicator */}
          {(isLoading || isDebouncing) && (
            <div className={styles.loadingIndicator}>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          
          {/* Clear button */}
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setQuery("")}
              className={styles.clearButton}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {/* Filter button */}
          {showFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onFilterToggle}
              className={styles.filterButton}
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Search shortcut */}
        <kbd className={styles.searchShortcut}>⌘K</kbd>
      </form>
      
      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className={styles.suggestionsDropdown}>
          {allSuggestions.length > 0 ? (
            <div className={styles.suggestionsList}>
              {allSuggestions.map((section, sectionIndex) => {
                let itemIndex = 0;
                for (let i = 0; i < sectionIndex; i++) {
                  itemIndex += allSuggestions[i].items.length;
                }
                
                return (
                  <div key={section.title} className={styles.suggestionSection}>
                    <div className={styles.suggestionSectionTitle}>
                      {section.title}
                    </div>
                    {section.items.map((item, index) => 
                      renderSuggestionItem(item, itemIndex + index, activeIndex === itemIndex + index)
                    )}
                  </div>
                );
              })}
            </div>
          ) : query ? (
            <div className={styles.noSuggestions}>
              <div className={styles.noSuggestionsText}>
                No suggestions found for "{query}"
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSubmit()}
                className={styles.searchAnywayButton}
              >
                <Search className="h-4 w-4" />
                Search anyway
              </Button>
            </div>
          ) : (
            <div className={styles.emptySuggestions}>
              <div className={styles.emptySuggestionsText}>
                Start typing to search movies, actors, or reviews
              </div>
              {showHistory && searchHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className={styles.clearHistoryButton}
                >
                  <X className="h-4 w-4" />
                  Clear search history
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Custom hook for click outside
function useClickOutside(ref: React.RefObject<HTMLElement>, callback: () => void) {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
} 