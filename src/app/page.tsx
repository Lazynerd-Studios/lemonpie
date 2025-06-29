import * as React from "react";
import Image from "next/image";
import { 
  Play, 
  Star,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingActorsCarousel } from "@/components/ui/trending-actors-carousel";
import { MovieCarousel } from "@/components/ui/movie-carousel";

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
    description: "Ambition and corruption in Nigeria&apos;s corporate world.",
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

const topLemons = [
  {
    id: "lemon-1",
    title: "Merry Men 2",
    poster: "/api/placeholder/movie/Merry Men 2/300x450",
    rating: 3.2,
    year: 2019,
    genre: ["Comedy", "Action"],
    reason: "Poor plot execution and forced comedy",
  },
  {
    id: "lemon-2", 
    title: "Ghost and the Tout",
    poster: "/api/placeholder/movie/Ghost and the Tout/300x450",
    rating: 2.8,
    year: 2018,
    genre: ["Comedy", "Fantasy"],
    reason: "Weak storyline and poor visual effects",
  },
  {
    id: "lemon-3",
    title: "My Village People",
    poster: "/api/placeholder/movie/My Village People/300x450",
    rating: 4.1,
    year: 2021,
    genre: ["Comedy", "Fantasy"],
    reason: "Overly stereotypical and lacks depth",
  },
  {
    id: "lemon-4",
    title: "Crazy People",
    poster: "/api/placeholder/movie/Crazy People/300x450",
    rating: 3.5,
    year: 2018,
    genre: ["Comedy"],
    reason: "Predictable humor and weak character development",
  },
  {
    id: "lemon-5",
    title: "The Grudge",
    poster: "/api/placeholder/movie/The Grudge/300x450",
    rating: 2.9,
    year: 2020,
    genre: ["Horror"],
    reason: "Failed horror attempt with poor execution",
  },
  {
    id: "lemon-6",
    title: "Area Boys",
    poster: "/api/placeholder/movie/Area Boys/300x450",
    rating: 3.8,
    year: 2019,
    genre: ["Action"],
    reason: "Clichéd storyline and weak character development",
  },
];

const nowInCinemas = [
  {
    id: "jagun-jagun",
    title: "Jagun Jagun",
    poster: "/api/placeholder/movie/Jagun Jagun/300x450",
    rating: 8.9,
    year: 2024,
    genre: ["Action", "Drama", "Historical"],
  },
  {
    id: "extraction-2",
    title: "A Tribe Called Judah",
    poster: "/api/placeholder/movie/A Tribe Called Judah/300x450",
    rating: 8.3,
    year: 2024,
    genre: ["Comedy", "Drama"],
  },
  {
    id: "the-origin",
    title: "The Origin: Madam Koi Koi",
    poster: "/api/placeholder/movie/The Origin Madam Koi Koi/300x450",
    rating: 7.8,
    year: 2024,
    genre: ["Horror", "Thriller"],
  },
  {
    id: "merry-men-3",
    title: "Merry Men 3: Nemesis",
    poster: "/api/placeholder/movie/Merry Men 3 Nemesis/300x450",
    rating: 7.5,
    year: 2024,
    genre: ["Action", "Comedy"],
  },
  {
    id: "progressive-tailors",
    title: "Progressive Tailors Club",
    poster: "/api/placeholder/movie/Progressive Tailors Club/300x450",
    rating: 8.1,
    year: 2024,
    genre: ["Comedy", "Drama"],
  },
  {
    id: "heavy-object",
    title: "Heavy Object",
    poster: "/api/placeholder/movie/Heavy Object/300x450",
    rating: 7.9,
    year: 2024,
    genre: ["Action", "Thriller"],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Hero Section - Reduced Height */}
      <section className="relative h-[80vh] overflow-hidden">
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
                  Trailer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Now in Cinemas Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <MovieCarousel 
            movies={nowInCinemas}
            title="Now in Cinemas"
          />
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
          <MovieCarousel 
            movies={releasingSoon.map(movie => ({
              id: movie.id,
              title: movie.title,
              poster: movie.poster,
              rating: movie.anticipation / 10, // Convert percentage to rating
              year: new Date(movie.releaseDate).getFullYear(),
              genre: movie.genre,
            }))}
            title="Coming Soon"
          />
        </div>
      </section>

      {/* Top Rated Movies Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <MovieCarousel 
            movies={topRatedMovies.map(movie => ({
              id: movie.id,
              title: movie.title,
              poster: movie.poster,
              rating: movie.rating,
              year: movie.year,
              genre: movie.genre,
            }))}
            title="Top rated movies"
          />
        </div>
      </section>

      {/* Top Lemons Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <MovieCarousel 
            movies={topLemons.map(movie => ({
              id: movie.id,
              title: movie.title,
              poster: movie.poster,
              rating: movie.rating,
              year: movie.year,
              genre: movie.genre,
            }))}
            title="Top Lemons 🍋"
          />
          
          <div className="text-center mt-8">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Even the best industry has its off days. Here are some films that didn&apos;t quite hit the mark.
            </p>
            <Button variant="outline" size="lg">
              View All Lemons
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
