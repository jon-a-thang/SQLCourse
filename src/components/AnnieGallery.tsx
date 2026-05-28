import { ANNIE_PHOTOS } from '../anniePhotos';

interface AnnieGalleryProps {
  /** grid = small strip, hero = one large, home = all photos featured */
  variant?: 'grid' | 'hero' | 'home';
  photoIndex?: number;
}

export function AnnieGallery({ variant = 'grid', photoIndex = 0 }: AnnieGalleryProps) {
  if (variant === 'hero') {
    const photo = ANNIE_PHOTOS[photoIndex] ?? ANNIE_PHOTOS[0];
    return (
      <figure className="annie-hero">
        <img src={photo.src} alt={photo.alt} />
        <figcaption>Meet Annie — your SQL study buddy 🐕</figcaption>
      </figure>
    );
  }

  if (variant === 'home') {
    return (
      <div className="annie-home-gallery" aria-label="Photos of Annie">
        <div className="annie-home-grid">
          {ANNIE_PHOTOS.map((photo, i) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={`${photo.alt}, photo ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="annie-gallery" aria-label="Photos of Annie">
      {ANNIE_PHOTOS.map((photo, i) => (
        <img key={photo.src} src={photo.src} alt={`${photo.alt}, photo ${i + 1}`} loading="lazy" />
      ))}
    </div>
  );
}
