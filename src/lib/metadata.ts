import type { Metadata } from "next";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  author?: string;
  tags?: string[];
}

const siteConfig = {
  name: "LemonnPie",
  description: "Nigeria's premier movie review and criticism platform - Your alternative to Rotten Tomatoes for Nollywood and African cinema.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lemonnpie.com",
  image: "/logo.svg",
  twitter: "@lemonnpie",
  creator: "LemonnPie Team"
};

export function generateMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.image,
  url = siteConfig.url,
  type = "website",
  publishedTime,
  author,
  tags = []
}: MetadataProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const fullUrl = url.startsWith("http") ? url : `${siteConfig.url}${url}`;
  const fullImage = image.startsWith("http") ? image : `${siteConfig.url}${image}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    applicationName: siteConfig.name,
    authors: [{ name: author || siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      locale: "en_NG", // Nigerian English
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullImage],
      creator: siteConfig.twitter,
      site: siteConfig.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
  };

  // Add article-specific metadata
  if (type === "article" && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      authors: author ? [author] : undefined,
      tags,
    };
  }

  // Add movie-specific metadata is handled through regular website type

  return metadata;
}

export function generateMovieMetadata(movie: {
  title: string;
  year: number;
  rating: number;
  genre: string[];
  poster?: string;
}) {
  return generateMetadata({
    title: `${movie.title} (${movie.year})`,
    description: `${movie.title} - ${movie.genre.join(", ")} movie with ${movie.rating}/10 rating. Read reviews and watch trailers on LemonnPie.`,
    image: movie.poster,
    type: "website",
    tags: [...movie.genre, "Nollywood", "Nigerian Cinema", "Movie Review"],
  });
}

export function generateActorMetadata(actor: {
  name: string;
  bio?: string;
  image?: string;
}) {
  return generateMetadata({
    title: actor.name,
    description: actor.bio || `Learn about ${actor.name}, a prominent figure in Nollywood and African cinema. Discover their movies, career highlights, and more on LemonnPie.`,
    image: actor.image,
    type: "profile",
    tags: ["Actor", "Nollywood", "Nigerian Cinema", "Biography"],
  });
}

export { siteConfig }; 