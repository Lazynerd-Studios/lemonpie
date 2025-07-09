"use client";

import * as React from "react";
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Star, 
  Clock, 
  Globe, 
  DollarSign,
  Award,
  Play,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFilters, FilterOptions } from "@/lib/hooks/useFilters";
import { Movie } from "@/types/movie";
import { movieData } from "@/data/movies";
import styles from "./filter-panel.module.css";

interface FilterPanelProps {
  className?: string;
  movies: Movie[];
  isOpen?: boolean;
  onClose?: () => void;
  onFiltersChange?: (filters: FilterOptions) => void;
}

// Get unique values for filter options
const getFilterOptions = (movies: Movie[]) => {
  const genres = new Set<string>();
  const languages = new Set<string>();
  const countries = new Set<string>();
  const years = new Set<number>();
  let minRating = 10;
  let maxRating = 0;
  let minDuration = 9999;
  let maxDuration = 0;

  movies.forEach((movie) => {
    movie.genre.forEach((g) => genres.add(g));
    if (movie.language) languages.add(movie.language);
    if (movie.country) countries.add(movie.country);
    years.add(movie.year);
    
    if (movie.rating < minRating) minRating = movie.rating;
    if (movie.rating > maxRating) maxRating = movie.rating;
    if (movie.duration < minDuration) minDuration = movie.duration;
    if (movie.duration > maxDuration) maxDuration = movie.duration;
  });

  return {
    genres: Array.from(genres).sort(),
    languages: Array.from(languages).sort(),
    countries: Array.from(countries).sort(),
    years: Array.from(years).sort((a, b) => b - a),
    ratingRange: { min: minRating, max: maxRating },
    durationRange: { min: minDuration, max: maxDuration }
  };
};

const FilterSection: React.FC<{
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, icon: Icon, isOpen, onToggle, children }) => (
  <div className={styles.filterSection}>
    <button 
      onClick={onToggle}
      className={cn(styles.filterSectionHeader, isOpen && styles.filterSectionHeaderOpen)}
    >
      <div className={styles.filterSectionTitle}>
        <Icon className={styles.filterSectionIcon} />
        <span>{title}</span>
      </div>
      {isOpen ? (
        <ChevronUp className={styles.filterSectionChevron} />
      ) : (
        <ChevronDown className={styles.filterSectionChevron} />
      )}
    </button>
    {isOpen && (
      <div className={styles.filterSectionContent}>
        {children}
      </div>
    )}
  </div>
);

const GenreFilter: React.FC<{
  availableGenres: string[];
  selectedGenres: string[];
  excludedGenres: string[];
  onGenreToggle: (genre: string, type: 'include' | 'exclude') => void;
}> = ({ availableGenres, selectedGenres, excludedGenres, onGenreToggle }) => (
  <div className={styles.genreFilter}>
    <div className={styles.genreFilterTitle}>Include genres:</div>
    <div className={styles.genreGrid}>
      {availableGenres.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreToggle(genre, 'include')}
          className={cn(
            styles.genreButton,
            selectedGenres.includes(genre) && styles.genreButtonActive
          )}
        >
          {genre}
        </button>
      ))}
    </div>
    
    <div className={styles.genreFilterTitle}>Exclude genres:</div>
    <div className={styles.genreGrid}>
      {availableGenres.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreToggle(genre, 'exclude')}
          className={cn(
            styles.genreButton,
            styles.genreButtonExclude,
            excludedGenres.includes(genre) && styles.genreButtonExcludeActive
          )}
        >
          {genre}
        </button>
      ))}
    </div>
  </div>
);

