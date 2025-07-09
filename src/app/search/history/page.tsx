"use client";

import * as React from "react";
import { SearchHistoryUI } from "@/components/search/search-history-ui";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./history.module.css";

// Search history item type
interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  frequency: number;
  isFavorite: boolean;
  filters?: {
    genres?: string[];
    year?: number;
    rating?: number;
  };
  resultCount: number;
}

// Mock search history data
const mockSearchHistory = [
  {
    id: "1",
    query: "Nollywood action movies",
    timestamp: Date.now() - 10 * 60 * 1000, // 10 minutes ago
    frequency: 3,
    isFavorite: true,
    filters: {
      genres: ["Action", "Adventure"],
      year: 2023,
      rating: 4
    },
    resultCount: 45
  },
  {
    id: "2",
    query: "Genevieve Nnaji",
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    frequency: 5,
    isFavorite: true,
    resultCount: 28
  },
  {
    id: "3",
    query: "romantic comedy",
    timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    frequency: 2,
    isFavorite: false,
    filters: {
      genres: ["Romance", "Comedy"],
      rating: 3
    },
    resultCount: 67
  },
  {
    id: "4",
    query: "Kunle Afolayan",
    timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    frequency: 1,
    isFavorite: false,
    resultCount: 15
  },
  {
    id: "5",
    query: "Nigerian cinema 2024",
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    frequency: 4,
    isFavorite: true,
    filters: {
      year: 2024,
      rating: 4
    },
    resultCount: 89
  },
  {
    id: "6",
    query: "Ramsey Nouah",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    frequency: 2,
    isFavorite: false,
    resultCount: 32
  },
  {
    id: "7",
    query: "thriller movies",
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
    frequency: 1,
    isFavorite: false,
    filters: {
      genres: ["Thriller", "Suspense"],
      rating: 3
    },
    resultCount: 54
  },
  {
    id: "8",
    query: "Funke Akindele",
    timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    frequency: 3,
    isFavorite: true,
    resultCount: 41
  },
  {
    id: "9",
    query: "comedy movies 2023",
    timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    frequency: 2,
    isFavorite: false,
    filters: {
      genres: ["Comedy"],
      year: 2023
    },
    resultCount: 73
  },
  {
    id: "10",
    query: "Wole Soyinka",
    timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    frequency: 1,
    isFavorite: false,
    resultCount: 8
  }
];

export default function SearchHistoryPage() {
  const router = useRouter();
  const [items, setItems] = React.useState(mockSearchHistory);
  const [variant, setVariant] = React.useState<"default" | "compact" | "detailed">("default");
  const [groupBy, setGroupBy] = React.useState<"date" | "frequency" | "none">("date");
  const [showFavorites, setShowFavorites] = React.useState(false);

  const handleItemClick = (item: SearchHistoryItem) => {
    router.push(`/search?q=${encodeURIComponent(item.query)}`);
  };

  const handleItemRemove = (item: SearchHistoryItem) => {
    setItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleItemFavorite = (item: SearchHistoryItem) => {
    setItems(prev => prev.map(i => 
      i.id === item.id 
        ? { ...i, isFavorite: !i.isFavorite }
        : i
    ));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const handleClearOld = () => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    setItems(prev => prev.filter(item => item.timestamp > thirtyDaysAgo));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'search-history.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className={styles.historyPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className={styles.backButton}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className={styles.headerTitle}>
              <h1 className={styles.title}>Search History</h1>
              <p className={styles.subtitle}>
                Manage your search history and favorites
              </p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className={styles.exportButton}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={styles.settingsButton}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>View:</label>
            <div className={styles.controlButtons}>
              <Button
                variant={variant === "compact" ? "default" : "outline"}
                size="sm"
                onClick={() => setVariant("compact")}
              >
                Compact
              </Button>
              <Button
                variant={variant === "default" ? "default" : "outline"}
                size="sm"
                onClick={() => setVariant("default")}
              >
                Default
              </Button>
              <Button
                variant={variant === "detailed" ? "default" : "outline"}
                size="sm"
                onClick={() => setVariant("detailed")}
              >
                Detailed
              </Button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Group by:</label>
            <div className={styles.controlButtons}>
              <Button
                variant={groupBy === "date" ? "default" : "outline"}
                size="sm"
                onClick={() => setGroupBy("date")}
              >
                Date
              </Button>
              <Button
                variant={groupBy === "frequency" ? "default" : "outline"}
                size="sm"
                onClick={() => setGroupBy("frequency")}
              >
                Frequency
              </Button>
              <Button
                variant={groupBy === "none" ? "default" : "outline"}
                size="sm"
                onClick={() => setGroupBy("none")}
              >
                None
              </Button>
            </div>
          </div>

          <div className={styles.controlGroup}>
            <Button
              variant={showFavorites ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavorites(!showFavorites)}
            >
              {showFavorites ? "Show All" : "Show Favorites"}
            </Button>
          </div>
        </div>

        {/* Search History UI */}
        <div className={styles.historyContainer}>
          <SearchHistoryUI
            items={showFavorites ? items.filter(item => item.isFavorite) : items}
            variant={variant}
            groupBy={groupBy}
            maxItems={50}
            showActions={true}
            showFilters={true}
            showTimestamp={true}
            showFrequency={true}
            onItemClick={handleItemClick}
            onItemRemove={handleItemRemove}
            onItemFavorite={handleItemFavorite}
            onClearAll={handleClearAll}
            onClearOld={handleClearOld}
            title="Your Search History"
            showTitle={true}
            className={styles.historyComponent}
          />
        </div>
      </div>
    </div>
  );
} 