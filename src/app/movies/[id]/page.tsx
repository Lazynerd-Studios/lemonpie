import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Heart, 
  Share2, 
  MessageCircle,
  Award,
  ChevronLeft,
  Bookmark,
  Download,
  Camera,
  Film,
  User,
  Sparkles,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MovieCard } from "@/components/movie/movie-card";
import { formatRating, getRatingColor, formatDate } from "@/lib/utils";

interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop?: string;
  rating: number;
  criticsRating?: number;
  audienceRating?: number;
  genre: string[];
  year: number;
  duration: number;
  releaseDate?: string;
  description: string;
  director: string;
  writers?: string[];
  cast: Array<{ name: string; character: string }> | string[];
  isNollywood?: boolean;
  budget?: string;
  boxOffice?: string;
  awards?: string[];
  trailer?: string;
  language?: string;
  country?: string;
  popularity?: number;
  images?: string[];
}

// Enhanced movie data with more details and images
const movieData: Record<string, Movie> = {
  "king-of-boys-3": {
    id: "king-of-boys-3",
    title: "King of Boys: The Return of the King",
    poster: "/api/placeholder/movie/King of Boys The Return of the King/400x600",
    backdrop: "/api/placeholder/movie/King of Boys The Return of the King/1200x600",
    rating: 8.7,
    criticsRating: 8.2,
    audienceRating: 9.1,
    genre: ["Crime", "Drama", "Thriller"],
    year: 2023,
    duration: 165,
    releaseDate: "2023-08-27",
    description: "Eniola Salami returns in this epic conclusion to the King of Boys trilogy. After serving her time, she faces new challenges in a changed political landscape while dealing with family betrayals and the quest for redemption. This gripping finale explores themes of power, corruption, and the price of ambition in contemporary Nigeria.",
    director: "Kemi Adetiba",
    writers: ["Kemi Adetiba", "Olamide Niyi"],
    cast: [
      { name: "Sola Sobowale", character: "Eniola Salami" },
      { name: "Toni Tones", character: "Kemi Salami" },
      { name: "Richard Mofe-Damijo", character: "Odogwu Malay" },
      { name: "Illbliss", character: "Odogwu" },
      { name: "Nse Ikpe-Etim", character: "Jumoke Randle" },
    ],
    isNollywood: true,
    budget: "₦500M",
    boxOffice: "₦2.1B",
    awards: ["AMVCA Best Picture", "AMVCA Best Actress"],
    trailer: "https://youtube.com/watch?v=example",
    language: "English/Yoruba",
    country: "Nigeria",
    popularity: 95,
    images: [
      "/api/placeholder/movie/King of Boys The Return of the King/scene1/800x450",
      "/api/placeholder/movie/King of Boys The Return of the King/scene2/800x450",
      "/api/placeholder/movie/King of Boys The Return of the King/scene3/800x450",
      "/api/placeholder/movie/King of Boys The Return of the King/scene4/800x450",
      "/api/placeholder/movie/King of Boys The Return of the King/scene5/800x450",
      "/api/placeholder/movie/King of Boys The Return of the King/scene6/800x450",
    ],
  },
  "anikulapo": {
    id: "anikulapo",
    title: "Anikulapo",
    poster: "/api/placeholder/movie/Anikulapo/400x600",
    backdrop: "/api/placeholder/movie/Anikulapo/1200x600",
    rating: 9.0,
    criticsRating: 8.8,
    audienceRating: 9.2,
    genre: ["Fantasy", "Drama", "Romance"],
    year: 2022,
    duration: 142,
    releaseDate: "2022-09-30",
    description: "A young man's quest for greatness takes him on an epic journey filled with mystery, magic, and self-discovery in this Yoruba epic that explores themes of destiny, love, and the consequences of immortality.",
    director: "Kunle Afolayan",
    writers: ["Kunle Afolayan", "Tunde Babalola"],
    cast: [
      { name: "Kunle Remi", character: "Saro" },
      { name: "Bimbo Ademoye", character: "Arolake" },
      { name: "Sola Sobowale", character: "Awarun" },
      { name: "Hakeem Kae-Kazim", character: "Akala" },
    ],
    isNollywood: true,
    budget: "₦400M",
    boxOffice: "₦1.8B",
    awards: ["Best Cinematography", "Best Production Design"],
    trailer: "https://youtube.com/watch?v=example",
    language: "Yoruba",
    country: "Nigeria",
    popularity: 92,
    images: [
      "/api/placeholder/movie/Anikulapo/scene1/800x450",
      "/api/placeholder/movie/Anikulapo/scene2/800x450",
      "/api/placeholder/movie/Anikulapo/scene3/800x450",
      "/api/placeholder/movie/Anikulapo/scene4/800x450",
      "/api/placeholder/movie/Anikulapo/scene5/800x450",
      "/api/placeholder/movie/Anikulapo/scene6/800x450",
    ],
  },
  "the-black-book": {
    id: "the-black-book",
    title: "The Black Book",
    poster: "/api/placeholder/movie/The Black Book/400x600",
    backdrop: "/api/placeholder/movie/The Black Book/1200x600",
    rating: 8.4,
    criticsRating: 8.6,
    audienceRating: 8.2,
    genre: ["Thriller", "Action", "Crime"],
    year: 2023,
    duration: 124,
    releaseDate: "2023-09-22",
    description: "After his son is framed for a kidnapping, a bereaved deacon takes justice into his own hands and fights a corrupt police gang to absolve him. A gripping thriller that exposes the dark underbelly of law enforcement.",
    director: "Editi Effiong",
    writers: ["Editi Effiong", "Raphael Kalu"],
    cast: [
      { name: "Richard Mofe-Damijo", character: "Paul Edima" },
      { name: "Ade Laoye", character: "Detective Wale" },
      { name: "Sam Dede", character: "Commissioner" },
      { name: "Shaffy Bello", character: "Mrs. Edima" },
    ],
    isNollywood: true,
    budget: "₦350M",
    boxOffice: "₦1.5B",
    awards: ["Best Actor", "Best Thriller"],
    trailer: "https://youtube.com/watch?v=example",
    language: "English",
    country: "Nigeria",
    popularity: 89,
    images: [
      "/api/placeholder/movie/The Black Book/scene1/800x450",
      "/api/placeholder/movie/The Black Book/scene2/800x450",
      "/api/placeholder/movie/The Black Book/scene3/800x450",
      "/api/placeholder/movie/The Black Book/scene4/800x450",
      "/api/placeholder/movie/The Black Book/scene5/800x450",
      "/api/placeholder/movie/The Black Book/scene6/800x450",
    ],
  },
  "gangs-of-lagos": {
    id: "gangs-of-lagos",
    title: "Gangs of Lagos",
    poster: "/api/placeholder/movie/Gangs of Lagos/400x600",
    backdrop: "/api/placeholder/movie/Gangs of Lagos/1200x600",
    rating: 8.1,
    criticsRating: 7.9,
    audienceRating: 8.3,
    genre: ["Crime", "Action", "Drama"],
    year: 2023,
    duration: 124,
    releaseDate: "2023-04-07",
    description: "A group of friends from different backgrounds navigate the dangerous and complex underworld of Lagos, Nigeria. Their friendship is tested as they get deeper into the criminal world.",
    director: "Jade Osiberu",
    writers: ["Jade Osiberu", "Kay I. Ijoma"],
    cast: [
      { name: "Tobi Bakre", character: "Obalola" },
      { name: "Adesua Etomi-Wellington", character: "Gift" },
      { name: "Chike", character: "Kazeem" },
      { name: "Bimbo Ademoye", character: "Teni" },
    ],
    isNollywood: true,
    budget: "₦300M",
    boxOffice: "₦1.2B",
    awards: ["Best Action Film"],
    trailer: "https://youtube.com/watch?v=example",
    language: "English",
    country: "Nigeria",
    popularity: 87,
    images: [
      "/api/placeholder/movie/Gangs of Lagos/scene1/800x450",
      "/api/placeholder/movie/Gangs of Lagos/scene2/800x450",
      "/api/placeholder/movie/Gangs of Lagos/scene3/800x450",
      "/api/placeholder/movie/Gangs of Lagos/scene4/800x450",
      "/api/placeholder/movie/Gangs of Lagos/scene5/800x450",
      "/api/placeholder/movie/Gangs of Lagos/scene6/800x450",
    ],
  },
  "citation": {
    id: "citation",
    title: "Citation",
    poster: "/api/placeholder/movie/Citation/400x600",
    backdrop: "/api/placeholder/movie/Citation/1200x600",
    rating: 9.3,
    criticsRating: 9.1,
    audienceRating: 9.5,
    genre: ["Drama", "Social"],
    year: 2023,
    duration: 151,
    releaseDate: "2023-11-10",
    description: "A gripping drama that exposes the dark realities of sexual harassment in Nigerian universities. When a bright student faces unwanted advances from her professor, she must navigate a complex web of power, corruption, and societal pressure to seek justice.",
    director: "Kunle Afolayan",
    writers: ["Tunde Babalola", "Kunle Afolayan"],
    cast: [
      { name: "Temi Otedola", character: "Moremi Oluwa" },
      { name: "Sadiq Daba", character: "Professor Yahaya" },
      { name: "Adjetey Anang", character: "Kemi's Father" },
      { name: "Joke Silva", character: "Mrs. Oluwa" },
    ],
    isNollywood: true,
    budget: "₦600M",
    boxOffice: "₦2.3B",
    awards: ["Best Social Impact Film", "Best Actress"],
    trailer: "https://youtube.com/watch?v=example",
    language: "English",
    country: "Nigeria",
    popularity: 85,
    images: [
      "/api/placeholder/movie/Citation/scene1/800x450",
      "/api/placeholder/movie/Citation/scene2/800x450",
      "/api/placeholder/movie/Citation/scene3/800x450",
      "/api/placeholder/movie/Citation/scene4/800x450",
      "/api/placeholder/movie/Citation/scene5/800x450",
      "/api/placeholder/movie/Citation/scene6/800x450",
    ],
  },
  "brotherhood": {
    id: "brotherhood",
    title: "Brotherhood",
    poster: "/api/placeholder/movie/Brotherhood/400x600",
    backdrop: "/api/placeholder/movie/Brotherhood/1200x600",
    rating: 8.8,
    criticsRating: 8.5,
    audienceRating: 9.1,
    genre: ["Crime", "Action"],
    year: 2023,
    duration: 135,
    releaseDate: "2023-09-15",
    description: "Twin brothers on opposite sides of the law clash in this intense crime thriller. When one becomes a police officer and the other a criminal mastermind, their family bonds are tested in the ultimate showdown between justice and loyalty.",
    director: "Jade Osiberu",
    writers: ["Jade Osiberu", "Chinaza Onuzo"],
    cast: [
      { name: "Tobi Bakre", character: "Wale" },
      { name: "Falz", character: "Tunde" },
      { name: "Basketmouth", character: "Papa Ajasco" },
      { name: "Ronke Oshodi Oke", character: "Mama Wale" },
    ],
    isNollywood: true,
    budget: "₦450M",
    boxOffice: "₦1.9B",
    awards: ["Best Action Film", "Best Cinematography"],
    trailer: "https://youtube.com/watch?v=example",
    language: "English",
    country: "Nigeria",
    popularity: 84,
    images: [
      "/api/placeholder/movie/Brotherhood/scene1/800x450",
      "/api/placeholder/movie/Brotherhood/scene2/800x450",
      "/api/placeholder/movie/Brotherhood/scene3/800x450",
      "/api/placeholder/movie/Brotherhood/scene4/800x450",
      "/api/placeholder/movie/Brotherhood/scene5/800x450",
      "/api/placeholder/movie/Brotherhood/scene6/800x450",
    ],
  },
  "blood-covenant": {
    id: "blood-covenant",
    title: "Blood Covenant",
    poster: "/api/placeholder/movie/Blood Covenant/400x600",
    backdrop: "/api/placeholder/movie/Blood Covenant/1200x600",
    rating: 9.1,
    criticsRating: 8.9,
    audienceRating: 9.3,
    genre: ["Drama", "Thriller", "Mystery"],
    year: 2024,
    duration: 156,
    releaseDate: "2024-01-19",
    description: "A mysterious thriller that explores the dark secrets of a wealthy Nigerian family. When a family patriarch dies under suspicious circumstances, his children must uncover the truth about a blood covenant that binds them to a terrifying legacy.",
    director: "Fiyin Gambo",
    writers: ["Fiyin Gambo", "Nicole Asinugo"],
    cast: [
      { name: "Erica Nlewedim", character: "Kemi" },
      { name: "Shawn Faqua", character: "David" },
      { name: "Alexx Ekubo", character: "Michael" },
      { name: "Chioma Chukwuka", character: "Mrs. Adebayo" },
    ],
    isNollywood: true,
    budget: "₦500M",
    boxOffice: "₦2.5B",
    awards: ["Best Thriller", "Best Production Design"],
    trailer: "https://youtube.com/watch?v=example",
    language: "English",
    country: "Nigeria",
    popularity: 93,
    images: [
      "/api/placeholder/movie/Blood Covenant/scene1/800x450",
      "/api/placeholder/movie/Blood Covenant/scene2/800x450",
      "/api/placeholder/movie/Blood Covenant/scene3/800x450",
      "/api/placeholder/movie/Blood Covenant/scene4/800x450",
      "/api/placeholder/movie/Blood Covenant/scene5/800x450",
      "/api/placeholder/movie/Blood Covenant/scene6/800x450",
    ],
  },
  "jagun-jagun": {
    id: "jagun-jagun",
    title: "Jagun Jagun",
    poster: "/api/placeholder/movie/Jagun Jagun/400x600",
    backdrop: "/api/placeholder/movie/Jagun Jagun/1200x600",
    rating: 8.9,
    criticsRating: 8.7,
    audienceRating: 9.1,
    genre: ["Action", "Drama", "Historical"],
    year: 2023,
    duration: 134,
    releaseDate: "2023-08-10",
    description: "A young man's journey from a humble village to becoming a legendary warrior in ancient Yorubaland. This epic tale of courage, betrayal, and honor showcases the rich cultural heritage of Nigeria through stunning action sequences and powerful storytelling.",
    director: "Femi Adebayo",
    writers: ["Femi Adebayo", "Adebayo Tijani"],
    cast: [
      { name: "Femi Adebayo", character: "Gbotija" },
      { name: "Lateef Adedimeji", character: "Jagun" },
      { name: "Odunlade Adekola", character: "Ogundiji" },
      { name: "Bimbo Oshin", character: "Kiitan" },
    ],
    isNollywood: true,
    budget: "₦400M",
    boxOffice: "₦1.7B",
    awards: ["Best Historical Film", "Best Action Choreography"],
    trailer: "https://youtube.com/watch?v=example",
    language: "Yoruba",
    country: "Nigeria",
    popularity: 91,
    images: [
      "/api/placeholder/movie/Jagun Jagun/scene1/800x450",
      "/api/placeholder/movie/Jagun Jagun/scene2/800x450",
      "/api/placeholder/movie/Jagun Jagun/scene3/800x450",
      "/api/placeholder/movie/Jagun Jagun/scene4/800x450",
      "/api/placeholder/movie/Jagun Jagun/scene5/800x450",
      "/api/placeholder/movie/Jagun Jagun/scene6/800x450",
    ],
  },
};

