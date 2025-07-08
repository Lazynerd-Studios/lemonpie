import { Movie } from "@/types/movie";
import { movieData, relatedMovies, movieReviews } from "@/data/movies";

export async function getMovies(): Promise<Movie[]> {
  return Object.values(movieData);
}

export async function getMovie(id: string): Promise<Movie | null> {
  return movieData[id] || null;
}

export async function getRelatedMovies(movieId: string): Promise<Movie[]> {
  // For now, return static related movies
  // In the future, this would use actual logic to find related movies
  return relatedMovies as Movie[];
}

export async function getMovieReviews(movieId: string) {
  // For now, return static reviews
  // In the future, this would filter reviews by movie ID
  return movieReviews;
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const movies = await getMovies();
  return movies.sort((a, b) => b.rating - a.rating).slice(0, 10);
}

export async function getMoviesByGenre(genre: string): Promise<Movie[]> {
  const movies = await getMovies();
  return movies.filter(movie => 
    movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
  );
}

export async function getMoviesByYear(year: number): Promise<Movie[]> {
  const movies = await getMovies();
  return movies.filter(movie => movie.year === year);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const movies = await getMovies();
  const searchTerm = query.toLowerCase();
  
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm) ||
    movie.director.toLowerCase().includes(searchTerm) ||
    movie.genre.some(g => g.toLowerCase().includes(searchTerm)) ||
    movie.description.toLowerCase().includes(searchTerm)
  );
} 