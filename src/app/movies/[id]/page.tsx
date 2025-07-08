import * as React from "react";
import { notFound } from "next/navigation";
import { getMovie, getRelatedMovies, getMovieReviews } from "@/lib/api/movies";
import { MovieHero } from "@/components/movie-details/movie-hero/movie-hero";
import { MovieGallery } from "@/components/movie-details/movie-gallery/movie-gallery";
import { CastCrewSection } from "@/components/movie-details/cast-crew-section/cast-crew-section";
import { ReviewsSection } from "@/components/movie-details/reviews-section/reviews-section";
import { RelatedMoviesSection } from "@/components/movie-details/related-movies-section/related-movies-section";

interface MovieDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const movie = await getMovie(id);
  const relatedMovies = await getRelatedMovies(id);
  const reviews = await getMovieReviews(id);

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <MovieHero movie={movie} />
      <MovieGallery movie={movie} />
      <CastCrewSection movie={movie} />
      <ReviewsSection movie={movie} reviews={reviews} />
      <RelatedMoviesSection relatedMovies={relatedMovies} />
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { id: 'king-of-boys-3' },
    { id: 'anikulapo' },
    { id: 'the-black-book' },
    { id: 'gangs-of-lagos' },
    { id: 'citation' },
    { id: 'brotherhood' },
    { id: 'blood-covenant' },
    { id: 'jagun-jagun' },
  ];
} 