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
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MovieCard } from "@/components/movie/movie-card";
import { cn, formatRating, getRatingColor, formatDate } from "@/lib/utils";

// Mock movie data
const movieData: Record<string, any> = {
  "king-of-boys-3": {
    id: "king-of-boys-3",
    title: "King of Boys: The Return of the King",
    poster: "/api/placeholder/400/600",
    backdrop: "/api/placeholder/1200/600",
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
  },
};

const relatedMovies = [
  {
    id: "gangs-of-lagos",
    title: "Gangs of Lagos",
    poster: "/api/placeholder/300/450",
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
    poster: "/api/placeholder/300/450",
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
  params: {
    id: string;
  };
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const resolvedParams = await params;
  const movie = movieData[resolvedParams.id];

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={movie.backdrop}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Movie Poster */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-80 max-w-full">
                <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-2xl">
                  <Image
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Floating Ratings */}
                <div className="absolute -top-4 -right-4 space-y-2">
                  <Badge variant="rating" className="text-sm px-3 py-1">
                    <Star className="mr-1 h-4 w-4 fill-current" />
                    {formatRating(movie.rating)}
                  </Badge>
                  {movie.isNollywood && (
                    <Badge variant="nollywood" className="block text-center">
                      Nollywood
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Movie Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{movie.duration}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{movie.director}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((genre: string) => (
                    <Badge key={genre} variant="genre">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Description */}
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {movie.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="group">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Trailer
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="mr-2 h-4 w-4" />
                    Add to Watchlist
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ratings & Stats */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">
                  <span className={getRatingColor(movie.rating)}>
                    {formatRating(movie.rating)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Overall Rating</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">
                  <span className={getRatingColor(movie.criticsRating)}>
                    {formatRating(movie.criticsRating)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Critics Score</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2">
                  <span className={getRatingColor(movie.audienceRating)}>
                    {formatRating(movie.audienceRating)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Audience Score</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold mb-2 text-nollywood-gold">
                  {movie.boxOffice}
                </div>
                <p className="text-sm text-muted-foreground">Box Office</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cast & Crew */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Cast & Crew</h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Cast */}
            <Card>
              <CardHeader>
                <CardTitle>Main Cast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {movie.cast.map((actor: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{actor.name}</p>
                        <p className="text-sm text-muted-foreground">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crew & Details */}
            <Card>
              <CardHeader>
                <CardTitle>Production Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Director</p>
                    <p className="text-muted-foreground">{movie.director}</p>
                  </div>
                  <div>
                    <p className="font-medium">Writers</p>
                    <p className="text-muted-foreground">{movie.writers.join(", ")}</p>
                  </div>
                  <div>
                    <p className="font-medium">Release Date</p>
                    <p className="text-muted-foreground">{formatDate(movie.releaseDate)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Budget</p>
                    <p className="text-muted-foreground">{movie.budget}</p>
                  </div>
                  {movie.awards.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Awards</p>
                      <div className="flex flex-wrap gap-1">
                        {movie.awards.map((award: string, index: number) => (
                          <Badge key={index} variant="success" className="text-xs">
                            <Award className="mr-1 h-3 w-3" />
                            {award}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
            <Button variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              Write Review
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {reviews.map((review) => (
              <Card key={review.id}>
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
                    <div className="flex items-center gap-1">
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

      {/* Related Movies */}
      <section className="py-12">
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