"use client";

import * as React from "react";
import { HeroSection } from '@/components/home/hero-section/hero-section';
import { TrendingSection } from '@/components/home/trending-section/trending-section';
import { TopRatedSection } from '@/components/home/top-rated-section/top-rated-section';
import { ComingSoonSection } from '@/components/home/coming-soon-section/coming-soon-section';
import { heroMovie, trendingActors, topRatedMovies, releasingSoon } from '@/data/homepage';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <HeroSection movie={heroMovie} />
      <TrendingSection actors={trendingActors} />
      <TopRatedSection movies={topRatedMovies} />
      <ComingSoonSection movies={releasingSoon} />
    </div>
  );
}
