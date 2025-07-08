import * as React from "react";
import { Sparkles } from "lucide-react";
import { MovieCard } from "@/components/movie/movie-card";
import { Movie } from "@/types/movie";
import styles from './related-movies-section.module.css';

interface RelatedMoviesSectionProps {
  relatedMovies: Movie[];
}

export function RelatedMoviesSection({ relatedMovies }: RelatedMoviesSectionProps) {
  if (!relatedMovies || relatedMovies.length === 0) {
    return null;
  }

  return (
    <section className={styles.relatedSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          <Sparkles className={styles.titleIcon} />
          You might also like
        </h2>
        
        <div className={styles.moviesGrid}>
          {relatedMovies.slice(0, 3).map((movie) => (
            <div key={movie.id} className={styles.movieCardWrapper}>
              <MovieCard movie={movie} variant="default" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 