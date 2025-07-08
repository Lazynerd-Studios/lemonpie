import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Clock, Users, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatRating, getRatingColor, truncateText } from "@/lib/utils";
import styles from "./movie-card.module.css";

export interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    poster?: string;
    rating: number;
    criticsRating: number;
    audienceRating: number;
    genre: string[];
    year: number;
    duration: number;
    description: string;
    director: string;
    cast: string[];
    isNollywood?: boolean;
  };
  variant?: "grid" | "list" | "featured" | "hero" | "carousel" | "minimal";
  className?: string;
  showActions?: boolean;
  animateIn?: boolean;
  onClick?: () => void;
}

export function EnhancedMovieCard({ 
  movie, 
  variant = "grid", 
  className,
  showActions = true,
  animateIn = false,
  onClick
}: MovieCardProps) {
  const isMinimal = variant === "minimal";
  const isCarousel = variant === "carousel";
  const isHero = variant === "hero";
  const isList = variant === "list";

  const getRatingValueClass = (rating: number) => {
    if (rating >= 8) return styles["ratingValue.high"];
    if (rating >= 6) return styles["ratingValue.medium"];
    return styles["ratingValue.low"];
  };

  const truncateLength = React.useMemo(() => {
    switch (variant) {
      case "hero":
        return 300;
      case "featured":
        return 200;
      case "list":
        return 150;
      case "carousel":
        return 80;
      case "minimal":
        return 60;
      default:
        return 120;
    }
  }, [variant]);

  return (
    <div
      className={cn(
        styles.movieCard,
        styles[variant],
        animateIn && styles["animate-in"],
        className
      )}
      onClick={onClick}
    >
      {/* Movie Poster */}
      <div className={styles.poster}>
        {movie.poster ? (
          <Image
            src={movie.poster}
            alt={`${movie.title} poster`}
            fill
            sizes={
              isCarousel 
                ? "240px"
                : isList 
                  ? "150px"
                  : isHero 
                    ? "300px"
                    : "400px"
            }
            className={styles.posterImage}
          />
        ) : (
          <div className={styles.posterPlaceholder}>
            <span>No Poster Available</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className={styles.posterOverlay} />
        
        {/* Nollywood Badge */}
        {movie.isNollywood && (
          <div className={styles.nollywoodBadge}>
            Nollywood
          </div>
        )}
        
        {/* Rating Badge */}
        <div className={styles.ratingBadge}>
          <Star className={styles.metaIcon} />
          {formatRating(movie.rating)}
        </div>

        {/* Hover Play Button */}
        <div className={styles.playButton}>
          <Link href={`/movies/${movie.id}`}>
            <div className={styles.playButtonInner}>
              <Play className={styles.metaIcon} />
            </div>
          </Link>
        </div>
      </div>

      {/* Movie Content */}
      <div className={styles.content}>
        {/* Movie Title */}
        <Link href={`/movies/${movie.id}`} className={styles.movieTitle}>
          {movie.title}
        </Link>
        
        {/* Movie Meta */}
        <div className={styles.movieMeta}>
          <div className={styles.metaItem}>
            <Calendar className={styles.metaIcon} />
            <span>{movie.year}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock className={styles.metaIcon} />
            <span>{movie.duration}min</span>
          </div>
          {(isHero || isList) && (
            <div className={styles.metaItem}>
              <Users className={styles.metaIcon} />
              <span>{movie.director}</span>
            </div>
          )}
        </div>

        {/* Genres */}
        {!isMinimal && !isCarousel && (
          <div className={styles.genres}>
            {movie.genre.slice(0, isHero ? 4 : 3).map((genre) => (
              <span key={genre} className={styles.genreBadge}>
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {!isMinimal && !isCarousel && (
          <p className={styles.description}>
            {truncateText(movie.description, truncateLength)}
          </p>
        )}

        {/* Ratings Section */}
        {(isHero || isList) && (
          <div className={styles.ratingsSection}>
            <div className={styles.ratingRow}>
              <span className={styles.ratingLabel}>Critics Rating</span>
              <span className={cn(styles.ratingValue, getRatingValueClass(movie.criticsRating))}>
                {formatRating(movie.criticsRating)}
              </span>
            </div>
            <div className={styles.ratingRow}>
              <span className={styles.ratingLabel}>Audience Rating</span>
              <span className={cn(styles.ratingValue, getRatingValueClass(movie.audienceRating))}>
                {formatRating(movie.audienceRating)}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && !isMinimal && !isCarousel && (
          <div className={styles.actions}>
            <Link href={`/movies/${movie.id}`}>
              <Button className={styles.actionButton}>
                View Details
              </Button>
            </Link>
            {(isHero || isList) && (
              <Button variant="outline" className={styles.actionButton}>
                Add to Watchlist
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Legacy component for backward compatibility
export function MovieCard(props: MovieCardProps) {
  return <EnhancedMovieCard {...props} />;
} 