// Free movie poster images - Replace with your downloaded images
// These are placeholder/free sources - ensure you have proper licensing

export const moviePosters = {
  // Nigerian Movies - Free/Placeholder Sources
  "king-of-boys-3": "/images/posters/king-of-boys-3.jpg",
  "anikulapo": "/images/posters/anikulapo.jpg",
  "the-black-book": "/images/posters/the-black-book.jpg",
  "gangs-of-lagos": "/images/posters/gangs-of-lagos.jpg",
  "citation": "/images/posters/citation.jpg",
  "brotherhood": "/images/posters/brotherhood.jpg",
  "blood-covenant": "/images/posters/blood-covenant.jpg",
  "jagun-jagun": "/images/posters/jagun-jagun.jpg",
  "tribe-called-judah": "/images/posters/tribe-called-judah.jpg",
  "origin-madam-koi-koi": "/images/posters/origin-madam-koi-koi.jpg",
  "merry-men-3": "/images/posters/merry-men-3.jpg",
  "progressive-tailors": "/images/posters/progressive-tailors.jpg",
  "ijakumo": "/images/posters/ijakumo.jpg",
  "water-man": "/images/posters/water-man.jpg",
  "namaste-wahala": "/images/posters/namaste-wahala.jpg",
  "elevator-baby": "/images/posters/elevator-baby.jpg",
  "sugar-rush": "/images/posters/sugar-rush.jpg",
  "living-in-bondage": "/images/posters/living-in-bondage.jpg",
  "muna": "/images/posters/muna.jpg",
  "rattlesnake": "/images/posters/rattlesnake.jpg",
  "quam-1982": "/images/posters/quam-1982.jpg",
  "milkmaid": "/images/posters/milkmaid.jpg",
  "ghost-and-tout-too": "/images/posters/ghost-and-tout-too.jpg",
  "amina": "/images/posters/amina.jpg",
  "eyimofe": "/images/posters/eyimofe.jpg",
  "seven-and-half-dates": "/images/posters/seven-and-half-dates.jpg",
  "man-of-god": "/images/posters/man-of-god.jpg",
  "ajosepo": "/images/posters/ajosepo.jpg",
  "ile-owo": "/images/posters/ile-owo.jpg",
  "breaded-life": "/images/posters/breaded-life.jpg",
};

// Free temporary poster URLs (CC0/Public Domain)
// These are examples - replace with your own downloaded images
export const temporaryPosters = {
  // These are from Unsplash (free to use)
  fallback1: "https://images.unsplash.com/photo-1489599127280-4e64632f8ee8?w=400&h=600&fit=crop",
  fallback2: "https://images.unsplash.com/photo-1489599127280-4e64632f8ee8?w=400&h=600&fit=crop",
  fallback3: "https://images.unsplash.com/photo-1489599127280-4e64632f8ee8?w=400&h=600&fit=crop",
};

// Actor images
export const actorImages = {
  "genevieve-nnaji": "/images/actors/genevieve-nnaji.jpg",
  "ramsey-nouah": "/images/actors/ramsey-nouah.jpg",
  "funke-akindele": "/images/actors/funke-akindele.jpg",
  "jim-iyke": "/images/actors/jim-iyke.jpg",
  "mercy-johnson": "/images/actors/mercy-johnson.jpg",
  "richard-mofe-damijo": "/images/actors/richard-mofe-damijo.jpg",
  "omotola-jalade": "/images/actors/omotola-jalade.jpg",
  "nkem-owoh": "/images/actors/nkem-owoh.jpg",
};

// Helper function to get poster image
export function getMoviePoster(movieId: string): string {
  return moviePosters[movieId as keyof typeof moviePosters] || temporaryPosters.fallback1;
}

// Helper function to get actor image
export function getActorImage(actorId: string): string {
  const actorKey = actorId.toLowerCase().replace(/\s+/g, '-');
  return actorImages[actorKey as keyof typeof actorImages] || temporaryPosters.fallback1;
} 