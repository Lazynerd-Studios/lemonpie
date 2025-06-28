import * as React from "react";
import { Star, Filter, User, Award, Calendar, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getRatingColor } from "@/lib/utils";

const featuredReviews = [
  {
    id: "1",
    movieTitle: "King of Boys: The Return of the King",
    moviePoster: "/api/placeholder/120/180",
    reviewer: "Emeka Nwankwo",
    reviewerType: "critic",
    reviewerImage: "/api/placeholder/60/60",
    rating: 9.2,
    title: "A Masterful Conclusion to an Epic Nigerian Trilogy",
    excerpt: "Kemi Adetiba delivers a tour de force that elevates Nollywood to new heights. This conclusion to the King of Boys saga is not just entertainment—it's a cultural phenomenon that captures the essence of contemporary Nigerian power dynamics.",
    content: "In 'King of Boys: The Return of the King,' Kemi Adetiba crafts a narrative that transcends typical Nollywood boundaries. Sola Sobowale's portrayal of Eniola Salami is nothing short of magnificent, bringing layers of complexity to a character that has become iconic in Nigerian cinema. The film's exploration of political corruption, family loyalty, and the price of power resonates deeply within the Nigerian context while maintaining universal appeal. The cinematography by Yinka Edward captures Lagos with a gritty authenticity that places viewers directly into the heart of the action. What sets this film apart is its unflinching examination of power structures and the moral ambiguity of its characters.",
    date: "2024-01-15",
    verified: true,
    likes: 847,
    comments: 156,
    helpful: 95,
  },
  {
    id: "2",
    movieTitle: "Citation",
    moviePoster: "/api/placeholder/120/180",
    reviewer: "Sarah Johnson",
    reviewerType: "audience",
    reviewerImage: "/api/placeholder/60/60",
    rating: 8.8,
    title: "A Brave and Important Film That Needs to Be Seen",
    excerpt: "Kunle Afolayan tackles a difficult subject with sensitivity and power. 'Citation' is more than a movie—it's a conversation starter about issues that affect students across Africa.",
    content: "This film hit me on multiple levels. As someone who experienced similar situations during my university years, I found 'Citation' to be both triggering and healing. The performances are stellar, particularly Temi Otedola who brings incredible vulnerability and strength to her role. The film doesn't shy away from the uncomfortable realities of power dynamics in academic institutions. What I appreciate most is how it presents multiple perspectives without being preachy. The ending might feel abrupt to some, but I think it reflects the real-world reality that justice isn't always clear-cut. This is essential viewing for anyone in academia or anyone who cares about gender equality.",
    date: "2024-01-12",
    verified: false,
    likes: 1203,
    comments: 298,
    helpful: 89,
  },
];

const recentReviews = [
  {
    id: "3",
    movieTitle: "Blood Sisters",
    reviewer: "David Ogbonna",
    reviewerType: "critic",
    rating: 7.8,
    title: "Stylish Thriller with Strong Performances",
    excerpt: "While the plot occasionally stumbles, the stellar performances and slick direction make this worth watching.",
    date: "2024-01-10",
    verified: true,
    likes: 456,
    comments: 78,
  },
  {
    id: "4",
    movieTitle: "Gangs of Lagos",
    reviewer: "Funmi Adebayo",
    reviewerType: "audience",
    rating: 8.5,
    title: "Raw and Authentic Lagos Street Drama",
    excerpt: "Finally, a movie that shows Lagos as it really is. The action sequences are incredible!",
    date: "2024-01-09",
    verified: false,
    likes: 892,
    comments: 134,
  },
  {
    id: "5",
    movieTitle: "The Black Book",
    reviewer: "Chioma Okwu",
    reviewerType: "critic",
    rating: 8.9,
    title: "A Gripping Tale of Justice and Redemption",
    excerpt: "Richard Mofe-Damijo delivers a career-defining performance in this taut thriller.",
    date: "2024-01-08",
    verified: true,
    likes: 634,
    comments: 91,
  },
  {
    id: "6",
    movieTitle: "Elevator Baby",
    reviewer: "Michael Okafor",
    reviewerType: "audience",
    rating: 7.2,
    title: "Charming Comedy with Heart",
    excerpt: "Light-hearted fun with genuine moments of emotion. Perfect for a weekend watch.",
    date: "2024-01-07",
    verified: false,
    likes: 312,
    comments: 45,
  },
];

