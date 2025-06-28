import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Play, 
  Star, 
  Users, 
  Calendar,
  TrendingUp,
  Award,
  Heart,
  Plus,
  Info,
  ChevronRight,
  ChevronLeft,
  Clock,
  Fire
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MovieCard } from "@/components/movie/movie-card";
import { TrendingActorsCarousel } from "@/components/ui/trending-actors-carousel";

// Mock data for the enhanced homepage
const heroMovie = {
  id: "blood-covenant",
  title: "Blood Covenant",
  backdrop: "/api/placeholder/movie/Blood Covenant/1200x600",
  rating: 9.1,
  year: 2024,
  duration: 128,
  description: "A gripping tale of loyalty, betrayal, and redemption set against the backdrop of modern Lagos. When ancient traditions collide with contemporary life, a young man must choose between family honor and personal freedom.",
  genre: ["Drama", "Thriller", "Mystery"],
  cast: ["Ramsey Nouah", "Genevieve Nnaji", "Jim Iyke"],
  director: "Kunle Afolayan",
  isNollywood: true,
};

const trendingActors = [
  {
    id: "1",
    name: "Genevieve Nnaji",
    image: "/api/placeholder/actor/Genevieve Nnaji",
    rating: 98,
  },
  {
    id: "2", 
    name: "Ramsey Nouah",
    image: "/api/placeholder/actor/Ramsey Nouah",
    rating: 95,
  },
  {
    id: "3",
    name: "Funke Akindele",
    image: "/api/placeholder/actor/Funke Akindele",
    rating: 93,
  },
  {
    id: "4",
    name: "Jim Iyke",
    image: "/api/placeholder/actor/Jim Iyke",
    rating: 89,
  },
  {
    id: "5",
    name: "Mercy Johnson",
    image: "/api/placeholder/actor/Mercy Johnson",
    rating: 91,
  },
  {
    id: "6",
    name: "Richard Mofe-Damijo",
    image: "/api/placeholder/actor/Richard Mofe-Damijo",
    rating: 87,
  },
  {
    id: "7",
    name: "Omotola Jalade",
    image: "/api/placeholder/actor/Omotola Jalade",
    rating: 94,
  },
  {
    id: "8",
    name: "Nkem Owoh",
    image: "/api/placeholder/actor/Nkem Owoh",
    rating: 88,
  },
];

const releasingSoon = [
  {
    id: "uprising-2024",
    title: "The Uprising",
    poster: "/api/placeholder/movie/The Uprising/300x450",
    releaseDate: "2024-03-15",
    genre: ["Action", "Drama"],
    director: "Jade Osiberu",
    description: "A revolutionary tale of courage and sacrifice in pre-colonial Nigeria.",
    anticipation: 94,
  },
  {
    id: "lagos-nights",
    title: "Lagos Nights",
    poster: "/api/placeholder/movie/Lagos Nights/300x450",
    releaseDate: "2024-04-22",
    genre: ["Romance", "Comedy"],
    director: "Kemi Adetiba",
    description: "Love blooms in the bustling streets of Lagos in this romantic comedy.",
    anticipation: 87,
  },
  {
    id: "ancestral-calling",
    title: "Ancestral Calling",
    poster: "/api/placeholder/movie/Ancestral Calling/300x450",
    releaseDate: "2024-05-10",
    genre: ["Fantasy", "Adventure"],
    director: "Biyi Bandele",
    description: "A mystical journey through ancient African folklore and modern reality.",
    anticipation: 91,
  },
  {
    id: "corporate-ladder",
    title: "Corporate Ladder",
    poster: "/api/placeholder/movie/Corporate Ladder/300x450",
    releaseDate: "2024-06-05",
    genre: ["Thriller", "Drama"],
    director: "Stephanie Okereke",
    description: "Ambition and corruption in Nigeria's corporate world.",
    anticipation: 83,
  },
];

