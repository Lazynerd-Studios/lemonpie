"use client";

import * as React from "react";
import Image from "next/image";
import { Play, Star, SlidersHorizontal, Grid, List, LayoutGrid, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Movie interface for type safety
interface Movie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  genre: string[];
  year: number;
  popularity: number;
}

// Enhanced mock data for movies
const allMovies: Movie[] = [
  {
    id: "king-of-boys-3",
    title: "King of Boys: The Return of the King",
    poster: "/api/placeholder/movie/King of Boys The Return of the King/400x600",
    rating: 8.7,
    genre: ["Crime", "Drama", "Thriller"],
    year: 2023,
    popularity: 95,
  },
  {
    id: "anikulapo",
    title: "Anikulapo",
    poster: "/api/placeholder/movie/Anikulapo/400x600",
    rating: 9.0,
    genre: ["Fantasy", "Drama", "Romance"],
    year: 2022,
    popularity: 92,
  },
  {
    id: "the-black-book",
    title: "The Black Book",
    poster: "/api/placeholder/movie/The Black Book/400x600",
    rating: 8.4,
    genre: ["Thriller", "Action", "Crime"],
    year: 2023,
    popularity: 89,
  },
  {
    id: "gangs-of-lagos",
    title: "Gangs of Lagos",
    poster: "/api/placeholder/movie/Gangs of Lagos/400x600",
    rating: 8.1,
    genre: ["Crime", "Action", "Drama"],
    year: 2023,
    popularity: 87,
  },
  {
    id: "citation",
    title: "Citation",
    poster: "/api/placeholder/movie/Citation/400x600",
    rating: 9.3,
    genre: ["Drama", "Social"],
    year: 2023,
    popularity: 85,
  },
  {
    id: "brotherhood",
    title: "Brotherhood",
    poster: "/api/placeholder/movie/Brotherhood/400x600",
    rating: 8.8,
    genre: ["Crime", "Action"],
    year: 2023,
    popularity: 84,
  },
  {
    id: "elevator-baby",
    title: "Elevator Baby",
    poster: "/api/placeholder/movie/Elevator Baby/400x600",
    rating: 7.8,
    genre: ["Comedy", "Drama"],
    year: 2023,
    popularity: 82,
  },
  {
    id: "jagun-jagun",
    title: "Jagun Jagun",
    poster: "/api/placeholder/movie/Jagun Jagun/400x600",
    rating: 8.9,
    genre: ["Action", "Drama", "Historical"],
    year: 2024,
    popularity: 80,
  },
  {
    id: "battle-on-buka-street",
    title: "Battle on Buka Street",
    poster: "/api/placeholder/movie/Battle on Buka Street/400x600",
    rating: 7.5,
    genre: ["Comedy", "Drama"],
    year: 2022,
    popularity: 78,
  },
  {
    id: "king-of-thieves",
    title: "King of Thieves",
    poster: "/api/placeholder/movie/King of Thieves/400x600",
    rating: 9.0,
    genre: ["Adventure", "Drama"],
    year: 2023,
    popularity: 76,
  },
  {
    id: "water-man",
    title: "The Water Man",
    poster: "/api/placeholder/movie/The Water Man/400x600",
    rating: 8.6,
    genre: ["Fantasy", "Drama"],
    year: 2023,
    popularity: 74,
  },
  {
    id: "progressive-tailors",
    title: "Progressive Tailors Club",
    poster: "/api/placeholder/movie/Progressive Tailors Club/400x600",
    rating: 8.1,
    genre: ["Comedy", "Drama"],
    year: 2024,
    popularity: 72,
  },
];

const sortOptions = [
  { value: "popular", label: "Most popular first" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Newest first" },
  { value: "title", label: "A-Z" },
];

// Add filter options
const filterOptions = {
  genres: ["All Genres", "Action", "Comedy", "Crime", "Drama", "Fantasy", "Romance", "Thriller", "Historical", "Social", "Adventure"],
  years: ["All Years", "2024", "2023", "2022", "2021", "2020"],
  ratings: ["All Ratings", "9.0+", "8.0+", "7.0+", "6.0+"]
};

// Skeleton Loader Component
function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-muted animate-pulse">
      <div className="aspect-[3/4] bg-muted-foreground/20" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-muted-foreground/20 rounded w-3/4" />
        <div className="h-2 bg-muted-foreground/20 rounded w-1/2" />
      </div>
    </Card>
  );
}

