export interface Movie {
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

export interface HeroMovie {
  id: string;
  title: string;
  backdrop: string;
  rating: number;
  year: number;
  duration: number;
  description: string;
  genre: string[];
  cast: string[];
  director: string;
  isNollywood?: boolean;
}

export interface ReleasingSoonMovie {
  id: string;
  title: string;
  poster: string;
  releaseDate: string;
  genre: string[];
  director: string;
  description: string;
  anticipation: number;
}

export interface TopLemonMovie {
  id: string;
  title: string;
  poster: string;
  rating: number;
  year: number;
  genre: string[];
  reason: string;
} 