import * as React from "react";
import { MessageCircle, Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/types/movie";
import { formatDate } from "@/lib/utils";
import styles from './reviews-section.module.css';

interface Review {
  id: string;
  reviewer: string;
  reviewerType: 'critic' | 'audience';
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
}

interface ReviewsSectionProps {
  movie: Movie;
  reviews: Review[];
}

export function ReviewsSection({ movie, reviews }: ReviewsSectionProps) {
  return (
    <section className={styles.reviewsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <MessageCircle className={styles.titleIcon} />
            Reviews & Ratings
          </h2>
          <div className={styles.ratingsOverview}>
            <div className={styles.ratingItem}>
              <div className={styles.ratingValue}>{movie.rating}</div>
              <div className={styles.ratingLabel}>Overall</div>
            </div>
            {movie.criticsRating && (
              <div className={styles.ratingItem}>
                <div className={styles.ratingValue + ' ' + styles.criticsRating}>
                  {movie.criticsRating}
                </div>
                <div className={styles.ratingLabel}>Critics</div>
              </div>
            )}
            {movie.audienceRating && (
              <div className={styles.ratingItem}>
                <div className={styles.ratingValue + ' ' + styles.audienceRating}>
                  {movie.audienceRating}
                </div>
                <div className={styles.ratingLabel}>Audience</div>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <Card key={review.id} className={styles.reviewCard}>
              <CardContent className={styles.reviewContent}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <div className={styles.reviewerAvatar}>
                      <User className={styles.avatarIcon} />
                    </div>
                    <div className={styles.reviewerDetails}>
                      <h3 className={styles.reviewerName}>{review.reviewer}</h3>
                      <div className={styles.reviewerBadges}>
                        <Badge 
                          variant={review.reviewerType === 'critic' ? 'default' : 'secondary'} 
                          className={styles.reviewerBadge}
                        >
                          {review.reviewerType === 'critic' ? '👨‍💼 Critic' : '👥 Audience'}
                        </Badge>
                        {review.verified && (
                          <Badge variant="outline" className={styles.verifiedBadge}>
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.reviewRating}>
                    <Star className={styles.starIcon} />
                    <span className={styles.ratingNumber}>{review.rating}</span>
                  </div>
                </div>
                
                <h4 className={styles.reviewTitle}>{review.title}</h4>
                <p className={styles.reviewText}>{review.content}</p>
                <div className={styles.reviewDate}>
                  {formatDate(review.date)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 