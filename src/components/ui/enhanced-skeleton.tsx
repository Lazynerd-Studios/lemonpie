import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./enhanced-skeleton.module.css";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "circular" | "rounded" | "text" | "button";
  animate?: boolean;
  width?: string | number;
  height?: string | number;
}

interface MovieSkeletonProps {
  variant?: "grid" | "list" | "featured" | "hero" | "carousel" | "minimal";
  count?: number;
  animate?: boolean;
  className?: string;
}

interface SectionSkeletonProps {
  title?: boolean;
  subtitle?: boolean;
  content?: "grid" | "list" | "carousel";
  count?: number;
  animate?: boolean;
  className?: string;
}

interface HeroSkeletonProps {
  animate?: boolean;
  className?: string;
}

interface NavigationSkeletonProps {
  animate?: boolean;
  className?: string;
}

interface ActorSkeletonProps {
  count?: number;
  animate?: boolean;
  className?: string;
}

// Base Skeleton Component
export function Skeleton({
  className,
  variant = "default",
  animate = true,
  width,
  height,
  ...props
}: SkeletonProps) {
  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        styles.skeleton,
        styles[variant],
        animate && styles.animate,
        className
      )}
      style={style}
      {...props}
    />
  );
}

// Movie Card Skeleton
export function MovieSkeleton({ 
  variant = "grid", 
  count = 1,
  animate = true,
  className
}: MovieSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "list":
        return (
          <div className={cn(styles.movieSkeletonList, className)}>
            <Skeleton 
              variant="rounded" 
              width="150px" 
              height="200px" 
              animate={animate}
              className={styles.poster}
            />
            <div className={styles.content}>
              <Skeleton 
                variant="text" 
                width="80%" 
                height="20px" 
                animate={animate}
                className={styles.title}
              />
              <div className={styles.meta}>
                <Skeleton variant="text" width="60px" height="14px" animate={animate} />
                <Skeleton variant="text" width="80px" height="14px" animate={animate} />
                <Skeleton variant="text" width="100px" height="14px" animate={animate} />
              </div>
              <div className={styles.genres}>
                <Skeleton variant="rounded" width="60px" height="20px" animate={animate} />
                <Skeleton variant="rounded" width="70px" height="20px" animate={animate} />
                <Skeleton variant="rounded" width="50px" height="20px" animate={animate} />
              </div>
              <Skeleton 
                variant="text" 
                width="100%" 
                height="60px" 
                animate={animate}
                className={styles.description}
              />
              <div className={styles.actions}>
                <Skeleton variant="button" width="120px" height="36px" animate={animate} />
                <Skeleton variant="button" width="120px" height="36px" animate={animate} />
              </div>
            </div>
          </div>
        );

      case "hero":
        return (
          <div className={cn(styles.movieSkeletonHero, className)}>
            <Skeleton 
              variant="rounded" 
              width="40%" 
              height="300px" 
              animate={animate}
              className={styles.poster}
            />
            <div className={styles.content}>
              <Skeleton 
                variant="text" 
                width="70%" 
                height="32px" 
                animate={animate}
                className={styles.title}
              />
              <div className={styles.meta}>
                <Skeleton variant="text" width="60px" height="16px" animate={animate} />
                <Skeleton variant="text" width="80px" height="16px" animate={animate} />
                <Skeleton variant="text" width="120px" height="16px" animate={animate} />
              </div>
              <div className={styles.genres}>
                <Skeleton variant="rounded" width="60px" height="24px" animate={animate} />
                <Skeleton variant="rounded" width="70px" height="24px" animate={animate} />
                <Skeleton variant="rounded" width="50px" height="24px" animate={animate} />
                <Skeleton variant="rounded" width="80px" height="24px" animate={animate} />
              </div>
              <Skeleton 
                variant="text" 
                width="100%" 
                height="80px" 
                animate={animate}
                className={styles.description}
              />
              <div className={styles.ratings}>
                <div className={styles.ratingRow}>
                  <Skeleton variant="text" width="80px" height="16px" animate={animate} />
                  <Skeleton variant="text" width="40px" height="16px" animate={animate} />
                </div>
                <div className={styles.ratingRow}>
                  <Skeleton variant="text" width="100px" height="16px" animate={animate} />
                  <Skeleton variant="text" width="40px" height="16px" animate={animate} />
                </div>
              </div>
              <div className={styles.actions}>
                <Skeleton variant="button" width="140px" height="40px" animate={animate} />
                <Skeleton variant="button" width="140px" height="40px" animate={animate} />
              </div>
            </div>
          </div>
        );

      case "carousel":
        return (
          <div className={cn(styles.movieSkeletonCarousel, className)}>
            <Skeleton 
              variant="rounded" 
              width="240px" 
              height="70%" 
              animate={animate}
              className={styles.poster}
            />
            <div className={styles.content}>
              <Skeleton 
                variant="text" 
                width="90%" 
                height="18px" 
                animate={animate}
                className={styles.title}
              />
              <div className={styles.meta}>
                <Skeleton variant="text" width="50px" height="14px" animate={animate} />
                <Skeleton variant="text" width="60px" height="14px" animate={animate} />
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div className={cn(styles.movieSkeletonMinimal, className)}>
            <Skeleton 
              variant="rounded" 
              width="100%" 
              height="200px" 
              animate={animate}
              className={styles.poster}
            />
            <div className={styles.content}>
              <Skeleton 
                variant="text" 
                width="80%" 
                height="16px" 
                animate={animate}
                className={styles.title}
              />
              <div className={styles.meta}>
                <Skeleton variant="text" width="40px" height="12px" animate={animate} />
                <Skeleton variant="text" width="50px" height="12px" animate={animate} />
              </div>
            </div>
          </div>
        );

      default: // grid
        return (
          <div className={cn(styles.movieSkeletonGrid, className)}>
            <Skeleton 
              variant="rounded" 
              width="100%" 
              height="300px" 
              animate={animate}
              className={styles.poster}
            />
            <div className={styles.content}>
              <Skeleton 
                variant="text" 
                width="85%" 
                height="20px" 
                animate={animate}
                className={styles.title}
              />
              <div className={styles.meta}>
                <Skeleton variant="text" width="50px" height="14px" animate={animate} />
                <Skeleton variant="text" width="60px" height="14px" animate={animate} />
              </div>
              <div className={styles.genres}>
                <Skeleton variant="rounded" width="50px" height="20px" animate={animate} />
                <Skeleton variant="rounded" width="60px" height="20px" animate={animate} />
                <Skeleton variant="rounded" width="45px" height="20px" animate={animate} />
              </div>
              <Skeleton 
                variant="text" 
                width="100%" 
                height="60px" 
                animate={animate}
                className={styles.description}
              />
              <div className={styles.actions}>
                <Skeleton variant="button" width="100%" height="36px" animate={animate} />
              </div>
            </div>
          </div>
        );
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className={cn(
      styles.movieSkeletonContainer,
      variant === "grid" && styles.gridContainer,
      variant === "list" && styles.listContainer,
      variant === "carousel" && styles.carouselContainer
    )}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.skeletonItem}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}

