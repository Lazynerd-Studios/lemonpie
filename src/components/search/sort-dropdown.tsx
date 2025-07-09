"use client";

import * as React from "react";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Star, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlphabeticalSortAsc,
  AlphabeticalSortDesc,
  DollarSign,
  Check,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FilterOptions } from "@/lib/hooks/useFilters";
import styles from "./sort-dropdown.module.css";

interface SortOption {
  value: FilterOptions['sortBy'];
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface SortDropdownProps {
  className?: string;
  sortBy: FilterOptions['sortBy'];
  sortOrder: FilterOptions['sortOrder'];
  onSortChange: (sortBy: FilterOptions['sortBy'], sortOrder: FilterOptions['sortOrder']) => void;
  disabled?: boolean;
  showLabel?: boolean;
  variant?: "default" | "compact" | "minimal";
}

const sortOptions: SortOption[] = [
  {
    value: 'relevance',
    label: 'Relevance',
    icon: TrendingUp,
    description: 'Most relevant results first'
  },
  {
    value: 'rating',
    label: 'Rating',
    icon: Star,
    description: 'Highest rated movies first'
  },
  {
    value: 'year',
    label: 'Release Year',
    icon: Calendar,
    description: 'Newest movies first'
  },
  {
    value: 'title',
    label: 'Title',
    icon: AlphabeticalSortAsc,
    description: 'Alphabetical order'
  },
  {
    value: 'popularity',
    label: 'Popularity',
    icon: TrendingUp,
    description: 'Most popular movies first'
  },
  {
    value: 'duration',
    label: 'Duration',
    icon: Clock,
    description: 'Longest movies first'
  },
  {
    value: 'releaseDate',
    label: 'Release Date',
    icon: Calendar,
    description: 'Recently released first'
  }
];

export function SortDropdown({
  className,
  sortBy,
  sortOrder,
  onSortChange,
  disabled = false,
  showLabel = true,
  variant = "default"
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const currentOption = sortOptions.find(option => option.value === sortBy);
  const CurrentIcon = currentOption?.icon || ArrowUpDown;
  
  const handleSortChange = (newSortBy: FilterOptions['sortBy']) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same option is selected
      onSortChange(newSortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Use default order for new sort option
      const defaultOrder = newSortBy === 'title' ? 'asc' : 'desc';
      onSortChange(newSortBy, defaultOrder);
    }
  };

  const getSortOrderIcon = (optionValue: FilterOptions['sortBy']) => {
    if (optionValue !== sortBy) return null;
    
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  const getSortDescription = () => {
    if (!currentOption) return "Sort results";
    
    const orderText = sortOrder === 'asc' ? 'ascending' : 'descending';
    return `${currentOption.label} (${orderText})`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            styles.sortButton,
            styles[variant],
            disabled && styles.sortButtonDisabled,
            className
          )}
          disabled={disabled}
        >
          <CurrentIcon className={styles.sortIcon} />
          {showLabel && variant !== "minimal" && (
            <span className={styles.sortLabel}>
              {variant === "compact" ? "Sort" : currentOption?.label || "Sort"}
            </span>
          )}
          {getSortOrderIcon(sortBy)}
          <ChevronDown className={cn(
            styles.sortChevron,
            isOpen && styles.sortChevronOpen
          )} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className={styles.sortMenu}
        sideOffset={5}
      >
        <div className={styles.sortMenuHeader}>
          <div className={styles.sortMenuTitle}>Sort by</div>
          <div className={styles.sortMenuDescription}>
            {getSortDescription()}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = option.value === sortBy;
          
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={cn(
                styles.sortMenuItem,
                isSelected && styles.sortMenuItemSelected
              )}
            >
              <div className={styles.sortMenuItemContent}>
                <div className={styles.sortMenuItemLeft}>
                  <Icon className={styles.sortMenuItemIcon} />
                  <div className={styles.sortMenuItemText}>
                    <div className={styles.sortMenuItemLabel}>
                      {option.label}
                    </div>
                    {option.description && (
                      <div className={styles.sortMenuItemDescription}>
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.sortMenuItemRight}>
                  {isSelected && (
                    <Check className={styles.sortMenuItemCheck} />
                  )}
                  {getSortOrderIcon(option.value)}
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        
        <div className={styles.sortMenuFooter}>
          <div className={styles.sortMenuFooterText}>
            Click an option to sort, click again to reverse order
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Additional utility component for inline sort controls
interface SortControlsProps {
  className?: string;
  sortBy: FilterOptions['sortBy'];
  sortOrder: FilterOptions['sortOrder'];
  onSortChange: (sortBy: FilterOptions['sortBy'], sortOrder: FilterOptions['sortOrder']) => void;
  showOrderToggle?: boolean;
}

export function SortControls({
  className,
  sortBy,
  sortOrder,
  onSortChange,
  showOrderToggle = true
}: SortControlsProps) {
  const currentOption = sortOptions.find(option => option.value === sortBy);
  const CurrentIcon = currentOption?.icon || ArrowUpDown;
  
  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <div className={cn(styles.sortControls, className)}>
      <div className={styles.sortControlsLabel}>
        Sort by:
      </div>
      
      <div className={styles.sortControlsOptions}>
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = option.value === sortBy;
          
          return (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value, sortOrder)}
              className={cn(
                styles.sortControlsOption,
                isSelected && styles.sortControlsOptionSelected
              )}
              title={option.description}
            >
              <Icon className={styles.sortControlsOptionIcon} />
              <span className={styles.sortControlsOptionLabel}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {showOrderToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSortOrder}
          className={styles.sortOrderToggle}
          title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sortOrder === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
} 