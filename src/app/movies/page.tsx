"use client";

import * as React from "react";
import { Search, Filter, SlidersHorizontal, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MovieCard } from "@/components/movie/movie-card";

// Mock data for movies
const movies = [
  {
    id: "king-of-boys-3",
    title: "King of Boys: The Return of the King",
    poster: "/api/placeholder/movie/King of Boys The Return of the King/300x450",
    rating: 8.7,
    criticsRating: 8.2,
    audienceRating: 9.1,
    genre: ["Crime", "Drama", "Thriller"],
    year: 2023,
    duration: 165,
    description: "Eniola Salami returns in this epic conclusion to the King of Boys trilogy. After serving her time, she faces new challenges in a changed political landscape while dealing with family betrayals and the quest for redemption.",
    director: "Kemi Adetiba",
    cast: ["Sola Sobowale", "Toni Tones", "Richard Mofe-Damijo"],
    isNollywood: true,
  },
  {
    id: "elevator-baby",
    title: "Elevator Baby",
    poster: "/api/placeholder/movie/Elevator Baby/300x450",
    rating: 7.8,
    criticsRating: 7.5,
    audienceRating: 8.1,
    genre: ["Comedy", "Drama"],
    year: 2023,
    duration: 110,
    description: "A chance encounter in an elevator leads to an unexpected journey of self-discovery and romance in modern Lagos.",
    director: "Akay Mason",
    cast: ["Timini Egbuson", "Bisola Aiyeola"],
    isNollywood: true,
  },
  {
    id: "gangs-of-lagos",
    title: "Gangs of Lagos",
    poster: "/api/placeholder/movie/Gangs of Lagos/300x450",
    rating: 8.1,
    criticsRating: 7.9,
    audienceRating: 8.3,
    genre: ["Crime", "Action", "Drama"],
    year: 2023,
    duration: 124,
    description: "A group of friends from different backgrounds navigate the dangerous and complex underworld of Lagos, Nigeria.",
    director: "Jade Osiberu",
    cast: ["Tobi Bakre", "Adesua Etomi-Wellington"],
    isNollywood: true,
  },
  {
    id: "the-black-book",
    title: "The Black Book",
    poster: "/api/placeholder/movie/The Black Book/300x450",
    rating: 8.4,
    criticsRating: 8.6,
    audienceRating: 8.2,
    genre: ["Thriller", "Action", "Crime"],
    year: 2023,
    duration: 124,
    description: "After his son is framed for a kidnapping, a bereaved deacon takes justice into his own hands and fights a corrupt police gang to absolve him.",
    director: "Editi Effiong",
    cast: ["Richard Mofe-Damijo", "Ade Laoye"],
    isNollywood: true,
  },
  {
    id: "anikulapo",
    title: "Anikulapo",
    poster: "/api/placeholder/movie/Anikulapo/300x450",
    rating: 9.0,
    criticsRating: 9.2,
    audienceRating: 8.8,
    genre: ["Fantasy", "Drama", "Romance"],
    year: 2022,
    duration: 142,
    description: "A young man's quest for success leads him to a mystical bird that grants him the power to raise the dead.",
    director: "Kunle Afolayan",
    cast: ["Kunle Remi", "Bimbo Ademoye"],
    isNollywood: true,
  },
  {
    id: "battle-on-buka-street",
    title: "Battle on Buka Street",
    poster: "/api/placeholder/movie/Battle on Buka Street/300x450",
    rating: 7.5,
    criticsRating: 7.8,
    audienceRating: 7.2,
    genre: ["Comedy", "Drama"],
    year: 2022,
    duration: 141,
    description: "Two women who have built a close relationship find themselves in the middle of a political battle that threatens their friendship.",
    director: "Funke Akindele",
    cast: ["Funke Akindele", "Mercy Johnson"],
    isNollywood: true,
  },
];

const genres = ["All", "Action", "Comedy", "Crime", "Drama", "Fantasy", "Romance", "Thriller"];
const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "year", label: "Newest" },
  { value: "title", label: "A-Z" },
  { value: "popular", label: "Most Popular" },
];

export default function MoviesPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedGenre, setSelectedGenre] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("rating");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredMovies = React.useMemo(() => {
    let filtered = movies;

    // Filter by genre
    if (selectedGenre !== "All") {
      filtered = filtered.filter(movie => 
        movie.genre.includes(selectedGenre)
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.cast.some(actor => 
          actor.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "year":
          return b.year - a.year;
        case "title":
          return a.title.localeCompare(b.title);
        case "popular":
          return b.audienceRating - a.audienceRating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedGenre, searchQuery, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Nigerian Movies
        </h1>
        <p className="text-xl text-muted-foreground">
          Discover and explore the best of Nollywood cinema
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies, directors, or actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Genre Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Genre:</span>
              <div className="flex flex-wrap gap-1">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          Showing {filteredMovies.length} of {movies.length} movies
        </p>
      </div>

      {/* Movies Grid/List */}
      {filteredMovies.length > 0 ? (
        <div className={
          viewMode === "grid" 
            ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-6"
        }>
          {filteredMovies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie}
              variant={viewMode === "list" ? "featured" : "default"}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="text-4xl">🎬</div>
              <h3 className="text-xl font-semibold">No movies found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre("All");
                  setSortBy("rating");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 