// Movie Card Component with Lazy Loading
function MovieCard({ movie, viewMode, isLoading = false }: { movie: Movie; viewMode: string; isLoading?: boolean }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  if (isLoading) {
    return <MovieCardSkeleton />;
  }

  // Landscape view - horizontal layout
  if (viewMode === "landscape") {
    return (
      <Card 
        className="group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          <div className="relative w-32 h-48 flex-shrink-0 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              className={`object-cover transition-all duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            {/* Play Button Overlay */}
            <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-200 hover:scale-110">
                <Play className="h-6 w-6 text-black fill-black ml-0.5" />
              </div>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black/80 text-white border-0 text-xs">
                <Star className="h-3 w-3 mr-1 fill-orange-400 text-orange-400" />
                {movie.rating}
              </Badge>
            </div>
          </div>
          
          <div className="p-4 flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
              {movie.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {movie.year} • {movie.genre.join(", ")}
            </p>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              A captivating Nigerian film that showcases the rich storytelling tradition of Nollywood cinema.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view - reduced height
  return (
    <Card 
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className={`object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Play Button Overlay */}
        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="bg-white/90 hover:bg-white rounded-full p-4 transition-all duration-200 hover:scale-110">
            <Play className="h-8 w-8 text-black fill-black ml-1" />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-black/80 text-white border-0">
            <Star className="h-3 w-3 mr-1 fill-orange-400 text-orange-400" />
            {movie.rating} / 10
          </Badge>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors text-sm">
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {movie.year} • {movie.genre.join(", ")}
        </p>
      </div>
    </Card>
  );
}

export default function MoviesPage() {
  const [sortBy, setSortBy] = React.useState("popular");
  const [viewMode, setViewMode] = React.useState<"grid" | "list" | "landscape">("grid");
  const [isLoading, setIsLoading] = React.useState(true);
  const [displayedMovies, setDisplayedMovies] = React.useState<Movie[]>([]);
  
  // Add filter states
  const [selectedGenre, setSelectedGenre] = React.useState("All Genres");
  const [selectedYear, setSelectedYear] = React.useState("All Years");
  const [selectedRating, setSelectedRating] = React.useState("All Ratings");

  // Updated useEffect to handle filtering
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = [...allMovies];
      
      // Apply filters
      if (selectedGenre !== "All Genres") {
        filtered = filtered.filter(movie => movie.genre.includes(selectedGenre));
      }
      
      if (selectedYear !== "All Years") {
        filtered = filtered.filter(movie => movie.year.toString() === selectedYear);
      }
      
      if (selectedRating !== "All Ratings") {
        const minRating = parseFloat(selectedRating.replace("+", ""));
        filtered = filtered.filter(movie => movie.rating >= minRating);
      }
      
      // Apply sorting
      const sorted = filtered.sort((a, b) => {
        switch (sortBy) {
          case "popular":
            return b.popularity - a.popularity;
          case "rating":
            return b.rating - a.rating;
          case "newest":
            return b.year - a.year;
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
      setDisplayedMovies(sorted);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [sortBy, selectedGenre, selectedYear, selectedRating]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-1 bg-orange-500 rounded-full" />
            <h1 className="text-4xl font-bold">Browse Movies</h1>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {sortOptions.find(option => option.value === sortBy)?.label}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={sortBy === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Dropdown - Updated with actual filter options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-4">
                <div className="space-y-4">
                  {/* Genre Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Genre</label>
                    <select 
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full p-2 text-sm border rounded-md bg-background"
                    >
                      {filterOptions.genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Year Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Year</label>
                    <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full p-2 text-sm border rounded-md bg-background"
                    >
                      {filterOptions.years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <select 
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                      className="w-full p-2 text-sm border rounded-md bg-background"
                    >
                      {filterOptions.ratings.map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Clear Filters Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedGenre("All Genres");
                      setSelectedYear("All Years");
                      setSelectedRating("All Ratings");
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "landscape" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("landscape")}
                className="rounded-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Movies Grid - Updated to 6 columns for grid mode */}
        <div className={`grid gap-4 ${
          viewMode === "grid" 
            ? "grid-cols-6" 
            : viewMode === "landscape"
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "grid-cols-1"
        }`}>
          {isLoading
            ? Array.from({ length: 12 }).map((_, index) => (
                <MovieCardSkeleton key={index} />
              ))
            : displayedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
              ))
          }
        </div>

        {/* Load More Button */}
        {!isLoading && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" className="px-8">
              Load More Movies
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 