const YearFilter: React.FC<{
  availableYears: number[];
  yearFilter: FilterOptions['year'];
  onYearChange: (year: FilterOptions['year']) => void;
}> = ({ availableYears, yearFilter, onYearChange }) => {
  const minYear = Math.min(...availableYears);
  const maxYear = Math.max(...availableYears);
  
  return (
    <div className={styles.yearFilter}>
      <div className={styles.yearRange}>
        <div className={styles.yearRangeInput}>
          <label className={styles.yearRangeLabel}>From:</label>
          <input
            type="number"
            min={minYear}
            max={maxYear}
            value={yearFilter.min || ''}
            onChange={(e) => onYearChange({ 
              ...yearFilter, 
              min: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            className={styles.yearInput}
            placeholder={minYear.toString()}
          />
        </div>
        <div className={styles.yearRangeInput}>
          <label className={styles.yearRangeLabel}>To:</label>
          <input
            type="number"
            min={minYear}
            max={maxYear}
            value={yearFilter.max || ''}
            onChange={(e) => onYearChange({ 
              ...yearFilter, 
              max: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            className={styles.yearInput}
            placeholder={maxYear.toString()}
          />
        </div>
      </div>
      
      <div className={styles.yearQuickFilters}>
        <button
          onClick={() => onYearChange({ min: 2020 })}
          className={styles.yearQuickButton}
        >
          2020+
        </button>
        <button
          onClick={() => onYearChange({ min: 2015, max: 2019 })}
          className={styles.yearQuickButton}
        >
          2015-2019
        </button>
        <button
          onClick={() => onYearChange({ min: 2010, max: 2014 })}
          className={styles.yearQuickButton}
        >
          2010-2014
        </button>
        <button
          onClick={() => onYearChange({ max: 2009 })}
          className={styles.yearQuickButton}
        >
          Before 2010
        </button>
      </div>
    </div>
  );
};

const RatingFilter: React.FC<{
  ratingRange: { min: number; max: number };
  ratingFilter: FilterOptions['rating'];
  onRatingChange: (rating: FilterOptions['rating']) => void;
}> = ({ ratingRange, ratingFilter, onRatingChange }) => (
  <div className={styles.ratingFilter}>
    <div className={styles.ratingRange}>
      <div className={styles.ratingRangeInput}>
        <label className={styles.ratingRangeLabel}>Min Rating:</label>
        <input
          type="number"
          min={ratingRange.min}
          max={ratingRange.max}
          step="0.1"
          value={ratingFilter.min || ''}
          onChange={(e) => onRatingChange({ 
            ...ratingFilter, 
            min: e.target.value ? parseFloat(e.target.value) : undefined 
          })}
          className={styles.ratingInput}
          placeholder={ratingRange.min.toString()}
        />
      </div>
      <div className={styles.ratingRangeInput}>
        <label className={styles.ratingRangeLabel}>Max Rating:</label>
        <input
          type="number"
          min={ratingRange.min}
          max={ratingRange.max}
          step="0.1"
          value={ratingFilter.max || ''}
          onChange={(e) => onRatingChange({ 
            ...ratingFilter, 
            max: e.target.value ? parseFloat(e.target.value) : undefined 
          })}
          className={styles.ratingInput}
          placeholder={ratingRange.max.toString()}
        />
      </div>
    </div>
    
    <div className={styles.ratingQuickFilters}>
      <button
        onClick={() => onRatingChange({ min: 8 })}
        className={styles.ratingQuickButton}
      >
        <Star className="h-4 w-4" />
        8.0+
      </button>
      <button
        onClick={() => onRatingChange({ min: 7 })}
        className={styles.ratingQuickButton}
      >
        <Star className="h-4 w-4" />
        7.0+
      </button>
      <button
        onClick={() => onRatingChange({ min: 6 })}
        className={styles.ratingQuickButton}
      >
        <Star className="h-4 w-4" />
        6.0+
      </button>
    </div>
  </div>
);

export function FilterPanel({
  className,
  movies,
  isOpen = true,
  onClose,
  onFiltersChange
}: FilterPanelProps) {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    genres: true,
    year: false,
    rating: false,
    duration: false,
    language: false,
    special: false
  });

  const {
    filters,
    activeFiltersCount,
    hasActiveFilters,
    setGenreFilter,
    setYearFilter,
    setRatingFilter,
    setDurationFilter,
    setLanguageFilter,
    setNollywoodFilter,
    setHasAwardsFilter,
    setHasTrailerFilter,
    clearFilters,
    resetFilters,
    addGenre,
    removeGenre,
    toggleGenre
  } = useFilters(movies, {
    onFiltersChange,
    saveToStorage: true,
    storageKey: 'search-page-filters'
  });

  const filterOptions = React.useMemo(() => getFilterOptions(movies), [movies]);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleGenreToggle = (genre: string, type: 'include' | 'exclude') => {
    toggleGenre(genre, type);
  };

  if (!isOpen) return null;

  return (
    <Card className={cn(styles.filterPanel, className)}>
      <div className={styles.filterHeader}>
        <div className={styles.filterTitle}>
          <Filter className={styles.filterTitleIcon} />
          <span>Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className={styles.filterBadge}>
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <div className={styles.filterHeaderActions}>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={styles.clearFiltersButton}
          >
            Clear All
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className={styles.closeButton}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className={styles.filterContent}>
        {/* Genres */}
        <FilterSection
          title="Genres"
          icon={Film}
          isOpen={openSections.genres}
          onToggle={() => toggleSection('genres')}
        >
          <GenreFilter
            availableGenres={filterOptions.genres}
            selectedGenres={filters.genres.include}
            excludedGenres={filters.genres.exclude}
            onGenreToggle={handleGenreToggle}
          />
        </FilterSection>

        {/* Year */}
        <FilterSection
          title="Release Year"
          icon={Calendar}
          isOpen={openSections.year}
          onToggle={() => toggleSection('year')}
        >
          <YearFilter
            availableYears={filterOptions.years}
            yearFilter={filters.year}
            onYearChange={setYearFilter}
          />
        </FilterSection>

        {/* Rating */}
        <FilterSection
          title="Rating"
          icon={Star}
          isOpen={openSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <RatingFilter
            ratingRange={filterOptions.ratingRange}
            ratingFilter={filters.rating}
            onRatingChange={setRatingFilter}
          />
        </FilterSection>

        {/* Duration */}
        <FilterSection
          title="Duration"
          icon={Clock}
          isOpen={openSections.duration}
          onToggle={() => toggleSection('duration')}
        >
          <div className={styles.durationFilter}>
            <div className={styles.durationRange}>
              <div className={styles.durationRangeInput}>
                <label className={styles.durationRangeLabel}>Min (mins):</label>
                <input
                  type="number"
                  min={filterOptions.durationRange.min}
                  max={filterOptions.durationRange.max}
                  value={filters.duration.min || ''}
                  onChange={(e) => setDurationFilter({ 
                    ...filters.duration, 
                    min: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className={styles.durationInput}
                  placeholder={filterOptions.durationRange.min.toString()}
                />
              </div>
              <div className={styles.durationRangeInput}>
                <label className={styles.durationRangeLabel}>Max (mins):</label>
                <input
                  type="number"
                  min={filterOptions.durationRange.min}
                  max={filterOptions.durationRange.max}
                  value={filters.duration.max || ''}
                  onChange={(e) => setDurationFilter({ 
                    ...filters.duration, 
                    max: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className={styles.durationInput}
                  placeholder={filterOptions.durationRange.max.toString()}
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Language */}
        <FilterSection
          title="Language"
          icon={Globe}
          isOpen={openSections.language}
          onToggle={() => toggleSection('language')}
        >
          <div className={styles.languageFilter}>
            <div className={styles.languageGrid}>
              {filterOptions.languages.map((language) => (
                <button
                  key={language}
                  onClick={() => {
                    const current = filters.language.selected;
                    const newSelected = current.includes(language)
                      ? current.filter(l => l !== language)
                      : [...current, language];
                    setLanguageFilter({ selected: newSelected });
                  }}
                  className={cn(
                    styles.languageButton,
                    filters.language.selected.includes(language) && styles.languageButtonActive
                  )}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Special Filters */}
        <FilterSection
          title="Special"
          icon={Award}
          isOpen={openSections.special}
          onToggle={() => toggleSection('special')}
        >
          <div className={styles.specialFilter}>
            <div className={styles.specialOptions}>
              <button
                onClick={() => setNollywoodFilter(
                  filters.isNollywood === true ? undefined : true
                )}
                className={cn(
                  styles.specialButton,
                  filters.isNollywood === true && styles.specialButtonActive
                )}
              >
                Nollywood Only
              </button>
              
              <button
                onClick={() => setHasAwardsFilter(
                  filters.hasAwards === true ? undefined : true
                )}
                className={cn(
                  styles.specialButton,
                  filters.hasAwards === true && styles.specialButtonActive
                )}
              >
                <Award className="h-4 w-4" />
                Has Awards
              </button>
              
              <button
                onClick={() => setHasTrailerFilter(
                  filters.hasTrailer === true ? undefined : true
                )}
                className={cn(
                  styles.specialButton,
                  filters.hasTrailer === true && styles.specialButtonActive
                )}
              >
                <Play className="h-4 w-4" />
                Has Trailer
              </button>
            </div>
          </div>
        </FilterSection>
      </div>
    </Card>
  );
} 