"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, SlidersHorizontal, Grid, LayoutGrid, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MovieSkeleton } from "@/components/ui/movie-skeleton";
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

// Enhanced mock data for movies - 30 Nigerian movies
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
    id: "blood-covenant",
    title: "Blood Covenant",
    poster: "/api/placeholder/movie/Blood Covenant/400x600",
    rating: 9.1,
    genre: ["Drama", "Thriller", "Mystery"],
    year: 2024,
    popularity: 93,
  },
  {
    id: "jagun-jagun",
    title: "Jagun Jagun",
    poster: "/api/placeholder/movie/Jagun Jagun/400x600",
    rating: 8.9,
    genre: ["Action", "Drama", "Historical"],
    year: 2023,
    popularity: 91,
  },
  {
    id: "tribe-called-judah",
    title: "A Tribe Called Judah",
    poster: "/api/placeholder/movie/A Tribe Called Judah/400x600",
    rating: 8.3,
    genre: ["Comedy", "Drama"],
    year: 2023,
    popularity: 88,
  },
  {
    id: "origin-madam-koi-koi",
    title: "The Origin: Madam Koi Koi",
    poster: "/api/placeholder/movie/The Origin Madam Koi Koi/400x600",
    rating: 7.8,
    genre: ["Horror", "Thriller"],
    year: 2023,
    popularity: 82,
  },
  {
    id: "merry-men-3",
    title: "Merry Men 3: Nemesis",
    poster: "/api/placeholder/movie/Merry Men 3 Nemesis/400x600",
    rating: 7.5,
    genre: ["Action", "Comedy"],
    year: 2023,
    popularity: 78,
  },
  {
    id: "progressive-tailors",
    title: "Progressive Tailors Club",
    poster: "/api/placeholder/movie/Progressive Tailors Club/400x600",
    rating: 8.1,
    genre: ["Comedy", "Drama"],
    year: 2023,
    popularity: 86,
  },
  {
    id: "ijakumo",
    title: "Ijakumo: The Born Again Stripper",
    poster: "/api/placeholder/movie/Ijakumo The Born Again Stripper/400x600",
    rating: 7.2,
    genre: ["Drama", "Comedy"],
    year: 2022,
    popularity: 75,
  },
  {
    id: "water-man",
    title: "The Water Man",
    poster: "/api/placeholder/movie/The Water Man/400x600",
    rating: 8.6,
    genre: ["Fantasy", "Drama"],
    year: 2023,
    popularity: 83,
  },
  {
    id: "namaste-wahala",
    title: "Namaste Wahala",
    poster: "/api/placeholder/movie/Namaste Wahala/400x600",
    rating: 7.9,
    genre: ["Romance", "Comedy"],
    year: 2020,
    popularity: 80,
  },
  {
    id: "elevator-baby",
    title: "Elevator Baby",
    poster: "/api/placeholder/movie/Elevator Baby/400x600",
    rating: 8.2,
    genre: ["Drama", "Thriller"],
    year: 2019,
    popularity: 77,
  },
  {
    id: "sugar-rush",
    title: "Sugar Rush",
    poster: "/api/placeholder/movie/Sugar Rush/400x600",
    rating: 7.6,
    genre: ["Comedy", "Crime"],
    year: 2019,
    popularity: 74,
  },
  {
    id: "living-in-bondage",
    title: "Living in Bondage: Breaking Free",
    poster: "/api/placeholder/movie/Living in Bondage Breaking Free/400x600",
    rating: 8.5,
    genre: ["Drama", "Thriller"],
    year: 2019,
    popularity: 81,
  },
  {
    id: "muna",
    title: "Muna",
    poster: "/api/placeholder/movie/Muna/400x600",
    rating: 8.0,
    genre: ["Drama", "Romance"],
    year: 2019,
    popularity: 76,
  },
  {
    id: "rattlesnake",
    title: "Rattlesnake: The Ahanna Story",
    poster: "/api/placeholder/movie/Rattlesnake The Ahanna Story/400x600",
    rating: 7.4,
    genre: ["Crime", "Drama"],
    year: 2020,
    popularity: 73,
  },
  {
    id: "quam-1982",
    title: "Quam's Money",
    poster: "/api/placeholder/movie/Quams Money/400x600",
    rating: 7.1,
    genre: ["Comedy", "Adventure"],
    year: 2020,
    popularity: 71,
  },
  {
    id: "milkmaid",
    title: "The Milkmaid",
    poster: "/api/placeholder/movie/The Milkmaid/400x600",
    rating: 8.7,
    genre: ["Drama", "War"],
    year: 2020,
    popularity: 79,
  },
  {
    id: "ghost-and-tout-too",
    title: "Ghost and the Tout Too",
    poster: "/api/placeholder/movie/Ghost and the Tout Too/400x600",
    rating: 6.8,
    genre: ["Comedy", "Fantasy"],
    year: 2021,
    popularity: 68,
  },
  {
    id: "amina",
    title: "Amina",
    poster: "/api/placeholder/movie/Amina/400x600",
    rating: 8.3,
    genre: ["Historical", "Drama"],
    year: 2021,
    popularity: 78,
  },
  {
    id: "eyimofe",
    title: "Eyimofe (This Is My Desire)",
    poster: "/api/placeholder/movie/Eyimofe This Is My Desire/400x600",
    rating: 8.8,
    genre: ["Drama", "Romance"],
    year: 2020,
    popularity: 82,
  },
  {
    id: "seven-and-half-dates",
    title: "Seven and a Half Dates",
    poster: "/api/placeholder/movie/Seven and a Half Dates/400x600",
    rating: 7.3,
    genre: ["Romance", "Comedy"],
    year: 2018,
    popularity: 70,
  },
  {
    id: "man-of-god",
    title: "Man of God",
    poster: "/api/placeholder/movie/Man of God/400x600",
    rating: 7.7,
    genre: ["Drama", "Biography"],
    year: 2022,
    popularity: 72,
  },
  {
    id: "ajosepo",
    title: "Ajosepo",
    poster: "/api/placeholder/movie/Ajosepo/400x600",
    rating: 7.0,
    genre: ["Comedy", "Drama"],
    year: 2022,
    popularity: 69,
  },
  {
    id: "ile-owo",
    title: "Ile Owo",
    poster: "/api/placeholder/movie/Ile Owo/400x600",
    rating: 7.8,
    genre: ["Drama", "Thriller"],
    year: 2022,
    popularity: 76,
  },
  {
    id: "breaded-life",
    title: "Breaded Life",
    poster: "/api/placeholder/movie/Breaded Life/400x600",
    rating: 7.5,
    genre: ["Comedy", "Drama"],
    year: 2021,
    popularity: 74,
  },
];

