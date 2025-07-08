import * as React from "react";
import { TrendingActorsCarousel } from "@/components/ui/trending-actors-carousel";
import { Actor } from "@/types/actor";
import styles from "./trending-section.module.css";

interface TrendingSectionProps {
  actors: Actor[];
}

export function TrendingSection({ actors }: TrendingSectionProps) {
  return (
    <section className={styles.trendingSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Trending Actors</h2>
          <p className={styles.subtitle}>
            Discover the most popular actors in Nollywood right now
          </p>
        </div>
        
        <div className={styles.carouselWrapper}>
          <TrendingActorsCarousel actors={actors} />
        </div>
      </div>
    </section>
  );
} 