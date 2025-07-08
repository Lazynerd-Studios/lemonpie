import * as React from "react";
import { Users, Film, Award, Calendar, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/types/movie";
import { formatDate } from "@/lib/utils";
import styles from './cast-crew-section.module.css';

interface CastCrewSectionProps {
  movie: Movie;
}

export function CastCrewSection({ movie }: CastCrewSectionProps) {
  const formatBoxOffice = (amount: string) => {
    return amount.includes('₦') ? amount : `₦${amount}`;
  };

  return (
    <section className={styles.castCrewSection}>
      <div className={styles.container}>
        <div className={styles.sectionsGrid}>
          {/* Cast */}
          <div className={styles.castContainer}>
            <h2 className={styles.sectionTitle}>
              <Users className={styles.sectionIcon} />
              Cast
            </h2>
            
            <div className={styles.castGrid}>
              {Array.isArray(movie.cast) && movie.cast.length > 0 ? (
                movie.cast.map((member, index) => (
                  <div key={index} className={styles.castCard}>
                    <div className={styles.castAvatar}>
                      <Users className={styles.avatarIcon} />
                    </div>
                    <div className={styles.castInfo}>
                      <h3 className={styles.castName}>
                        {typeof member === 'string' ? member : member.name}
                      </h3>
                      {typeof member === 'object' && member.character && (
                        <p className={styles.castCharacter}>as {member.character}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noDataMessage}>
                  Cast information not available
                </div>
              )}
            </div>
          </div>

          {/* Production Details */}
          <div className={styles.productionContainer}>
            <h2 className={styles.sectionTitle}>
              <Film className={styles.sectionIcon} />
              Production Details
            </h2>
            
            <div className={styles.productionGrid}>
              <Card className={styles.productionCard + ' ' + styles.directorCard}>
                <CardContent className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <Award className={styles.cardIcon} />
                    <span className={styles.cardLabel}>Director</span>
                  </div>
                  <p className={styles.cardValue}>{movie.director}</p>
                </CardContent>
              </Card>

              {movie.writers && movie.writers.length > 0 && (
                <Card className={styles.productionCard + ' ' + styles.writersCard}>
                  <CardContent className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <Users className={styles.cardIcon} />
                      <span className={styles.cardLabel}>Writers</span>
                    </div>
                    <p className={styles.cardValue}>{movie.writers.join(', ')}</p>
                  </CardContent>
                </Card>
              )}

              <Card className={styles.productionCard + ' ' + styles.releaseCard}>
                <CardContent className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <Calendar className={styles.cardIcon} />
                    <span className={styles.cardLabel}>Release Date</span>
                  </div>
                  <p className={styles.cardValue}>
                    {formatDate(movie.releaseDate || `${movie.year}-01-01`)}
                  </p>
                </CardContent>
              </Card>

              {movie.budget && (
                <Card className={styles.productionCard + ' ' + styles.budgetCard}>
                  <CardContent className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <Trophy className={styles.cardIcon} />
                      <span className={styles.cardLabel}>Budget</span>
                    </div>
                    <p className={styles.cardValue}>{formatBoxOffice(movie.budget)}</p>
                  </CardContent>
                </Card>
              )}

              {movie.boxOffice && (
                <Card className={styles.productionCard + ' ' + styles.boxOfficeCard}>
                  <CardContent className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <Trophy className={styles.cardIcon} />
                      <span className={styles.cardLabel}>Box Office</span>
                    </div>
                    <p className={styles.cardValue}>{formatBoxOffice(movie.boxOffice)}</p>
                  </CardContent>
                </Card>
              )}

              {movie.awards && movie.awards.length > 0 && (
                <Card className={styles.productionCard + ' ' + styles.awardsCard}>
                  <CardContent className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <Award className={styles.cardIcon} />
                      <span className={styles.cardLabel}>Awards</span>
                    </div>
                    <div className={styles.awardsList}>
                      {movie.awards.map((award, index) => (
                        <Badge key={index} variant="outline" className={styles.awardBadge}>
                          🏆 {award}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 