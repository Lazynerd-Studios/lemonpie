import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Heart, 
  Share2, 
  Bookmark,
  Film,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/types/movie";
import styles from './movie-hero.module.css';

interface MovieHeroProps {
  movie: Movie;
}

export function MovieHero({ movie }: MovieHeroProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <>
      {/* Back Button */}
      <div className={styles.backButtonContainer}>
        <div className={styles.backButtonWrapper}>
          <Link href="/movies">
            <Button variant="ghost" className={styles.backButton}>
              <ChevronLeft className="h-4 w-4" />
              Back to Movies
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        {/* Backdrop Image */}
        <div className={styles.backdropContainer}>
          <Image
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            fill
            className={styles.backdropImage}
            priority
          />
          <div className={styles.gradientOverlay} />
          <div className={styles.bottomGradient} />
        </div>

        {/* Content */}
        <div className={styles.heroContent}>
          <div className={styles.contentWrapper}>
            <div className={styles.heroGrid}>
              {/* Movie Poster */}
              <div className={styles.posterContainer}>
                <div className={styles.posterGroup}>
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    width={400}
                    height={600}
                    className={styles.posterImage}
                    priority
                  />
                  
                  {/* Rating Badge */}
                  <div className={styles.ratingBadge}>
                    ⭐ {movie.rating}
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className={styles.playOverlay}>
                    <Button size="lg" className={styles.playButton}>
                      <Play className="mr-2 h-5 w-5" />
                      Watch Trailer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Movie Info */}
              <div className={styles.movieInfo}>
                {/* Title and Badges */}
                <div className={styles.titleSection}>
                  {movie.isNollywood && (
                    <Badge variant="nollywood" className={styles.nollywoodBadge}>
                      🎬 NOLLYWOOD
                    </Badge>
                  )}
                  <h1 className={styles.movieTitle}>
                    {movie.title}
                  </h1>
                </div>

                {/* Meta Information */}
                <div className={styles.metaInfo}>
                  <div className={styles.metaItem}>
                    <Calendar className="h-4 w-4" />
                    <span>{movie.year}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Users className="h-4 w-4" />
                    <span>{movie.language}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Film className="h-4 w-4" />
                    <span>{movie.director}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className={styles.genresSection}>
                  {movie.genre.map((genre, index) => (
                    <Badge key={index} variant="outline" className={styles.genreBadge}>
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Description */}
                <p className={styles.description}>
                  {movie.description}
                </p>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  <Button size="lg" className={styles.watchButton}>
                    <Play className="mr-2 h-5 w-5" />
                    Watch Trailer
                  </Button>
                  <Button size="lg" variant="outline" className={styles.watchlistButton}>
                    <Heart className="mr-2 h-5 w-5" />
                    Add to Watchlist
                  </Button>
                  <Button size="lg" variant="outline" className={styles.saveButton}>
                    <Bookmark className="mr-2 h-5 w-5" />
                    Save
                  </Button>
                  <Button size="lg" variant="outline" className={styles.shareButton}>
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 