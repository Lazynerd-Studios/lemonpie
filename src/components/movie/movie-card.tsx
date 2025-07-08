import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatRating, getRatingColor, truncateText } from "@/lib/utils";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    poster?: string;
    rating: number;
    criticsRating: number;
    audienceRating: number;
    genre: string[];
    year: number;
    duration: number;
    description: string;
    director: string;
    cast: string[];
    isNollywood?: boolean;
  };
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function MovieCard({ movie, variant = "default", className }: MovieCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <Card className={cn(
      "cinema-card group cursor-pointer",
      isFeatured && "lg:flex lg:flex-row",
      className
    )}>
      {/* Movie Poster */}
      <div className={cn(
        "relative overflow-hidden rounded-t-lg",
        isCompact ? "aspect-[2/3] w-full" : "aspect-[2/3] w-full",
        isFeatured && "lg:w-1/3 lg:aspect-[3/4] lg:rounded-l-lg lg:rounded-tr-none"
      )}>
        {movie.poster ? (
          <Image
            src={movie.poster}
            alt={`${movie.title} poster`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No Poster</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Nollywood Badge */}
        {movie.isNollywood && (
          <Badge
            variant="nollywood"
            className="absolute top-3 left-3 text-xs font-bold shadow-lg"
          >
            Nollywood
          </Badge>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-black/80 text-nollywood-gold border-nollywood-gold text-xs font-bold">
            <Star className="mr-1 h-3 w-3 fill-current" />
            {formatRating(movie.rating)}
          </Badge>
        </div>

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={`/movies/${movie.id}`}>
            <Button size="icon-lg" variant="cinema" className="rounded-full">
              <Star className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Movie Info */}
      <div className={cn("flex flex-col", isFeatured && "lg:w-2/3")}>
        <CardHeader className={cn(isCompact && "p-3")}>
          <div className="space-y-2">
            <h3 className={cn(
              "font-semibold leading-tight",
              isCompact ? "text-sm" : "text-lg",
              isFeatured && "lg:text-2xl"
            )}>
              <Link
                href={`/movies/${movie.id}`}
                className="hover:text-primary transition-colors"
              >
                {movie.title}
              </Link>
            </h3>
            
            {/* Movie Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{movie.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{movie.duration}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{movie.director}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        {!isCompact && (
          <CardContent className={cn("flex-1", isFeatured && "lg:p-6")}>
            {/* Genres */}
            <div className="mb-3 flex flex-wrap gap-1">
              {movie.genre.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="genre" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4">
              {truncateText(movie.description, isFeatured ? 200 : 120)}
            </p>

            {/* Ratings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Critics</span>
                <span className={getRatingColor(movie.criticsRating)}>
                  {formatRating(movie.criticsRating)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Audience</span>
                <span className={getRatingColor(movie.audienceRating)}>
                  {formatRating(movie.audienceRating)}
                </span>
              </div>
            </div>
          </CardContent>
        )}

        {!isCompact && (
          <CardFooter className={cn("pt-0", isFeatured && "lg:p-6 lg:pt-0")}>
            <div className="flex w-full gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/movies/${movie.id}`}>View Details</Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Add Review
              </Button>
            </div>
          </CardFooter>
        )}
      </div>
    </Card>
  );
} 