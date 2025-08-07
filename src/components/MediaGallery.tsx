'use client';

import { useState } from 'react';

interface MediaGalleryProps {
  mediaUrls: string[];
  mediaTypes: string[];
}

export function MediaGallery({ mediaUrls, mediaTypes }: MediaGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!mediaUrls?.length) return null;

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
        {mediaUrls.slice(0, 4).map((url, index) => (
          <div
            key={index}
            className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group ${getItemClass(index)}`}
            onClick={() => openLightbox(index)}
          >
            {mediaTypes[index]?.startsWith('video/') ? (
              <video
                src={url}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                muted
                preload="metadata"
              />
            ) : (
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            )}
            
            {/* Video play indicator */}
            {mediaTypes[index]?.startsWith('video/') && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-3">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}

            {/* More items indicator */}
            {index === 3 && mediaUrls.length > 4 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">+{mediaUrls.length - 4}</span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
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
              {mediaTypes[currentIndex]?.startsWith('video/') ? (
                <video
                  src={mediaUrls[currentIndex]}
                  className="max-w-full max-h-[80vh] w-auto h-auto"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={mediaUrls[currentIndex]}
                  alt=""
                  className="max-w-full max-h-[80vh] w-auto h-auto"
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
              <span className="bg-black bg-opacity-50 px-2 py-1 rounded">
                {mediaTypes[currentIndex]?.startsWith('video/') ? 'Video' : 'Image'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