// Section Skeleton
export function SectionSkeleton({
  title = true,
  subtitle = true,
  content = "grid",
  count = 4,
  animate = true,
  className
}: SectionSkeletonProps) {
  return (
    <div className={cn(styles.sectionSkeleton, className)}>
      <div className={styles.sectionHeader}>
        {title && (
          <Skeleton 
            variant="text" 
            width="300px" 
            height="32px" 
            animate={animate}
            className={styles.sectionTitle}
          />
        )}
        {subtitle && (
          <Skeleton 
            variant="text" 
            width="500px" 
            height="18px" 
            animate={animate}
            className={styles.sectionSubtitle}
          />
        )}
      </div>
      <div className={styles.sectionContent}>
        <MovieSkeleton 
          variant={content} 
          count={count} 
          animate={animate}
        />
      </div>
    </div>
  );
}

// Hero Section Skeleton
export function HeroSkeleton({ animate = true, className }: HeroSkeletonProps) {
  return (
    <div className={cn(styles.heroSkeleton, className)}>
      <Skeleton 
        variant="default" 
        width="100%" 
        height="100vh" 
        animate={animate}
        className={styles.heroBackground}
      />
      <div className={styles.heroContent}>
        <Skeleton 
          variant="rounded" 
          width="120px" 
          height="24px" 
          animate={animate}
          className={styles.badge}
        />
        <Skeleton 
          variant="text" 
          width="60%" 
          height="64px" 
          animate={animate}
          className={styles.heroTitle}
        />
        <div className={styles.heroMeta}>
          <Skeleton variant="text" width="80px" height="20px" animate={animate} />
          <Skeleton variant="text" width="60px" height="20px" animate={animate} />
          <Skeleton variant="text" width="100px" height="20px" animate={animate} />
        </div>
        <div className={styles.heroGenres}>
          <Skeleton variant="rounded" width="60px" height="24px" animate={animate} />
          <Skeleton variant="rounded" width="70px" height="24px" animate={animate} />
          <Skeleton variant="rounded" width="50px" height="24px" animate={animate} />
        </div>
        <Skeleton 
          variant="text" 
          width="80%" 
          height="80px" 
          animate={animate}
          className={styles.heroDescription}
        />
        <Skeleton 
          variant="text" 
          width="70%" 
          height="20px" 
          animate={animate}
          className={styles.heroCast}
        />
        <div className={styles.heroActions}>
          <Skeleton variant="button" width="160px" height="48px" animate={animate} />
          <Skeleton variant="button" width="140px" height="48px" animate={animate} />
        </div>
      </div>
    </div>
  );
}

// Navigation Skeleton
export function NavigationSkeleton({ animate = true, className }: NavigationSkeletonProps) {
  return (
    <div className={cn(styles.navigationSkeleton, className)}>
      <Skeleton 
        variant="rounded" 
        width="120px" 
        height="32px" 
        animate={animate}
        className={styles.logo}
      />
      <div className={styles.navItems}>
        <Skeleton variant="text" width="60px" height="20px" animate={animate} />
        <Skeleton variant="text" width="80px" height="20px" animate={animate} />
        <Skeleton variant="text" width="90px" height="20px" animate={animate} />
        <Skeleton variant="text" width="60px" height="20px" animate={animate} />
        <Skeleton variant="text" width="70px" height="20px" animate={animate} />
      </div>
      <div className={styles.navActions}>
        <Skeleton variant="circular" width="36px" height="36px" animate={animate} />
        <Skeleton variant="circular" width="36px" height="36px" animate={animate} />
      </div>
    </div>
  );
}

// Actor Skeleton
export function ActorSkeleton({ 
  count = 6, 
  animate = true, 
  className 
}: ActorSkeletonProps) {
  return (
    <div className={cn(styles.actorSkeletonContainer, className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.actorSkeletonItem}>
          <Skeleton 
            variant="circular" 
            width="160px" 
            height="160px" 
            animate={animate}
            className={styles.actorImage}
          />
          <Skeleton 
            variant="text" 
            width="120px" 
            height="18px" 
            animate={animate}
            className={styles.actorName}
          />
          <Skeleton 
            variant="text" 
            width="40px" 
            height="14px" 
            animate={animate}
            className={styles.actorRating}
          />
        </div>
      ))}
    </div>
  );
} 