const sortOptions = [
  { value: "popular", label: "Most popular first" },
  { value: "rating", label: "Highest rated" },
  { value: "newest", label: "Newest first" },
  { value: "title", label: "A-Z" },
];

const filterOptions = {
  genres: ["All Genres", "Action", "Comedy", "Crime", "Drama", "Fantasy", "Romance", "Thriller"],
  years: ["All Years", "2024", "2023", "2022", "2021", "2020"],
  ratings: ["All Ratings", "9.0+", "8.0+", "7.0+", "6.0+"]
};

function MovieCard({ movie, viewMode }: { movie: Movie; viewMode: string }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  if (viewMode === "landscape") {
    return (
      <Link href={`/movies/${movie.id}`}>
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
                }`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
              
              {isHovered && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3">
                    <Play className="h-6 w-6 text-black fill-black ml-0.5" />
                  </div>
                </div>
              )}

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
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/movies/${movie.id}`}>
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
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {isHovered && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-3">
                <Play className="h-6 w-6 text-black fill-black ml-0.5" />
              </div>
            </div>
          )}

          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/80 text-white border-0 text-xs">
              <Star className="h-3 w-3 mr-1 fill-orange-400 text-orange-400" />
              {movie.rating}
            </Badge>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm truncate">
            {movie.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {movie.year} • {movie.genre[0]}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export default function MoviesPage() {
  const [sortBy, setSortBy] = React.useState("popular");
  const [viewMode, setViewMode] = React.useState("grid");
  const [displayedMovies, setDisplayedMovies] = React.useState<Movie[]>([]);
  const [allFilteredMovies, setAllFilteredMovies] = React.useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = React.useState("All Genres");
  const [selectedYear, setSelectedYear] = React.useState("All Years");
  const [selectedRating, setSelectedRating] = React.useState("All Ratings");
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const MOVIES_PER_PAGE = 12;

  // Simulate API call delay
  const simulateLoadingDelay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Load more movies function
  const loadMoreMovies = React.useCallback(async () => {
    if (isLoadingMore || displayedMovies.length >= allFilteredMovies.length) return;
    
    setIsLoadingMore(true);
    await simulateLoadingDelay(1000); // Simulate 1 second loading
    
    const nextPage = currentPage + 1;
    const newMovies = allFilteredMovies.slice(0, nextPage * MOVIES_PER_PAGE);
    
    setDisplayedMovies(newMovies);
    setCurrentPage(nextPage);
    setIsLoadingMore(false);
  }, [isLoadingMore, displayedMovies.length, currentPage, allFilteredMovies]);

  // Infinite scroll implementation
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreMovies]);

  // Initial load with skeleton
  React.useEffect(() => {
    const loadInitialMovies = async () => {
      setIsInitialLoading(true);
      await simulateLoadingDelay(2000); // Simulate 2 second loading
      
      let filtered = [...allMovies];
      
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
      
      setAllFilteredMovies(sorted);
      setDisplayedMovies(sorted.slice(0, MOVIES_PER_PAGE));
      setCurrentPage(1);
      setIsInitialLoading(false);
    };

    loadInitialMovies();
  }, [sortBy, selectedGenre, selectedYear, selectedRating]);

  const hasMoreMovies = displayedMovies.length < allFilteredMovies.length;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-1 bg-orange-500 rounded-full" />
              <h1 className="text-4xl font-bold">Browse Movies</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-32 bg-muted rounded animate-pulse" />
              <div className="h-10 w-24 bg-muted rounded animate-pulse" />
              <div className="h-10 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
          
          <MovieSkeleton viewMode={viewMode} count={MOVIES_PER_PAGE} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-1 bg-orange-500 rounded-full" />
            <h1 className="text-4xl font-bold">Browse Movies</h1>
          </div>

          <div className="flex items-center space-x-4">
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
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-4">
                <div className="space-y-4">
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

        <div className={`grid gap-4 ${
          viewMode === "grid" 
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        }`}>
          {displayedMovies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Infinite Scroll Loading Indicator */}
        {isLoadingMore && (
          <div className="flex justify-center items-center mt-8 py-8">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-lg font-medium">Loading more movies...</span>
            </div>
          </div>
        )}

        {/* End of results indicator */}
        {!hasMoreMovies && displayedMovies.length > 0 && (
          <div className="text-center mt-8 py-8">
            <div className="inline-flex items-center space-x-2 text-muted-foreground">
              <div className="h-px bg-border flex-1 w-20"></div>
              <span className="text-sm">You&apos;ve reached the end</span>
              <div className="h-px bg-border flex-1 w-20"></div>
            </div>
          </div>
        )}

        {/* Movies count indicator */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          Showing {displayedMovies.length} of {allFilteredMovies.length} movies
        </div>
      </div>
    </div>
  );
}