const relatedMovies = [
  {
    id: "gangs-of-lagos",
    title: "Gangs of Lagos",
    poster: "/api/placeholder/movie/Gangs of Lagos/400x600",
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
    id: "anikulapo",
    title: "Anikulapo",
    poster: "/api/placeholder/movie/Anikulapo/400x600",
    rating: 9.0,
    criticsRating: 8.8,
    audienceRating: 9.2,
    genre: ["Fantasy", "Drama", "Romance"],
    year: 2022,
    duration: 142,
    description: "A young man's quest for greatness takes him on an epic journey filled with mystery, magic, and self-discovery.",
    director: "Kunle Afolayan",
    cast: ["Kunle Remi", "Bimbo Ademoye"],
    isNollywood: true,
  },
  {
    id: "the-black-book",
    title: "The Black Book",
    poster: "/api/placeholder/movie/The Black Book/400x600",
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
];

const reviews = [
  {
    id: "1",
    reviewer: "Emeka Nwankwo",
    reviewerType: "critic",
    rating: 8.5,
    title: "A Masterful Conclusion to an Epic Trilogy",
    content: "Kemi Adetiba delivers a masterclass in Nigerian thriller filmmaking that keeps you on the edge of your seat. The performances are stellar, particularly Sola Sobowale who brings depth and complexity to Eniola Salami. The cinematography captures the gritty reality of Nigerian politics while maintaining the series' signature style.",
    date: "2024-01-15",
    verified: true,
  },
  {
    id: "2",
    reviewer: "Sarah Johnson",
    reviewerType: "audience",
    rating: 9.2,
    title: "Absolutely Brilliant!",
    content: "This movie exceeded all my expectations. The storyline is gripping from start to finish, and the acting is phenomenal. Sola Sobowale is simply incredible as Eniola. The production quality is top-notch and proves that Nollywood can compete with the best globally.",
    date: "2024-01-14",
    verified: false,
  },
  {
    id: "3",
    reviewer: "David Ogbonna",
    reviewerType: "critic",
    rating: 8.0,
    title: "Strong Performances Elevate Political Thriller",
    content: "While the plot sometimes feels familiar, the strong performances and excellent direction make this a worthy conclusion to the trilogy. The film tackles corruption and power dynamics with nuance, and the technical aspects are impressive.",
    date: "2024-01-13",
    verified: true,
  },
];

interface MovieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const resolvedParams = await params;
  const movie = movieData[resolvedParams.id];

  if (!movie) {
    notFound();
  }

  const backdropUrl = movie.backdrop || movie.poster;
  const criticsRating = movie.criticsRating || movie.rating;
  const audienceRating = movie.audienceRating || movie.rating;
  const movieImages = movie.images || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover"
            priority
          />
          {/* Multi-layered gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        {/* Navigation Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Button asChild variant="outline" size="icon" className="bg-black/20 border-white/20 hover:bg-black/40">
            <Link href="/movies">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 flex min-h-[90vh] items-center">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
            <div className="grid gap-8 lg:grid-cols-5">
            {/* Movie Poster */}
              <div className="lg:col-span-2 flex justify-center lg:justify-start">
                <div className="relative group">
              <div className="relative w-80 max-w-full">
                    <div className="aspect-[2/3] overflow-hidden rounded-xl shadow-2xl transform transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    fill
                    className="object-cover"
                  />
                </div>
                
                    {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 space-y-2">
                      <Badge variant="rating" className="text-sm px-3 py-1 shadow-lg">
                    <Star className="mr-1 h-4 w-4 fill-current" />
                    {formatRating(movie.rating)}
                  </Badge>
                  {movie.isNollywood && (
                        <Badge variant="nollywood" className="block text-center shadow-lg">
                      Nollywood
                    </Badge>
                  )}
                    </div>

                    {/* Hover Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4">
                        <Button size="lg" className="rounded-full">
                          <Play className="h-6 w-6 mr-2 fill-current" />
                          Watch Trailer
                        </Button>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

              {/* Movie Information */}
              <div className="lg:col-span-3 space-y-6 text-white">
              <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  {movie.title}
                </h1>
                    <div className="flex items-center gap-2 mt-2">
                      {movie.language && (
                        <Badge variant="outline" className="border-white/30 text-white">
                          {movie.language}
                        </Badge>
                      )}
                      {movie.country && (
                        <Badge variant="outline" className="border-white/30 text-white">
                          {movie.country}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Movie Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                      <span className="font-medium">{movie.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                      <span className="font-medium">{movie.duration}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                      <span className="font-medium">{movie.director}</span>
                    </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((genre: string) => (
                      <Badge key={genre} variant="secondary" className="bg-white/10 text-white border-white/20">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Description */}
                  <div className="max-w-3xl">
                    <p className="text-lg leading-relaxed text-white/90">
                  {movie.description}
                </p>
                  </div>

                {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      <Play className="mr-2 h-5 w-5 fill-current" />
                    Watch Trailer
                  </Button>
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    <Heart className="mr-2 h-4 w-4" />
                    Add to Watchlist
                  </Button>
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Images Gallery */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Camera className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Movie Gallery</h2>
                </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {movieImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg aspect-video">
                <Image
                  src={image}
                  alt={`${movie.title} scene ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Badge variant="secondary" className="bg-black/80 text-white">
                    <Film className="h-3 w-3 mr-1" />
                    Scene {index + 1}
                  </Badge>
                </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redesigned Cast & Crew Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight">Cast & Crew</h2>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Enhanced Cast Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-nollywood-gold" />
                <h3 className="text-xl font-semibold">Main Cast</h3>
              </div>
              
              <div className="space-y-4">
                {Array.isArray(movie.cast) && movie.cast.map((actor, index: number) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary via-nollywood-gold to-primary flex items-center justify-center">
                            <User className="h-8 w-8 text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-nollywood-gold rounded-full flex items-center justify-center">
                            <Star className="h-3 w-3 text-white fill-current" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {typeof actor === 'string' ? actor : actor.name}
                          </h4>
                          {typeof actor === 'object' && actor.character && (
                            <p className="text-muted-foreground">
                              as <span className="font-medium text-primary">{actor.character}</span>
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              Actor
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Enhanced Production Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-nollywood-gold" />
                <h3 className="text-xl font-semibold">Production Details</h3>
              </div>
              
                <div className="space-y-4">
                {/* Director */}
                <Card className="border-l-4 border-l-nollywood-gold">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-nollywood-gold to-primary flex items-center justify-center">
                        <Film className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Director</p>
                        <p className="text-lg font-semibold">{movie.director}</p>
                      </div>
                </div>
              </CardContent>
            </Card>

                {/* Writers */}
                {movie.writers && (
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                          <p className="text-sm font-medium text-muted-foreground">Writers</p>
                          <p className="text-lg font-semibold">{movie.writers.join(", ")}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Release Date */}
                {movie.releaseDate && (
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                          <p className="text-sm font-medium text-muted-foreground">Release Date</p>
                          <p className="text-lg font-semibold">{formatDate(movie.releaseDate)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Budget & Box Office */}
                {(movie.budget || movie.boxOffice) && (
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {movie.budget && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">Budget</p>
                            <p className="text-lg font-semibold text-purple-600">{movie.budget}</p>
                          </div>
                        )}
                        {movie.boxOffice && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground">Box Office</p>
                            <p className="text-lg font-semibold text-green-600">{movie.boxOffice}</p>
                          </div>
                        )}
                  </div>
                    </CardContent>
                  </Card>
                )}

                {/* Awards */}
                {movie.awards && movie.awards.length > 0 && (
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          <p className="text-sm font-medium text-muted-foreground">Awards & Recognition</p>
                  </div>
                        <div className="flex flex-wrap gap-2">
                        {movie.awards.map((award: string, index: number) => (
                            <Badge key={index} variant="gradient-gold" className="text-xs">
                            <Award className="mr-1 h-3 w-3" />
                            {award}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    </CardContent>
                  </Card>
                  )}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Reviews */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
            <Button variant="outline" size="lg">
              <MessageCircle className="mr-2 h-4 w-4" />
              Write Review
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={review.reviewerType === "critic" ? "default" : "secondary"}>
                          {review.reviewerType}
                        </Badge>
                        {review.verified && (
                          <Badge variant="success" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{review.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by {review.reviewer} • {formatDate(review.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{review.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {review.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Related Movies */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight mb-8">You Might Also Like</h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(movieData).map((id) => ({
    id,
  }));
} 