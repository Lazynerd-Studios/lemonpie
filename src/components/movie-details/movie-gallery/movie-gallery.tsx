import * as React from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Movie } from "@/types/movie";
import styles from './movie-gallery.module.css';

interface MovieGalleryProps {
  movie: Movie;
}

export function MovieGallery({ movie }: MovieGalleryProps) {
  if (!movie.images || movie.images.length === 0) {
    return null;
  }

  return (
    <section className={styles.gallerySection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Camera className={styles.headerIcon} />
          <h2 className={styles.title}>Movie Images</h2>
        </div>
        
        <div className={styles.imageGrid}>
          {movie.images.map((image, index) => (
            <div key={index} className={styles.imageContainer}>
              <Image
                src={image}
                alt={`${movie.title} scene ${index + 1}`}
                width={800}
                height={450}
                className={styles.image}
              />
              <div className={styles.imageOverlay}>
                <div className={styles.overlayContent}>
                  <Camera className={styles.overlayIcon} />
                  <p className={styles.overlayText}>Scene {index + 1}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 