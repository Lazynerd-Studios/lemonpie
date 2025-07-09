"use client";

import * as React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  MoreHorizontal 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "./pagination.module.css";

interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  showPageInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  disabled?: boolean;
  variant?: "default" | "compact" | "minimal";
}

const itemsPerPageOptions = [10, 20, 50, 100];

export function Pagination({
  className,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  showPageInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  disabled = false,
  variant = "default"
}: PaginationProps) {
  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add ellipsis and first page if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }
    }
    
    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !disabled) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
      // Reset to first page when changing items per page
      onPageChange(1);
    }
  };

  if (totalPages <= 1 && variant !== "minimal") {
    return null;
  }

  return (
    <div className={cn(styles.pagination, styles[variant], className)}>
      {/* Page Info */}
      {showPageInfo && variant !== "minimal" && (
        <div className={styles.pageInfo}>
          <span className={styles.pageInfoText}>
            Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of {totalItems.toLocaleString()} results
          </span>
        </div>
      )}

      {/* Pagination Controls */}
      <div className={styles.paginationControls}>
        {/* First Page Button */}
        {showFirstLast && variant !== "minimal" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || disabled}
            className={styles.paginationButton}
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Previous Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className={styles.paginationButton}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          {variant === "default" && <span>Previous</span>}
        </Button>

        {/* Page Number Buttons */}
        {variant !== "minimal" && (
          <div className={styles.pageNumbers}>
            {visiblePages.map((page, index) => {
              if (typeof page === "string") {
                return (
                  <div
                    key={page}
                    className={styles.ellipsis}
                    aria-label="More pages"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                );
              }

              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  disabled={disabled}
                  className={cn(
                    styles.pageButton,
                    page === currentPage && styles.pageButtonActive
                  )}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </Button>
              );
            })}
          </div>
        )}

        {/* Current Page Indicator for Minimal Variant */}
        {variant === "minimal" && (
          <div className={styles.currentPageIndicator}>
            <span className={styles.currentPageText}>
              {currentPage} / {totalPages}
            </span>
          </div>
        )}

        {/* Next Page Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className={styles.paginationButton}
          aria-label="Go to next page"
        >
          {variant === "default" && <span>Next</span>}
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page Button */}
        {showFirstLast && variant !== "minimal" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || disabled}
            className={styles.paginationButton}
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Items Per Page Selector */}
      {showItemsPerPage && onItemsPerPageChange && variant !== "minimal" && (
        <div className={styles.itemsPerPage}>
          <label htmlFor="items-per-page" className={styles.itemsPerPageLabel}>
            Items per page:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            disabled={disabled}
            className={styles.itemsPerPageSelect}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// Hook for pagination logic
export function usePagination({
  totalItems,
  itemsPerPage: initialItemsPerPage = 20,
  currentPage: initialCurrentPage = 1
}: {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
}) {
  const [currentPage, setCurrentPage] = React.useState(initialCurrentPage);
  const [itemsPerPage, setItemsPerPage] = React.useState(initialItemsPerPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset to first page if current page is out of bounds
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const paginateItems = React.useCallback(
    <T>(items: T[]): T[] => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return items.slice(startIndex, endIndex);
    },
    [currentPage, itemsPerPage]
  );

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    handlePageChange,
    handleItemsPerPageChange,
    paginateItems
  };
}

// Simple page indicator component
export function PageIndicator({
  currentPage,
  totalPages,
  className
}: {
  currentPage: number;
  totalPages: number;
  className?: string;
}) {
  return (
    <div className={cn(styles.pageIndicator, className)}>
      Page {currentPage} of {totalPages}
    </div>
  );
} 