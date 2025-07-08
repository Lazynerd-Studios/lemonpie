import * as React from "react";
import Link from "next/link";
import { MovieCard } from "@/components/movie/movie-card";
import { Button } from "@/components/ui/button";
import { Movie } from "@/types/movie";
import { ChevronRight } from "lucide-react";
import styles from "./top-rated-section.module.css";

interface TopRatedSectionProps {
  movies: Movie[];
}

export function TopRatedSection({ movies }: TopRatedSectionProps) {
  return (
    <section className={styles.topRatedSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Top Rated Movies</h2>
            <p className={styles.subtitle}>
              The highest-rated Nigerian films as voted by critics and audiences
            </p>
          </div>
          <Link href="/top-rated">
            <Button variant="outline" className={styles.viewAllButton}>
              View All
              <ChevronRight className={styles.chevronIcon} />
            </Button>
          </Link>
        </div>
        
        <div className={styles.moviesGrid}>
          {movies.slice(0, 4).map((movie) => (
            <div key={movie.id} className={styles.movieCardWrapper}>
              <MovieCard movie={movie} variant="grid" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 