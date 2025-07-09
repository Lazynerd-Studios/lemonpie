"use client";

import * as React from "react";
import { 
  Search, 
  Clock, 
  X, 
  Trash2, 
  Star, 
  TrendingUp, 
  Calendar,
  MoreHorizontal,
  History,
  Filter,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import styles from "./search-history-ui.module.css";

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  frequency?: number;
  isFavorite?: boolean;
  filters?: {
    genres?: string[];
    year?: number;
    rating?: number;
  };
  resultCount?: number;
}

interface SearchHistoryUIProps {
  className?: string;
  items: SearchHistoryItem[];
  variant?: "default" | "compact" | "detailed";
  groupBy?: "date" | "frequency" | "none";
  maxItems?: number;
  showActions?: boolean;
  showFilters?: boolean;
  showTimestamp?: boolean;
  showFrequency?: boolean;
  showFavorites?: boolean;
  onItemClick?: (item: SearchHistoryItem) => void;
  onItemRemove?: (item: SearchHistoryItem) => void;
  onItemFavorite?: (item: SearchHistoryItem) => void;
  onClearAll?: () => void;
  onClearOld?: () => void;
  emptyMessage?: string;
  title?: string;
  showTitle?: boolean;
}

interface SearchHistoryItemProps {
  item: SearchHistoryItem;
  variant?: "default" | "compact" | "detailed";
  showActions?: boolean;
  showFilters?: boolean;
  showTimestamp?: boolean;
  showFrequency?: boolean;
  onClick?: (item: SearchHistoryItem) => void;
  onRemove?: (item: SearchHistoryItem) => void;
  onFavorite?: (item: SearchHistoryItem) => void;
}

// Helper function to group items by date
function groupItemsByDate(items: SearchHistoryItem[]): Record<string, SearchHistoryItem[]> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const groups: Record<string, SearchHistoryItem[]> = {
    "Today": [],
    "Yesterday": [],
    "This Week": [],
    "This Month": [],
    "Older": []
  };

  items.forEach(item => {
    const itemDate = new Date(item.timestamp);
    
    if (itemDate >= today) {
      groups["Today"].push(item);
    } else if (itemDate >= yesterday) {
      groups["Yesterday"].push(item);
    } else if (itemDate >= thisWeek) {
      groups["This Week"].push(item);
    } else if (itemDate >= thisMonth) {
      groups["This Month"].push(item);
    } else {
      groups["Older"].push(item);
    }
  });

  // Remove empty groups
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
}

// Helper function to format relative time
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}

