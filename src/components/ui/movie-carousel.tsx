"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year?: number;
  genre?: string[];
}

interface MovieCarouselProps {
  movies: Movie[];
  title: string;
}

export function MovieCarousel({ movies, title }: MovieCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  React.useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
      return () => container.removeEventListener("scroll", checkScrollability);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
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

  return (
    <div className="relative group">
      {/* Section Title */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-8 w-1 bg-orange-500"></div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <ChevronRight className="h-6 w-6 text-muted-foreground" />
      </div>

      {/* Navigation Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 bg-black/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 bg-black/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Movies Carousel */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-4 pb-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none w-48 cursor-pointer group/movie"
            >
              {/* Movie Poster */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted mb-3">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover/movie:scale-105"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/movie:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border-2 border-white/30">
                    <Play className="h-8 w-8 text-white fill-white" />
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded px-2 py-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
                    <span className="text-white text-xs font-bold">
                      {movie.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Movie Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                  <span className="text-sm font-bold text-orange-500">
                    {movie.rating.toFixed(1)} / 10
                  </span>
                </div>
                <h3 className="font-semibold text-sm line-clamp-1 group-hover/movie:text-primary transition-colors">
                  {movie.title}
                </h3>
                {movie.year && (
                  <p className="text-xs text-muted-foreground">
                    {movie.year}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 