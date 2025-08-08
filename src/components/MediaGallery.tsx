'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MediaGalleryProps {
  mediaUrls: string[];
  mediaTypes: string[];
}

export function MediaGallery({ mediaUrls, mediaTypes }: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});

  if (!mediaUrls?.length) return null;

  // Infer media type if mediaTypes is missing or incomplete
  const getType = (index: number, url: string): string => {
    const explicit = mediaTypes?.[index];
    if (explicit) return explicit;
    const lowered = (url || '').toLowerCase();
    if (/(\.mp4|\.webm|\.mov|\.avi)(\?|#|$)/.test(lowered)) return 'video/mp4';
    if (/(\.jpg|\.jpeg|\.png|\.webp|\.gif)(\?|#|$)/.test(lowered)) return 'image/jpeg';
    // Default to image to avoid black box; will still render if it's an image
    return 'image/jpeg';
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageLoad = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }));
  };

  // Ensure Cloudinary URLs have proper format and transformations
  const getOptimizedImageUrl = (url: string, transformation = 'c_fill,w_400,h_400,q_auto,f_auto') => {
    if (!url) return url;
    
    // If it's a Cloudinary URL (res.cloudinary.com or cloudinary.com), add transformation if missing
    if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com')) {
      const marker = '/upload/';
      const idx = url.indexOf(marker);
      if (idx !== -1) {
        const after = url.slice(idx + marker.length);
        // If a transformation already exists (starts with common transform tokens), keep as-is
        const hasTransform = /^(c_|w_|h_|q_|f_|g_|so_|e_)/.test(after);
        if (!hasTransform) {
          return `${url.slice(0, idx + marker.length)}${transformation}/${after}`;
        }
      }
      return url;
    }
    
    return url; // Return as-is for non-Cloudinary URLs
  };

  // For videos, generate a poster (thumbnail) from Cloudinary
  const getVideoPosterUrl = (url: string) => {
    if (!url) return '';
    if ((url.includes('res.cloudinary.com') || url.includes('cloudinary.com')) && url.includes('/upload/')) {
      // Build a robust Cloudinary poster URL (frame at 0s -> jpg)
      const [prefix, rest] = url.split('/upload/');
      const pathAndQuery = rest || '';
      const path = pathAndQuery.split('?')[0] || '';
      const pathWithJpg = path.replace(/\.[^/.]+$/i, '.jpg');
      const transformation = 'so_0,q_auto,f_jpg,c_fill,w_800,h_800';
      return `${prefix}/upload/${transformation}/${pathWithJpg}`;
    }
    return '';
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaUrls.length);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
  };

  // Grid layout based on number of items
  const getGridClass = () => {
    const count = mediaUrls.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  const getItemClass = (index: number) => {
    const count = mediaUrls.length;
    if (count === 3 && index === 0) return 'col-span-2';
    return '';
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextMedia();
    } else if (e.key === 'ArrowLeft') {
      prevMedia();
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid ${getGridClass()} gap-2 mt-3`}>
        {mediaUrls.slice(0, 4).map((url, index) => {
          const type = getType(index, url);
          const isVideo = type.startsWith('video/');
          const poster = isVideo ? getVideoPosterUrl(url) : undefined;
          if (process.env.NODE_ENV !== 'production') {
            // Helpful debug to verify what we're trying to render
            console.debug('[MediaGallery] item', { index, url, type, poster });
          }
          // Initialize loading state
          if (imageLoading[index] === undefined && !isVideo) {
            setImageLoading(prev => ({ ...prev, [index]: true }));
          }
          
          return (
          <div
            key={index}
            className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group ${getItemClass(index)}`}
            onClick={() => openLightbox(index)}
          >
            {isVideo ? (
              // Render poster as static image in grid to avoid black video boxes
              poster && !imageErrors[index] ? (
                <img
                  src={poster}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                </div>
              )
            ) : imageErrors[index] ? (
              // Error fallback
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ) : (
              <>
                <img
                  src={getOptimizedImageUrl(url)}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                  onError={() => handleImageError(index)}
                  onLoad={() => handleImageLoad(index)}
                />
                {imageLoading[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </>
            )}
            
            {/* Video play indicator */}
            {type.startsWith('video/') && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-3">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}

            {/* More items indicator */}
            {index === 3 && mediaUrls.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">+{mediaUrls.length - 4}</span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
          </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
              {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10 transition-colors"
              aria-label="Close lightbox"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation arrows */}
            {mediaUrls.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 transition-colors"
                  aria-label="Previous media"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 transition-colors"
                  aria-label="Next media"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Media content */}
            <div className="bg-white rounded-lg overflow-hidden">
              {getType(currentIndex, mediaUrls[currentIndex]).startsWith('video/') ? (
                <video
                  src={mediaUrls[currentIndex]}
                  className="max-w-full max-h-[80vh] w-auto h-auto"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={getOptimizedImageUrl(mediaUrls[currentIndex], 'c_limit,w_1200,h_800,q_auto,f_auto')}
                  alt=""
                  className="max-w-full max-h-[80vh] w-auto h-auto"
                  onError={(e) => {
                    console.error('Lightbox image failed to load:', mediaUrls[currentIndex]);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>

            {/* Media counter */}
            {mediaUrls.length > 1 && (
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white">
                {currentIndex + 1} / {mediaUrls.length}
              </div>
            )}

            {/* Media info */}
            <div className="absolute -bottom-12 left-0 text-white text-sm">
              <span className="bg-black/50 px-2 py-1 rounded">
                {getType(currentIndex, mediaUrls[currentIndex]).startsWith('video/') ? 'Video' : 'Image'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