// Individual search history item component
export function SearchHistoryItemComponent({
  item,
  variant = "default",
  showActions = true,
  showFilters = true,
  showTimestamp = true,
  showFrequency = true,
  onClick,
  onRemove,
  onFavorite
}: SearchHistoryItemProps) {
  const handleClick = () => {
    if (onClick) onClick(item);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) onRemove(item);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) onFavorite(item);
  };

  const hasFilters = item.filters && (
    (item.filters.genres && item.filters.genres.length > 0) ||
    item.filters.year ||
    item.filters.rating
  );

  return (
    <div
      className={cn(
        styles.historyItem,
        styles[variant],
        item.isFavorite && styles.historyItemFavorite,
        onClick && styles.historyItemClickable
      )}
      onClick={handleClick}
    >
      <div className={styles.historyItemContent}>
        {/* Icon */}
        <div className={styles.historyItemIcon}>
          {item.isFavorite ? (
            <Star className="h-4 w-4 fill-current" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
        </div>

        {/* Main content */}
        <div className={styles.historyItemMain}>
          <div className={styles.historyItemQuery}>
            <span className={styles.queryText}>{item.query}</span>
            {showFrequency && item.frequency && item.frequency > 1 && (
              <Badge variant="secondary" className={styles.frequencyBadge}>
                {item.frequency}
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className={styles.historyItemMeta}>
            {showTimestamp && (
              <span className={styles.timestamp}>
                {formatRelativeTime(item.timestamp)}
              </span>
            )}
            
            {item.resultCount !== undefined && (
              <span className={styles.resultCount}>
                {item.resultCount} result{item.resultCount === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {/* Filters */}
          {showFilters && hasFilters && (
            <div className={styles.historyItemFilters}>
              {item.filters?.genres && item.filters.genres.length > 0 && (
                <div className={styles.filterGroup}>
                  <span className={styles.filterLabel}>Genres:</span>
                  <div className={styles.filterTags}>
                    {item.filters.genres.slice(0, 2).map((genre, index) => (
                      <Badge key={index} variant="outline" className={styles.filterTag}>
                        {genre}
                      </Badge>
                    ))}
                    {item.filters.genres.length > 2 && (
                      <Badge variant="outline" className={styles.filterTag}>
                        +{item.filters.genres.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {item.filters?.year && (
                <div className={styles.filterGroup}>
                  <span className={styles.filterLabel}>Year:</span>
                  <Badge variant="outline" className={styles.filterTag}>
                    {item.filters.year}
                  </Badge>
                </div>
              )}
              
              {item.filters?.rating && (
                <div className={styles.filterGroup}>
                  <span className={styles.filterLabel}>Rating:</span>
                  <Badge variant="outline" className={styles.filterTag}>
                    {item.filters.rating}+ ⭐
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className={styles.historyItemActions}>
          {onFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              className={cn(
                styles.actionButton,
                styles.favoriteButton,
                item.isFavorite && styles.favoriteButtonActive
              )}
              title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className="h-4 w-4" />
            </Button>
          )}
          
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className={cn(styles.actionButton, styles.removeButton)}
              title="Remove from history"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Main search history UI component
export function SearchHistoryUI({
  className,
  items,
  variant = "default",
  groupBy = "date",
  maxItems = 50,
  showActions = true,
  showFilters = true,
  showTimestamp = true,
  showFrequency = true,
  showFavorites = true,
  onItemClick,
  onItemRemove,
  onItemFavorite,
  onClearAll,
  onClearOld,
  emptyMessage = "No search history yet",
  title = "Search History",
  showTitle = true
}: SearchHistoryUIProps) {
  const [showAll, setShowAll] = React.useState(false);
  
  // Filter and sort items
  const processedItems = React.useMemo(() => {
    let filteredItems = [...items];
    
    // Filter favorites if needed
    if (showFavorites) {
      filteredItems = filteredItems.filter(item => item.isFavorite);
    }
    
    // Sort by timestamp (most recent first)
    filteredItems.sort((a, b) => b.timestamp - a.timestamp);
    
    // Limit items if not showing all
    if (!showAll && maxItems) {
      filteredItems = filteredItems.slice(0, maxItems);
    }
    
    return filteredItems;
  }, [items, showFavorites, showAll, maxItems]);

  // Group items if needed
  const groupedItems = React.useMemo(() => {
    if (groupBy === "date") {
      return groupItemsByDate(processedItems);
    } else if (groupBy === "frequency") {
      const frequent = processedItems.filter(item => (item.frequency || 1) > 1);
      const regular = processedItems.filter(item => (item.frequency || 1) === 1);
      return frequent.length > 0 ? { "Frequent": frequent, "Recent": regular } : { "Recent": regular };
    } else {
      return { "All": processedItems };
    }
  }, [processedItems, groupBy]);

  const hasMoreItems = items.length > maxItems;
  const totalItems = items.length;
  const favoriteItems = items.filter(item => item.isFavorite).length;

  if (totalItems === 0) {
    return (
      <div className={cn(styles.searchHistory, styles.empty, className)}>
        <div className={styles.emptyState}>
          <History className="h-12 w-12" />
          <p className={styles.emptyMessage}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(styles.searchHistory, styles[variant], className)}>
      {/* Header */}
      {showTitle && (
        <div className={styles.historyHeader}>
          <div className={styles.historyTitle}>
            <History className="h-5 w-5" />
            <span>{title}</span>
            <Badge variant="secondary" className={styles.countBadge}>
              {totalItems}
            </Badge>
          </div>
          
          {showActions && (
            <div className={styles.historyActions}>
              {favoriteItems > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className={styles.toggleButton}
                >
                  {showFavorites ? "Show All" : "Show Favorites"}
                </Button>
              )}
              
              {onClearOld && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearOld}
                  className={styles.clearOldButton}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Old
                </Button>
              )}
              
              {onClearAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className={styles.clearAllButton}
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={styles.historyContent}>
        {Object.entries(groupedItems).map(([groupName, groupItems]) => (
          <div key={groupName} className={styles.historyGroup}>
            {groupBy !== "none" && (
              <div className={styles.groupHeader}>
                <span className={styles.groupTitle}>{groupName}</span>
                <Badge variant="outline" className={styles.groupCount}>
                  {groupItems.length}
                </Badge>
              </div>
            )}
            
            <div className={styles.historyList}>
              {groupItems.map((item) => (
                <SearchHistoryItemComponent
                  key={item.id}
                  item={item}
                  variant={variant}
                  showActions={showActions}
                  showFilters={showFilters}
                  showTimestamp={showTimestamp}
                  showFrequency={showFrequency}
                  onClick={onItemClick}
                  onRemove={onItemRemove}
                  onFavorite={onItemFavorite}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {hasMoreItems && !showAll && (
        <div className={styles.historyFooter}>
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className={styles.showMoreButton}
          >
            Show {totalItems - maxItems} more items
          </Button>
        </div>
      )}
    </div>
  );
}

// Compact version for dropdowns
export function SearchHistoryDropdown({
  items,
  maxItems = 5,
  onItemClick,
  onItemRemove,
  onClearAll,
  className
}: {
  items: SearchHistoryItem[];
  maxItems?: number;
  onItemClick?: (item: SearchHistoryItem) => void;
  onItemRemove?: (item: SearchHistoryItem) => void;
  onClearAll?: () => void;
  className?: string;
}) {
  const recentItems = items.slice(0, maxItems);
  
  if (recentItems.length === 0) {
    return null;
  }

  return (
    <div className={cn(styles.historyDropdown, className)}>
      <div className={styles.dropdownHeader}>
        <span className={styles.dropdownTitle}>Recent Searches</span>
        {onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className={styles.clearButton}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className={styles.dropdownList}>
        {recentItems.map((item) => (
          <SearchHistoryItemComponent
            key={item.id}
            item={item}
            variant="compact"
            showActions={false}
            showFilters={false}
            showTimestamp={false}
            showFrequency={false}
            onClick={onItemClick}
            onRemove={onItemRemove}
          />
        ))}
      </div>
    </div>
  );
} 