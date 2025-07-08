import * as React from "react";
import Image from "next/image";
import { Play, Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroMovie } from "@/types/movie";
import styles from "./hero-section.module.css";

interface HeroSectionProps {
  movie: HeroMovie;
}

export function HeroSection({ movie }: HeroSectionProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <section className={styles.heroSection}>
      {/* Background Image */}
      <div className={styles.backgroundImage}>
        <Image
          src={movie.backdrop}
          alt={movie.title}
          fill
          sizes="100vw"
          priority
          className={styles.backdropImage}
        />
      </div>

      {/* Gradient Overlay */}
      <div className={styles.gradientOverlay} />

      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.contentWrapper}>
          {/* Movie Badge */}
          {movie.isNollywood && (
            <Badge variant="nollywood" className={styles.nollywoodBadge}>
              Nollywood
            </Badge>
          )}

          {/* Title */}
          <h1 className={styles.heroTitle}>{movie.title}</h1>

          {/* Meta Information */}
          <div className={styles.metaInfo}>
            <div className={styles.rating}>
              <Star className={styles.starIcon} />
              <span className={styles.ratingValue}>{movie.rating}</span>
            </div>
            <div className={styles.metaItem}>
              <Calendar className={styles.metaIcon} />
              <span>{movie.year}</span>
            </div>
            <div className={styles.metaItem}>
              <Clock className={styles.metaIcon} />
              <span>{formatDuration(movie.duration)}</span>
            </div>
          </div>

          {/* Genres */}
          <div className={styles.genres}>
            {movie.genre.map((genre, index) => (
              <Badge key={index} variant="outline" className={styles.genreBadge}>
                {genre}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <p className={styles.description}>{movie.description}</p>

          {/* Cast */}
          <div className={styles.cast}>
            <span className={styles.castLabel}>Starring:</span>
            <span className={styles.castList}>{movie.cast.join(", ")}</span>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <Button size="lg" className={styles.playButton}>
              <Play className={styles.playIcon} />
              Watch Trailer
            </Button>
            <Button variant="outline" size="lg" className={styles.learnMoreButton}>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 