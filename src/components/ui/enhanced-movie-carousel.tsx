"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Star, 
  Pause,
  MoreHorizontal,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import styles from "./enhanced-movie-carousel.module.css";

interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year?: number;
  genre?: string[];
  duration?: number;
  description?: string;
  isNollywood?: boolean;
}

interface EnhancedMovieCarouselProps {
  movies: Movie[];
  title?: string;
  subtitle?: string;
  variant?: "default" | "compact" | "hero" | "grid";
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  showTitle?: boolean;
  showRating?: boolean;
  showYear?: boolean;
  showGenres?: boolean;
  showDescription?: boolean;
  itemsPerView?: number;
  spacing?: "tight" | "normal" | "loose";
  loop?: boolean;
  pauseOnHover?: boolean;
  enableKeyboard?: boolean;
  enableTouch?: boolean;
  className?: string;
  onMovieClick?: (movie: Movie) => void;
  onMovieHover?: (movie: Movie) => void;
}

export function EnhancedMovieCarousel({
  movies,
  title,
  subtitle,
  variant = "default",
  autoPlay = false,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = false,
  showTitle = true,
  showRating = true,
  showYear = true,
  showGenres = false,
  showDescription = false,
  itemsPerView = 6,
  spacing = "normal",
  loop = true,
  pauseOnHover = true,
  enableKeyboard = true,
  enableTouch = true,
  className,
  onMovieClick,
  onMovieHover
}: EnhancedMovieCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, scrollLeft: 0 });
  const autoPlayRef = React.useRef<NodeJS.Timeout | null>(null);

  const itemWidth = React.useMemo(() => {
    switch (variant) {
      case "compact":
        return 160;
      case "hero":
        return 320;
      case "grid":
        return 240;
      default:
        return 200;
    }
  }, [variant]);

  const gap = React.useMemo(() => {
    switch (spacing) {
      case "tight":
        return 8;
      case "loose":
        return 24;
      default:
        return 16;
    }
  }, [spacing]);

  const checkScrollability = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      
      // Update current index based on scroll position
      const newIndex = Math.round(scrollLeft / (itemWidth + gap));
      setCurrentIndex(newIndex);
    }
  }, [itemWidth, gap]);

  React.useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
      return () => container.removeEventListener("scroll", checkScrollability);
    }
  }, [checkScrollability]);

  // Auto-play functionality
  React.useEffect(() => {
    if (isPlaying && !isHovered && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        scrollNext();
      }, autoPlayInterval);
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, isHovered, isDragging, autoPlayInterval]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = itemWidth + gap;
      const targetScroll =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const scrollNext = () => {
    const container = scrollContainerRef.current;
    if (container) {
      if (loop && !canScrollRight) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }
  };

  const scrollPrev = () => {
    const container = scrollContainerRef.current;
    if (container) {
      if (loop && !canScrollLeft) {
        container.scrollTo({ 
          left: container.scrollWidth, 
          behavior: "smooth" 
        });
      } else {
        scroll("left");
      }
    }
  };

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (container) {
      const targetScroll = index * (itemWidth + gap);
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableTouch) return;
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX,
      scrollLeft: scrollContainerRef.current?.scrollLeft || 0
    });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableTouch || !isDragging) return;
    const touch = e.touches[0];
    const container = scrollContainerRef.current;
    if (container) {
      const deltaX = touch.clientX - dragStart.x;
      container.scrollLeft = dragStart.scrollLeft - deltaX;
    }
  };

  const handleTouchEnd = () => {
    if (!enableTouch) return;
    setIsDragging(false);
  };

  // Mouse handlers for desktop dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableTouch) return;
    e.preventDefault();
    setDragStart({
      x: e.clientX,
      scrollLeft: scrollContainerRef.current?.scrollLeft || 0
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enableTouch || !isDragging) return;
    const container = scrollContainerRef.current;
    if (container) {
      const deltaX = e.clientX - dragStart.x;
      container.scrollLeft = dragStart.scrollLeft - deltaX;
    }
  };

  const handleMouseUp = () => {
    if (!enableTouch) return;
    setIsDragging(false);
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard]);

  const handleMovieClick = (movie: Movie) => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const handleMovieHover = (movie: Movie) => {
    if (onMovieHover) {
      onMovieHover(movie);
    }
  };

  return (
    <div 
      className={cn(styles.carouselContainer, styles[variant], className)}
      onMouseEnter={() => {
        if (pauseOnHover) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover) setIsHovered(false);
      }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className={styles.carouselHeader}>
          <div className={styles.headerContent}>
            {title && (
              <h2 className={styles.carouselTitle}>{title}</h2>
            )}
            {subtitle && (
              <p className={styles.carouselSubtitle}>{subtitle}</p>
            )}
          </div>
          
          {/* Controls */}
          {showControls && (
            <div className={styles.headerControls}>
              {autoPlay && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayPause}
                  className={styles.playButton}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              <div className={styles.navigationButtons}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={scrollPrev}
                  disabled={!canScrollLeft && !loop}
                  className={styles.navButton}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={scrollNext}
                  disabled={!canScrollRight && !loop}
                  className={styles.navButton}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Carousel */}
      <div className={styles.carouselWrapper}>
        {/* Navigation Arrows */}
        {showControls && (
          <>
            <button
              onClick={scrollPrev}
              disabled={!canScrollLeft && !loop}
              className={cn(
                styles.navArrow,
                styles.navArrowLeft,
                (!canScrollLeft && !loop) && styles.navArrowDisabled
              )}
              aria-label="Previous movies"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollRight && !loop}
              className={cn(
                styles.navArrow,
                styles.navArrowRight,
                (!canScrollRight && !loop) && styles.navArrowDisabled
              )}
              aria-label="Next movies"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Movies Container */}
        <div
          ref={scrollContainerRef}
          className={cn(
            styles.moviesContainer,
            styles[spacing],
            isDragging && styles.isDragging
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className={styles.moviesGrid}>
            {movies.map((movie, index) => (
              <div
                key={movie.id}
                className={cn(
                  styles.movieItem,
                  styles[variant]
                )}
                style={{
                  width: itemWidth,
                  marginRight: index === movies.length - 1 ? 0 : gap
                }}
                onClick={() => handleMovieClick(movie)}
                onMouseEnter={() => handleMovieHover(movie)}
              >
                {/* Movie Poster */}
                <div className={styles.moviePoster}>
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    sizes={`${itemWidth}px`}
                    className={styles.posterImage}
                  />
                  
                  {/* Overlay */}
                  <div className={styles.movieOverlay}>
                    <div className={styles.overlayContent}>
                      <Link href={`/movies/${movie.id}`}>
                        <div className={styles.playButton}>
                          <Play className="h-6 w-6" />
                        </div>
                      </Link>
                      
                      {variant === "hero" && (
                        <div className={styles.overlayActions}>
                          <Button size="sm" variant="ghost">
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className={styles.movieBadges}>
                    {movie.isNollywood && (
                      <Badge variant="nollywood" className={styles.nollywoodBadge}>
                        Nollywood
                      </Badge>
                    )}
                    {showRating && (
                      <div className={styles.ratingBadge}>
                        <Star className={styles.starIcon} />
                        <span>{movie.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Movie Info */}
                <div className={styles.movieInfo}>
                  {showTitle && (
                    <Link href={`/movies/${movie.id}`} className={styles.movieTitle}>
                      {movie.title}
                    </Link>
                  )}
                  
                  <div className={styles.movieMeta}>
                    {showYear && movie.year && (
                      <span className={styles.movieYear}>{movie.year}</span>
                    )}
                    {showRating && (
                      <div className={styles.movieRating}>
                        <Star className={styles.starIcon} />
                        <span>{movie.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {showGenres && movie.genre && (
                    <div className={styles.movieGenres}>
                      {movie.genre.slice(0, 2).map((genre) => (
                        <Badge key={genre} variant="genre" className={styles.genreBadge}>
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {showDescription && movie.description && (
                    <p className={styles.movieDescription}>
                      {movie.description.slice(0, 100)}...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicators */}
      {showIndicators && (
        <div className={styles.indicators}>
          {Array.from({ length: Math.ceil(movies.length / itemsPerView) }, (_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i * itemsPerView)}
              className={cn(
                styles.indicator,
                Math.floor(currentIndex / itemsPerView) === i && styles.indicatorActive
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Legacy component for backward compatibility
export function MovieCarousel(props: {
  movies: Movie[];
  title: string;
}) {
  return (
    <EnhancedMovieCarousel 
      movies={props.movies}
      title={props.title}
      variant="default"
    />
  );
} 