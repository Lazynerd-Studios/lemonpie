"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Actor {
  id: string;
  name: string;
  image: string;
  rating: number;
}

interface TrendingActorsCarouselProps {
  actors: Actor[];
}

export function TrendingActorsCarousel({ actors }: TrendingActorsCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
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
    <div className="relative">
      {/* Navigation Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-muted transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-muted transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Actors Carousel */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide"
      >
        <div className="flex gap-8 pb-4">
          {actors.map((actor) => (
            <div
              key={actor.id}
              className="flex flex-col items-center gap-3 min-w-[150px] cursor-pointer group"
            >
              <div className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-muted group-hover:ring-primary transition-all duration-300">
                <Image
                  src={actor.image}
                  alt={actor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-sm whitespace-nowrap">
                  {actor.name}
                </h3>
                <p className="text-lg font-bold text-muted-foreground">
                  {actor.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 