const topRatedMovies = [
  {
    id: "citation",
    title: "Citation",
    poster: "/api/placeholder/movie/Citation/300x450",
    rating: 9.3,
    criticsRating: 9.1,
    audienceRating: 9.5,
    genre: ["Drama", "Social"],
    year: 2023,
    duration: 151,
    description: "A powerful drama tackling sexual harassment in academic institutions.",
    director: "Kunle Afolayan",
    cast: ["Temi Otedola", "Jimmy Jean-Louis"],
    isNollywood: true,
  },
  {
    id: "king-of-thieves",
    title: "King of Thieves",
    poster: "/api/placeholder/movie/King of Thieves/300x450",
    rating: 9.0,
    criticsRating: 8.8,
    audienceRating: 9.2,
    genre: ["Adventure", "Drama"],
    year: 2023,
    duration: 114,
    description: "An epic tale of the legendary Yoruba warrior Ogundiji.",
    director: "Adze Ugah",
    cast: ["Tobi Bakre", "Adedimeji Lateef"],
    isNollywood: true,
  },
  {
    id: "brotherhood",
    title: "Brotherhood",
    poster: "/api/placeholder/movie/Brotherhood/300x450",
    rating: 8.8,
    criticsRating: 8.6,
    audienceRating: 9.0,
    genre: ["Crime", "Action"],
    year: 2023,
    duration: 120,
    description: "Twin brothers on opposite sides of the law in Lagos.",
    director: "Jade Osiberu",
    cast: ["Tobi Bakre", "Falz"],
    isNollywood: true,
  },
  {
    id: "water-man",
    title: "The Water Man",
    poster: "/api/placeholder/movie/The Water Man/300x450",
    rating: 8.6,
    criticsRating: 8.4,
    audienceRating: 8.8,
    genre: ["Fantasy", "Drama"],
    year: 2023,
    duration: 106,
    description: "A mystical tale of water spirits and human connection.",
    director: "Izu Ojukwu",
    cast: ["Nkem Owoh", "Patience Ozokwor"],
    isNollywood: true,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroMovie.backdrop}
            alt={heroMovie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl space-y-8">
              <div className="space-y-4">
                <Badge variant="default" className="glow-effect text-sm font-bold">
                  🎬 NEW NOLLYWOOD MASTERPIECE
                </Badge>
                
                <h1 className="text-5xl md:text-7xl font-bold text-white text-shadow">
                  {heroMovie.title}
                </h1>
                
                <div className="flex items-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-nollywood-gold fill-nollywood-gold" />
                    <span className="text-xl font-bold">{heroMovie.rating}</span>
                  </div>
                  <span>{heroMovie.year}</span>
                  <span>{heroMovie.duration}min</span>
                  <div className="flex gap-2">
                    {heroMovie.genre.slice(0, 2).map((g) => (
                      <Badge key={g} variant="outline" className="border-white/30 text-white">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                  {heroMovie.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gradient-bg-primary text-lg px-8 py-4">
                  <Play className="mr-3 h-6 w-6" />
                  Watch Now
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
                  <Info className="mr-3 h-6 w-6" />
                  More Info
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-6 py-4 border-white/30 text-white hover:bg-white/10">
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Actors Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-orange-500"></div>
              <h2 className="text-3xl font-bold">
                Trending Actors
              </h2>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>

          <TrendingActorsCarousel actors={trendingActors} />
        </div>
      </section>

      {/* Releasing Soon Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold gradient-text-gold">
                Coming Soon
              </h2>
              <p className="text-xl text-muted-foreground">
                Most anticipated Nollywood releases
              </p>
            </div>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/coming-soon">
                View Calendar
                <Calendar className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {releasingSoon.map((movie) => (
              <Card key={movie.id} className="cinema-card group cursor-pointer">
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="warning" className="text-xs font-bold">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(movie.releaseDate).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/80 rounded-full p-2">
                        <div className="text-xs text-nollywood-gold font-bold">
                          {movie.anticipation}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex gap-1">
                      {movie.genre.map((g) => (
                        <Badge key={g} variant="outline" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {movie.description}
                    </p>
                    <p className="text-xs text-nollywood-gold font-medium">
                      Directed by {movie.director}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Movies Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold gradient-text-primary">
                Top Rated Movies
              </h2>
              <p className="text-xl text-muted-foreground">
                Highest rated Nollywood films of all time
              </p>
            </div>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/top-rated">
                View All
                <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {topRatedMovies.map((movie, index) => (
              <Card key={movie.id} className="cinema-card group cursor-pointer relative">
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-white font-bold">#{index + 1}</span>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="default" className="bg-black/80 text-nollywood-gold border-nollywood-gold">
                        <Star className="mr-1 h-3 w-3 fill-current" />
                        {movie.rating}
                      </Badge>
                    </div>
                    {movie.isNollywood && (
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="outline" className="bg-nollywood-gold/20 border-nollywood-gold text-nollywood-gold">
                          Nollywood
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{movie.year}</span>
                      <span>•</span>
                      <span>{movie.duration}min</span>
                    </div>
                    <div className="flex gap-1">
                      {movie.genre.slice(0, 2).map((g) => (
                        <Badge key={g} variant="outline" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-success">{movie.criticsRating}</div>
                        <div className="text-muted-foreground">Critics</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-info">{movie.audienceRating}</div>
                        <div className="text-muted-foreground">Audience</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-lagos-orange/10 to-nollywood-gold/10">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold gradient-text-primary">
                Join Nigeria's Premier
                <br />Movie Community
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Connect with fellow Nollywood enthusiasts, discover hidden gems, 
                and celebrate the rich tapestry of African cinema.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-bg-primary text-lg px-8 py-4">
                <Heart className="mr-2 h-6 w-6" />
                Start Your Journey
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Users className="mr-2 h-6 w-6" />
                Become a Critic
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text-gold">50K+</div>
                <div className="text-muted-foreground">Movie Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text-gold">200+</div>
                <div className="text-muted-foreground">Professional Critics</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text-gold">1M+</div>
                <div className="text-muted-foreground">Community Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text-gold">3K+</div>
                <div className="text-muted-foreground">Nollywood Films</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