const topCritics = [
  {
    id: "1",
    name: "Emeka Nwankwo",
    image: "/api/placeholder/80/80",
    title: "Senior Film Critic",
    publication: "Nollywood Insider",
    reviews: 247,
    followers: 15600,
    expertise: ["Drama", "Thriller", "Social Commentary"],
  },
  {
    id: "2",
    name: "Chioma Okwu",
    image: "/api/placeholder/80/80",
    title: "Entertainment Editor",
    publication: "Lagos Film Review",
    reviews: 189,
    followers: 12400,
    expertise: ["Romance", "Comedy", "Independent Film"],
  },
  {
    id: "3",
    name: "David Ogbonna",
    image: "/api/placeholder/80/80",
    title: "Film Analyst",
    publication: "African Cinema Today",
    reviews: 156,
    followers: 9800,
    expertise: ["Action", "Crime", "Historical"],
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text-primary">
              Movie Reviews
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              In-depth reviews from professional critics and passionate audiences. 
              Discover what makes Nigerian cinema truly special.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gradient" size="lg">
                Write a Review
              </Button>
              <Button variant="outline" size="lg">
                <Filter className="mr-2 h-5 w-5" />
                Filter Reviews
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Reviews */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text-gold">
              Featured Reviews
            </h2>
            <p className="text-muted-foreground text-lg">
              Hand-picked reviews that showcase the depth of Nigerian cinema analysis
            </p>
          </div>

          <div className="space-y-8">
            {featuredReviews.map((review) => (
              <Card key={review.id} className="cinema-card">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-12 gap-6">
                    {/* Movie Poster */}
                    <div className="lg:col-span-2">
                      <div className="aspect-[2/3] overflow-hidden rounded-lg">
                        <img
                          src={review.moviePoster}
                          alt={review.movieTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="lg:col-span-10 space-y-6">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge variant={review.reviewerType === "critic" ? "default" : "outline"}>
                              {review.reviewerType}
                            </Badge>
                            {review.verified && (
                              <Badge variant="success" className="text-xs">
                                <Award className="mr-1 h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold text-white">
                            {review.title}
                          </h3>
                          <p className="text-muted-foreground">
                            Review of <span className="text-nollywood-gold font-medium">{review.movieTitle}</span>
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${getRatingColor(review.rating)}`}>
                              {review.rating}
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(review.rating / 2)
                                      ? "text-nollywood-gold fill-nollywood-gold"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reviewer Info */}
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <img
                            src={review.reviewerImage}
                            alt={review.reviewer}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{review.reviewer}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(review.date)}
                          </p>
                        </div>
                      </div>

                      {/* Review Text */}
                      <div className="space-y-4">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {review.excerpt}
                        </p>
                        <p className="text-muted-foreground leading-relaxed line-clamp-4">
                          {review.content}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{review.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span>{review.comments}</span>
                          </button>
                          <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <Share2 className="h-4 w-4" />
                            Share
                          </button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.helpful}% found this helpful
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reviews & Top Critics */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Reviews */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8 gradient-text-primary">
                Recent Reviews
              </h2>
              <div className="space-y-6">
                {recentReviews.map((review) => (
                  <Card key={review.id} className="cinema-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={review.reviewerType === "critic" ? "default" : "outline"}>
                                {review.reviewerType}
                              </Badge>
                              {review.verified && (
                                <Badge variant="success" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-bold text-white">{review.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {review.reviewer} • {formatDate(review.date)}
                            </p>
                          </div>
                          <div className={`text-xl font-bold ${getRatingColor(review.rating)}`}>
                            {review.rating}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">{review.excerpt}</p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <p className="text-nollywood-gold">{review.movieTitle}</p>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {review.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {review.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Top Critics */}
            <div>
              <h2 className="text-3xl font-bold mb-8 gradient-text-gold">
                Top Critics
              </h2>
              <div className="space-y-6">
                {topCritics.map((critic) => (
                  <Card key={critic.id} className="cinema-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden">
                          <img
                            src={critic.image}
                            alt={critic.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-bold text-white">{critic.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {critic.title} at {critic.publication}
                          </p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>{critic.reviews} reviews</span>
                            <span>{critic.followers.toLocaleString()} followers</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {critic.expertise.map((area) => (
                              <Badge key={area} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 