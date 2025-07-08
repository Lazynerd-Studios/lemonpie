import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReleasingSoonMovie } from "@/types/movie";
import { Calendar, ChevronRight } from "lucide-react";
import styles from "./coming-soon-section.module.css";

interface ComingSoonSectionProps {
  movies: ReleasingSoonMovie[];
}

export function ComingSoonSection({ movies }: ComingSoonSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className={styles.comingSoonSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Coming Soon</h2>
            <p className={styles.subtitle}>
              Upcoming Nigerian movies to watch out for
            </p>
          </div>
          <Link href="/coming-soon">
            <Button variant="outline" className={styles.viewAllButton}>
              View All
              <ChevronRight className={styles.chevronIcon} />
            </Button>
          </Link>
        </div>
        
        <div className={styles.moviesGrid}>
          {movies.map((movie, index) => (
            <div key={movie.id} className={styles.movieCard} style={{animationDelay: `${index * 0.1}s`}}>
              <div className={styles.posterContainer}>
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className={styles.posterImage}
                />
                <div className={styles.overlay}>
                  <div className={styles.anticipationBadge}>
                    <span className={styles.anticipationValue}>{movie.anticipation}%</span>
                    <span className={styles.anticipationLabel}>Anticipation</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.movieInfo}>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                
                <div className={styles.releaseDate}>
                  <Calendar className={styles.calendarIcon} />
                  <span>{formatDate(movie.releaseDate)}</span>
                </div>
                
                <div className={styles.genres}>
                  {movie.genre.map((genre, index) => (
                    <Badge key={index} variant="secondary" className={styles.genreBadge}>
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <p className={styles.description}>{movie.description}</p>
                
                <div className={styles.director}>
                  <span className={styles.directorLabel}>Director:</span>
                  <span className={styles.directorName}>{movie.director}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 