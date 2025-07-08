"use client";

import * as React from "react";
import Image from "next/image";

interface Actor {
  id: string;
  name: string;
  image: string;
  rating: number;
}

interface TrendingActorsCarouselProps {
  actors: Actor[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export function TrendingActorsCarousel({ 
  actors, 
  currentPage, 
  itemsPerPage, 
  totalPages 
}: TrendingActorsCarouselProps) {
  const currentActors = actors.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="relative">
      {/* Actors Grid */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-6 gap-8 py-4">
          {currentActors.map((actor) => (
            <div
              key={actor.id}
              className="flex flex-col items-center gap-4 min-w-[180px] cursor-pointer group"
            >
              <div className="relative w-40 h-40 rounded-full overflow-hidden ring-2 ring-muted group-hover:ring-primary transition-all duration-300">
                <Image
                  src={actor.image}
                  alt={actor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center space-y-2">
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

      {/* Page Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === currentPage 
                  ? 'bg-primary' 
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 